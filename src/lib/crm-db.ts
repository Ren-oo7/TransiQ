import "server-only";

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import type { AdminRole } from "@/lib/admin-auth-types";
import { leadPriorities, pipelineStages, type LeadHistoryEntry, type LeadHistoryKind, type LeadPriority, type LeadStage, type SavedLead } from "@/lib/lead-types";

const dataDir = path.join(process.cwd(), ".data");
const dbFile = path.join(dataDir, "transiq-crm.db");
const legacyLeadsFile = path.join(dataDir, "leads.json");

type SeedUser = {
  email: string;
  name: string;
  role: AdminRole;
  password: string;
};

type LeadRow = {
  id: string;
  created_at: string;
  status: string;
  priority: string;
  owner: string;
  notes: string;
  next_follow_up_at: string;
  loss_reason: string;
  source: string;
  org_json: string;
  answers_json: string;
  diagnostic_json: string;
};

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  password_hash: string;
  created_at: string;
};

export type { UserRow };

type LeadHistoryRow = {
  id: string;
  lead_id: string;
  kind: string;
  message: string;
  created_at: string;
  actor_name: string;
  actor_role: string;
};

let dbInstance: DatabaseSync | null = null;
let initialized = false;

function isDevelopmentMode() {
  return process.env.NODE_ENV !== "production";
}

function ensureDataDir() {
  fs.mkdirSync(dataDir, { recursive: true });
}

function getDb() {
  ensureDataDir();
  if (!dbInstance) {
    dbInstance = new DatabaseSync(dbFile);
    dbInstance.exec("PRAGMA journal_mode = WAL;");
    dbInstance.exec("PRAGMA foreign_keys = ON;");
  }

  if (!initialized) {
    initializeDatabase(dbInstance);
    initialized = true;
  }

  return dbInstance;
}

