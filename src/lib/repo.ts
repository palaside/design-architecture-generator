import { db } from "@/db";
import { blueprintSections, blueprints, runEvents } from "@/db/schema";
import { compileBlueprint } from "@/lib/engine";
import type { Analysis, CompiledBlueprint, GenerateInput, ReversePrompt, TechStack } from "@/lib/types";
import { desc, eq, sql } from "drizzle-orm";

export interface BlueprintRecord {
  id: string;
  requirement: string;
  title: string;
  subtitle: string;
  domainKey: string;
  domainLabel: string;
  language: string;
  depth: string;
  audience: string;
  targetModel: string;
  analysis: Analysis;
  techStack: TechStack;
  reversePrompt: ReversePrompt;
  masterPrompt: string;
  metaPrompt: string;
  refinements: { question: string; answer: string }[];
  tokenEstimate: number;
  sectionCount: number;
  version: number;
  createdAt: string;
}

export async function createBlueprint(input: GenerateInput) {
  const compiled: CompiledBlueprint = compileBlueprint(input);

  const [row] = await db
    .insert(blueprints)
    .values({
      requirement: input.requirement,
      title: compiled.analysis.title,
      subtitle: compiled.analysis.subtitle,
      domainKey: compiled.analysis.domainKey,
      domainLabel: compiled.analysis.domainLabel,
      language: input.language,
      depth: input.depth,
      audience: input.audience,
      targetModel: input.targetModel,
      analysis: compiled.analysis,
      techStack: compiled.techStack,
      reversePrompt: compiled.reversePrompt,
      masterPrompt: compiled.masterPrompt,
      metaPrompt: compiled.metaPrompt,
      refinements: input.refinements ?? [],
      tokenEstimate: compiled.tokenEstimate,
      sectionCount: compiled.sections.length,
      status: "ready",
    })
    .returning({ id: blueprints.id });

  await db.insert(blueprintSections).values(
    compiled.sections.map((s) => ({
      blueprintId: row.id,
      pillarKey: s.pillarKey,
      pillarLabel: s.pillarLabel,
      pillarOrder: s.pillarOrder,
      sectionKey: s.sectionKey,
      sectionOrder: s.sectionOrder,
      titleTh: s.titleTh,
      titleEn: s.titleEn,
      summary: s.summary,
      body: s.body,
      promptSnippet: s.promptSnippet,
      checklist: s.checklist,
      antiPatterns: s.antiPatterns,
      tokenEstimate: s.tokenEstimate,
    })),
  );

  await db.insert(runEvents).values(
    compiled.trace.map((t) => ({
      blueprintId: row.id,
      stage: t.stage,
      status: t.status,
      message: t.message,
      latencyMs: t.latencyMs,
      meta: t.meta,
    })),
  );

  return row.id;
}

export async function refineBlueprint(id: string, answers: { question: string; answer: string }[]) {
  const existing = await db.select().from(blueprints).where(eq(blueprints.id, id)).limit(1);
  if (existing.length === 0) return null;
  const current = existing[0];

  const mergeMap = new Map<string, string>();
  for (const r of ((current.refinements as { question: string; answer: string }[]) ?? [])) {
    mergeMap.set(r.question, r.answer);
  }
  for (const r of answers) mergeMap.set(r.question, r.answer);
  const merged = [...mergeMap.entries()].map(([question, answer]) => ({ question, answer }));

  const input: GenerateInput = {
    requirement: current.requirement,
    language: current.language as GenerateInput["language"],
    depth: current.depth as GenerateInput["depth"],
    audience: current.audience as GenerateInput["audience"],
    targetModel: current.targetModel as GenerateInput["targetModel"],
    refinements: merged,
  };

  const compiled = compileBlueprint(input);

  await db
    .update(blueprints)
    .set({
      analysis: compiled.analysis,
      techStack: compiled.techStack,
      reversePrompt: compiled.reversePrompt,
      masterPrompt: compiled.masterPrompt,
      metaPrompt: compiled.metaPrompt,
      refinements: merged,
      tokenEstimate: compiled.tokenEstimate,
      sectionCount: compiled.sections.length,
      version: current.version + 1,
      updatedAt: new Date(),
    })
    .where(eq(blueprints.id, id));

  await db.delete(blueprintSections).where(eq(blueprintSections.blueprintId, id));
  await db.insert(blueprintSections).values(
    compiled.sections.map((s) => ({
      blueprintId: id,
      pillarKey: s.pillarKey,
      pillarLabel: s.pillarLabel,
      pillarOrder: s.pillarOrder,
      sectionKey: s.sectionKey,
      sectionOrder: s.sectionOrder,
      titleTh: s.titleTh,
      titleEn: s.titleEn,
      summary: s.summary,
      body: s.body,
      promptSnippet: s.promptSnippet,
      checklist: s.checklist,
      antiPatterns: s.antiPatterns,
      tokenEstimate: s.tokenEstimate,
    })),
  );

  await db.insert(runEvents).values({
    blueprintId: id,
    stage: "refine",
    status: "ok",
    message: `ปรับปรุงพิมพ์เขียวจากคำตอบของมนุษย์ ${answers.length} ข้อ (HITL)`,
    latencyMs: 0,
    meta: { version: current.version + 1 },
  });

  return id;
}

export async function getBlueprint(id: string) {
  const rows = await db.select().from(blueprints).where(eq(blueprints.id, id)).limit(1);
  if (rows.length === 0) return null;
  const sections = await db
    .select()
    .from(blueprintSections)
    .where(eq(blueprintSections.blueprintId, id))
    .orderBy(blueprintSections.pillarOrder, blueprintSections.sectionOrder);
  const events = await db.select().from(runEvents).where(eq(runEvents.blueprintId, id)).orderBy(runEvents.createdAt);
  return { blueprint: rows[0], sections, events };
}

export async function listBlueprints(limit = 40) {
  try {
    return await db
      .select({
        id: blueprints.id,
        title: blueprints.title,
        requirement: blueprints.requirement,
        domainKey: blueprints.domainKey,
        domainLabel: blueprints.domainLabel,
        subtitle: blueprints.subtitle,
        tokenEstimate: blueprints.tokenEstimate,
        sectionCount: blueprints.sectionCount,
        version: blueprints.version,
        createdAt: blueprints.createdAt,
      })
      .from(blueprints)
      .orderBy(desc(blueprints.createdAt))
      .limit(limit);
  } catch (e) {
    console.warn('listBlueprints fallback: DB unavailable', e);
    return [];
  }
}

export async function deleteBlueprint(id: string) {
  await db.delete(blueprints).where(eq(blueprints.id, id));
}

export async function statsOverview() {
  try {
    const [row] = await db
      .select({
        total: sql<number>`count(*)::int`,
        tokens: sql<number>`coalesce(sum(${blueprints.tokenEstimate}),0)::int`,
        sections: sql<number>`coalesce(sum(${blueprints.sectionCount}),0)::int`,
      })
      .from(blueprints);
    return row ?? { total: 0, tokens: 0, sections: 0 };
  } catch (e) {
    console.warn('statsOverview fallback: DB unavailable', e);
    return { total: 0, tokens: 0, sections: 0 };
  }
}
