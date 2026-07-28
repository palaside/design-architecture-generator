import { deleteBlueprint, getBlueprint, refineBlueprint } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getBlueprint(id);
  if (!data) return Response.json({ ok: false, error: "ไม่พบพิมพ์เขียวนี้" }, { status: 404 });
  return Response.json({ ok: true, ...data });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "รูปแบบ JSON ไม่ถูกต้อง" }, { status: 400 });
  }

  const raw = Array.isArray(payload.answers) ? payload.answers : [];
  const answers = raw
    .filter((a): a is { question: string; answer: string } => {
      if (typeof a !== "object" || a === null) return false;
      const obj = a as Record<string, unknown>;
      return typeof obj.question === "string" && typeof obj.answer === "string";
    })
    .map((a) => ({ question: a.question.slice(0, 400), answer: a.answer.trim().slice(0, 600) }))
    .filter((a) => a.answer.length > 0);

  if (answers.length === 0) {
    return Response.json({ ok: false, error: "กรุณาตอบอย่างน้อย 1 คำถาม" }, { status: 400 });
  }

  const result = await refineBlueprint(id, answers);
  if (!result) return Response.json({ ok: false, error: "ไม่พบพิมพ์เขียวนี้" }, { status: 404 });
  return Response.json({ ok: true, id: result });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteBlueprint(id);
  return Response.json({ ok: true });
}