function initializeDatabase(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'Media',
      owner TEXT NOT NULL,
      notes TEXT NOT NULL,
      next_follow_up_at TEXT NOT NULL DEFAULT '',
      loss_reason TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL,
      org_json TEXT NOT NULL,
      answers_json TEXT NOT NULL,
      diagnostic_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lead_history (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      actor_name TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );
  `);

  ensureLeadColumns(db);
  migrateLegacyLeads(db);
  seedUsers(db);
}

function hasColumn(db: DatabaseSync, table: string, column: string) {
  const rows = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  return rows.some((row) => row.name === column);
}

function ensureLeadColumns(db: DatabaseSync) {
  if (!hasColumn(db, "leads", "priority")) {
    db.exec("ALTER TABLE leads ADD COLUMN priority TEXT NOT NULL DEFAULT 'Media';");
  }

  if (!hasColumn(db, "leads", "next_follow_up_at")) {
    db.exec("ALTER TABLE leads ADD COLUMN next_follow_up_at TEXT NOT NULL DEFAULT '';");
  }

  if (!hasColumn(db, "leads", "loss_reason")) {
    db.exec("ALTER TABLE leads ADD COLUMN loss_reason TEXT NOT NULL DEFAULT '';");
  }
}

function hashPassword(password: string) {
  return crypto.scryptSync(password, "transiq-crm-salt", 64).toString("hex");
}

function safeJsonParse<T>(value: string, fallback: T) {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function normalizeLead(raw: Partial<SavedLead>): SavedLead | null {
  if (!raw.id || !raw.createdAt || !raw.org || !raw.diagnostic || !Array.isArray(raw.answers)) {
    return null;
  }

  return {
    id: raw.id,
    createdAt: raw.createdAt,
    status: pipelineStages.includes(raw.status as LeadStage) ? (raw.status as LeadStage) : "Nuevo",
    priority: leadPriorities.includes(raw.priority as LeadPriority) ? (raw.priority as LeadPriority) : "Media",
    owner: typeof raw.owner === "string" ? raw.owner : "Sin asignar",
    notes: typeof raw.notes === "string" ? raw.notes : "",
    nextFollowUpAt: typeof raw.nextFollowUpAt === "string" ? raw.nextFollowUpAt : "",
    lossReason: typeof raw.lossReason === "string" ? raw.lossReason : "",
    source: typeof raw.source === "string" && raw.source.trim() ? raw.source : "Diagnóstico público",
    org: raw.org,
    answers: raw.answers,
    diagnostic: raw.diagnostic,
    history: Array.isArray(raw.history) ? raw.history : [],
  };
}

function migrateLegacyLeads(db: DatabaseSync) {
  const count = db.prepare("SELECT COUNT(*) as total FROM leads").get() as { total: number };
  if (count.total > 0) return;
  if (!fs.existsSync(legacyLeadsFile)) return;

  const raw = fs.readFileSync(legacyLeadsFile, "utf8");
  const parsed = safeJsonParse<Partial<SavedLead>[]>(raw, []);
  if (!Array.isArray(parsed) || parsed.length === 0) return;

  const insert = db.prepare(`
    INSERT INTO leads (id, created_at, status, priority, owner, notes, next_follow_up_at, loss_reason, source, org_json, answers_json, diagnostic_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN");
  try {
    for (const item of parsed) {
      const lead = normalizeLead(item);
      if (!lead) continue;
      insert.run(
        lead.id,
        lead.createdAt,
        lead.status,
        lead.priority,
        lead.owner,
        lead.notes,
        lead.nextFollowUpAt,
        lead.lossReason,
        lead.source,
        JSON.stringify(lead.org),
        JSON.stringify(lead.answers),
        JSON.stringify(lead.diagnostic),
      );
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function getSeedUsers(): SeedUser[] {
  const directorEmail = process.env.TRANSIQ_DIRECTOR_EMAIL;
  const directorPassword = process.env.TRANSIQ_DIRECTOR_PASSWORD;
  const comercialEmail = process.env.TRANSIQ_COMERCIAL_EMAIL;
  const comercialPassword = process.env.TRANSIQ_COMERCIAL_PASSWORD;

  if (directorEmail && directorPassword && comercialEmail && comercialPassword) {
    return [
      {
        email: directorEmail,
        password: directorPassword,
        name: process.env.TRANSIQ_DIRECTOR_NAME || "Dirección TransiQ",
        role: "Director",
      },
      {
        email: comercialEmail,
        password: comercialPassword,
        name: process.env.TRANSIQ_COMERCIAL_NAME || "Comercial TransiQ",
        role: "Comercial",
      },
    ];
  }

  if (isDevelopmentMode()) {
    return [
      {
        email: "director@transiq.local",
        password: "TransiQ2026!",
        name: "Dirección TransiQ",
        role: "Director",
      },
      {
        email: "comercial@transiq.local",
        password: "TransiQ2026!",
        name: "Comercial TransiQ",
        role: "Comercial",
      },
    ];
  }

  throw new Error("Faltan credenciales iniciales para sembrar usuarios del CRM. Configura TRANSIQ_DIRECTOR_* y TRANSIQ_COMERCIAL_*.");
}

function seedUsers(db: DatabaseSync) {
  const count = db.prepare("SELECT COUNT(*) as total FROM users").get() as { total: number };
  if (count.total > 0) return;

  const users = getSeedUsers();
  const insert = db.prepare(`
    INSERT INTO users (id, email, name, role, password_hash, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN");
  try {
    for (const item of users) {
      insert.run(
        crypto.randomUUID(),
        item.email.toLowerCase(),
        item.name,
        item.role,
        hashPassword(item.password),
        new Date().toISOString(),
      );
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function isUsingDemoSeed() {
  return isDevelopmentMode() && !process.env.TRANSIQ_DIRECTOR_EMAIL && !process.env.TRANSIQ_COMERCIAL_EMAIL;
}

export function verifyUserCredentials(email: string, password: string) {
  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const row = db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1").get(normalizedEmail) as UserRow | undefined;
  if (!row) return null;

  const incomingHash = hashPassword(password);
  const incomingBuffer = Buffer.from(incomingHash, "hex");
  const storedBuffer = Buffer.from(row.password_hash, "hex");
  if (incomingBuffer.length !== storedBuffer.length) return null;
  if (!crypto.timingSafeEqual(incomingBuffer, storedBuffer)) return null;

  return {
    email: row.email,
    name: row.name,
    role: row.role as AdminRole,
  };
}

export function getUserRows() {
  const db = getDb();
  return db.prepare("SELECT id, email, name, role, created_at FROM users ORDER BY datetime(created_at) ASC").all() as UserRow[];
}

export function getLeadRows() {
  const db = getDb();
  return db.prepare("SELECT * FROM leads ORDER BY datetime(created_at) DESC").all() as LeadRow[];
}

export function insertLead(lead: SavedLead) {
  const db = getDb();
  db.prepare(`
    INSERT INTO leads (id, created_at, status, priority, owner, notes, next_follow_up_at, loss_reason, source, org_json, answers_json, diagnostic_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    lead.id,
    lead.createdAt,
    lead.status,
    lead.priority,
    lead.owner,
    lead.notes,
    lead.nextFollowUpAt,
    lead.lossReason,
    lead.source,
    JSON.stringify(lead.org),
    JSON.stringify(lead.answers),
    JSON.stringify(lead.diagnostic),
  );
}

export function insertLeadHistoryEntry(entry: LeadHistoryEntry) {
  const db = getDb();
  db.prepare(`
    INSERT INTO lead_history (id, lead_id, kind, message, created_at, actor_name, actor_role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    entry.id,
    entry.leadId,
    entry.kind,
    entry.message,
    entry.createdAt,
    entry.actorName,
    entry.actorRole,
  );
}

export function updateLeadRow(lead: SavedLead) {
  const db = getDb();
  db.prepare(`
    UPDATE leads
    SET status = ?, priority = ?, owner = ?, notes = ?, next_follow_up_at = ?, loss_reason = ?, org_json = ?, answers_json = ?, diagnostic_json = ?
    WHERE id = ?
  `).run(
    lead.status,
    lead.priority,
    lead.owner,
    lead.notes,
    lead.nextFollowUpAt,
    lead.lossReason,
    JSON.stringify(lead.org),
    JSON.stringify(lead.answers),
    JSON.stringify(lead.diagnostic),
    lead.id,
  );
}

export function findLeadRow(id: string) {
  const db = getDb();
  return db.prepare("SELECT * FROM leads WHERE id = ? LIMIT 1").get(id) as LeadRow | undefined;
}

export function getLeadHistoryRows(leadIds?: string[]) {
  const db = getDb();
  if (!leadIds?.length) {
    return db.prepare("SELECT * FROM lead_history ORDER BY datetime(created_at) DESC").all() as LeadHistoryRow[];
  }

  const placeholders = leadIds.map(() => "?").join(", ");
  return db
    .prepare(`SELECT * FROM lead_history WHERE lead_id IN (${placeholders}) ORDER BY datetime(created_at) DESC`)
    .all(...leadIds) as LeadHistoryRow[];
}

export function rowToLeadHistoryEntry(row: LeadHistoryRow): LeadHistoryEntry {
  return {
    id: row.id,
    leadId: row.lead_id,
    kind: row.kind as LeadHistoryKind,
    message: row.message,
    createdAt: row.created_at,
    actorName: row.actor_name,
    actorRole: row.actor_role,
  };
}

export function rowToLead(row: LeadRow, history: LeadHistoryEntry[] = []): SavedLead {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: pipelineStages.includes(row.status as LeadStage) ? (row.status as LeadStage) : "Nuevo",
    priority: leadPriorities.includes(row.priority as LeadPriority) ? (row.priority as LeadPriority) : "Media",
    owner: row.owner || "Sin asignar",
    notes: row.notes || "",
    nextFollowUpAt: row.next_follow_up_at || "",
    lossReason: row.loss_reason || "",
    source: row.source || "Diagnóstico público",
    org: safeJsonParse(row.org_json, {}),
    answers: safeJsonParse<string[]>(row.answers_json, []),
    diagnostic: safeJsonParse(row.diagnostic_json, {}),
    history,
  } as SavedLead;
}

export function getDatabaseFilePath() {
  return dbFile;
}
