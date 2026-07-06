import { NextResponse, type NextRequest } from "next/server";
import {
  authCookieName,
  canCloseLeads,
  canEditLead,
  canManageOwners,
  readSessionToken,
} from "@/lib/admin-auth";
import { pipelineStages } from "@/lib/lead-types";
import { createLead, getLeads, updateLead } from "@/lib/lead-store";

export const dynamic = "force-dynamic";

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Debes iniciar sesion para acceder al CRM interno." },
    { status: 401 },
  );
}

function forbiddenResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 403 });
}

export async function GET(request: NextRequest) {
  const session = readSessionToken(request.cookies.get(authCookieName)?.value);
  if (!session) return unauthorizedResponse();

  const leads = await getLeads();
  return NextResponse.json({ leads, pipelineStages, session });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const org = body?.org;
    const answers = Array.isArray(body?.answers) ? body.answers : [];
    const state = body?.state;

    if (!org?.company || !org?.contact) {
      return NextResponse.json(
        { error: "Captura al menos empresa y contacto para registrar el lead." },
        { status: 400 },
      );
    }

    if (!state || typeof state.score !== "number") {
      return NextResponse.json(
        { error: "No se recibio un diagnostico valido." },
        { status: 400 },
      );
    }

    const lead = await createLead({ org, answers, state });
    return NextResponse.json({ lead }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "No fue posible guardar el lead en este momento." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = readSessionToken(request.cookies.get(authCookieName)?.value);
  if (!session) return unauthorizedResponse();
  if (!canEditLead(session.role)) {
    return forbiddenResponse("Tu rol no tiene permisos para actualizar leads.");
  }

  try {
    const body = await request.json();
    const status = body?.status;
    const owner = body?.owner;
    const notes = body?.notes;

    if (!body?.id || typeof body.id !== "string") {
      return NextResponse.json({ error: "Falta el id del lead." }, { status: 400 });
    }

    if (status && !pipelineStages.includes(status)) {
      return NextResponse.json({ error: "La etapa seleccionada no es valida." }, { status: 400 });
    }

    if (status === "Cerrado" && !canCloseLeads(session.role)) {
      return forbiddenResponse("Solo Direccion puede cerrar oportunidades.");
    }

    if (typeof owner === "string" && owner.trim() && !canManageOwners(session.role)) {
      return forbiddenResponse("Solo Direccion puede reasignar responsables.");
    }

    const lead = await updateLead({
      id: body.id,
      status,
      owner: canManageOwners(session.role) ? owner : undefined,
      notes,
    });

    if (!lead) {
      return NextResponse.json({ error: "No se encontro el lead solicitado." }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch {
    return NextResponse.json(
      { error: "No fue posible actualizar el lead." },
      { status: 500 },
    );
  }
}
