import { createBlueprint, listBlueprints } from "@/lib/repo";
import type { Audience, Depth, GenerateInput, Language, TargetModel } from "@/lib/types";

export const dynamic = "force-dynamic";

const LANGUAGES: Language[] = ["th", "bilingual", "en"];
const DEPTHS: Depth[] = ["lite", "production", "enterprise"];
const AUDIENCES: Audience[] = ["dev_team", "founder", "agency", "student"];
const MODELS: TargetModel[] = ["generic", "claude", "gpt", "gemini"];

function pick<T extends string>(value: unknown, allowed: T[], fallback: T): T {
  return typeof value === "string" && (allowed as string[]).includes(value) ? (value as T) : fallback;
}

export async function GET() {
  const items = await listBlueprints();
  return Response.json({ ok: true, items });
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "รูปแบบ JSON ไม่ถูกต้อง" }, { status: 400 });
  }

  const requirement = typeof payload.requirement === "string" ? payload.requirement.trim() : "";
  if (requirement.length < 6) {
    return Response.json({ ok: false, error: "กรุณาระบุความต้องการอย่างน้อย 6 ตัวอักษร" }, { status: 400 });
  }
  if (requirement.length > 2000) {
    return Response.json({ ok: false, error: "ความต้องการยาวเกิน 2,000 ตัวอักษร" }, { status: 400 });
  }

  const input: GenerateInput = {
    requirement,
    language: pick(payload.language, LANGUAGES, "th"),
    depth: pick(payload.depth, DEPTHS, "production"),
    audience: pick(payload.audience, AUDIENCES, "dev_team"),
    targetModel: pick(payload.targetModel, MODELS, "generic"),
  };

  try {
    const id = await createBlueprint(input);
    return Response.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "compile failed";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
