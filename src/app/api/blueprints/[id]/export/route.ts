import { toMarkdown } from "@/lib/engine";
import { getBlueprint } from "@/lib/repo";
import type { Analysis, CompiledBlueprint, ReversePrompt, TechStack } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getBlueprint(id);
  if (!data) return Response.json({ ok: false, error: "ไม่พบพิมพ์เขียวนี้" }, { status: 404 });

  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "md";
  const { blueprint, sections } = data;

  const compiled: CompiledBlueprint = {
    analysis: blueprint.analysis as Analysis,
    techStack: blueprint.techStack as TechStack,
    reversePrompt: blueprint.reversePrompt as ReversePrompt,
    masterPrompt: blueprint.masterPrompt,
    metaPrompt: blueprint.metaPrompt,
    tokenEstimate: blueprint.tokenEstimate,
    trace: [],
    sections: sections.map((s) => ({
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
    })),
  };

  const safeName = blueprint.title.replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 60) || "blueprint";

  if (format === "json") {
    return new Response(JSON.stringify(compiled, null, 2), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="${encodeURIComponent(safeName)}.json"`,
      },
    });
  }

  if (format === "master") {
    return new Response(compiled.masterPrompt, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "content-disposition": `attachment; filename="${encodeURIComponent(safeName)}-master-prompt.txt"`,
      },
    });
  }

  if (format === "meta") {
    return new Response(compiled.metaPrompt, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "content-disposition": `attachment; filename="${encodeURIComponent(safeName)}-meta-prompt.txt"`,
      },
    });
  }

  return new Response(toMarkdown(compiled), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-disposition": `attachment; filename="${encodeURIComponent(safeName)}.md"`,
    },
  });
}
