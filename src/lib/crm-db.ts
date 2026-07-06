import "server-only";

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import type { AdminRole } from "@/lib/admin-auth-types";
import { pipelineStages, type LeadStage, type SavedLead } from "@/lib/lead-types";

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
  owner: string;
  notes: string;
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
      owner TEXT NOT NULL,
      notes TEXT NOT NULL,
      source TEXT NOT NULL,
      org_json TEXT NOT NULL,
      answers_json TEXT NOT NULL,
      diagnostic_json TEXT NOT NULL
    );
  `);

  migrateLegacyLeads(db);
  seedUsers(db);
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
    owner: typeof raw.owner === "string" ? raw.owner : "Sin asignar",
    notes: typeof raw.notes === "string" ? raw.notes : "",
    source: "Diagnostico publico",
    org: raw.org,
    answers: raw.answers,
    diagnostic: raw.diagnostic,
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
    INSERT INTO leads (id, created_at, status, owner, notes, source, org_json, answers_json, diagnostic_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        lead.owner,
        lead.notes,
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
        name: process.env.TRANSIQ_DIRECTOR_NAME || "Direccion TransiQ",
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
        name: "Direccion TransiQ",
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

export function getLeadRows() {
  const db = getDb();
  return db.prepare("SELECT * FROM leads ORDER BY datetime(created_at) DESC").all() as LeadRow[];
}

export function insertLead(lead: SavedLead) {
  const db = getDb();
  db.prepare(`
    INSERT INTO leads (id, created_at, status, owner, notes, source, org_json, answers_json, diagnostic_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    lead.id,
    lead.createdAt,
    lead.status,
    lead.owner,
    lead.notes,
    lead.source,
    JSON.stringify(lead.org),
    JSON.stringify(lead.answers),
    JSON.stringify(lead.diagnostic),
  );
}

export function updateLeadRow(lead: SavedLead) {
  const db = getDb();
  db.prepare(`
    UPDATE leads
    SET status = ?, owner = ?, notes = ?, org_json = ?, answers_json = ?, diagnostic_json = ?
    WHERE id = ?
  `).run(
    lead.status,
    lead.owner,
    lead.notes,
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

export function rowToLead(row: LeadRow): SavedLead {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: pipelineStages.includes(row.status as LeadStage) ? (row.status as LeadStage) : "Nuevo",
    owner: row.owner || "Sin asignar",
    notes: row.notes || "",
    source: "Diagnostico publico",
    org: safeJsonParse(row.org_json, {}),
    answers: safeJsonParse<string[]>(row.answers_json, []),
    diagnostic: safeJsonParse(row.diagnostic_json, {}),
  } as SavedLead;
}

export function getDatabaseFilePath() {
  return dbFile;
}
