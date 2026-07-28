import { notFound } from "next/navigation";
import { BlueprintView } from "@/components/BlueprintView";
import { getBlueprint } from "@/lib/repo";
import type { Analysis, CompiledSection, ReversePrompt, TechStack } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BlueprintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getBlueprint(id);
  if (!data) notFound();

  const { blueprint, sections, events } = data;

  const compiledSections: CompiledSection[] = sections.map((s) => ({
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
    checklist: (s.checklist as string[]) ?? [],
    antiPatterns: (s.antiPatterns as string[]) ?? [],
    tokenEstimate: s.tokenEstimate,
  }));

  return (
    <BlueprintView
      id={blueprint.id}
      title={blueprint.title}
      requirement={blueprint.requirement}
      version={blueprint.version}
      tokenEstimate={blueprint.tokenEstimate}
      createdAt={blueprint.createdAt.toISOString()}
      analysis={blueprint.analysis as Analysis}
      techStack={blueprint.techStack as TechStack}
      reversePrompt={blueprint.reversePrompt as ReversePrompt}
      masterPrompt={blueprint.masterPrompt}
      metaPrompt={blueprint.metaPrompt}
      refinements={(blueprint.refinements as { question: string; answer: string }[]) ?? []}
      sections={compiledSections}
      events={events.map((e) => ({
        id: e.id,
        stage: e.stage,
        status: e.status,
        message: e.message,
        latencyMs: e.latencyMs,
        createdAt: e.createdAt.toISOString(),
        meta: e.meta as Record<string, unknown>,
      }))}
    />
  );
}
