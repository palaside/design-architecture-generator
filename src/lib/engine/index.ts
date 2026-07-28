import { analyzeRequirement } from "./analyze";
import { buildMasterPrompt, buildMetaPrompt, buildReversePrompt, buildTechStack } from "./deliverables";
import { compileSections } from "./sections";
import type { CompiledBlueprint, GenerateInput } from "@/lib/types";
import { PILLARS } from "@/lib/types";

export function compileBlueprint(input: GenerateInput): CompiledBlueprint {
  const trace: CompiledBlueprint["trace"] = [];
  const step = <T>(stage: string, message: string, fn: () => T, meta: Record<string, unknown> = {}): T => {
    const started = Date.now();
    try {
      const value = fn();
      trace.push({ stage, status: "ok", message, latencyMs: Date.now() - started, meta });
      return value;
    } catch (error) {
      trace.push({
        stage,
        status: "error",
        message: error instanceof Error ? error.message : "unknown error",
        latencyMs: Date.now() - started,
        meta,
      });
      throw error;
    }
  };

  const analysis = step("decode", "ถอดรหัสความต้องการและตรวจจับโดเมน", () => analyzeRequirement(input));
  trace[trace.length - 1].meta = { domain: analysis.domainKey, confidence: analysis.confidence };

  const techStack = step("enrich", "เติมความรู้เฉพาะโดเมนและเลือกสแตกเทคโนโลยี", () => buildTechStack(analysis));
  const sections = step("architect", "ประกอบพิมพ์เขียว 5 เสา × 6 หัวข้อ", () => compileSections(analysis, input), {
    pillars: PILLARS.length,
  });
  const reversePrompt = step("reverse", "สร้าง Reverse Prompt เพื่อยืนยันความเข้าใจ", () => buildReversePrompt(analysis));
  const masterPrompt = step("assemble", "ประกอบ Master Prompt 360°", () => buildMasterPrompt(analysis, sections, input));
  const metaPrompt = step("meta", "สร้าง Meta-Prompt ระดับ Production", () => buildMetaPrompt(analysis, input));

  const tokenEstimate =
    sections.reduce((sum, s) => sum + s.tokenEstimate, 0) + Math.round((masterPrompt.length + metaPrompt.length) / 3.4);

  step("validate", "ตรวจความครบถ้วนของผลลัพธ์", () => {
    if (sections.length !== 30) throw new Error(`คาดหวัง 30 หัวข้อ แต่ได้ ${sections.length}`);
    const empty = sections.filter((s) => !s.promptSnippet.trim() || !s.body.trim());
    if (empty.length > 0) throw new Error(`พบหัวข้อที่เนื้อหาว่าง: ${empty.map((s) => s.sectionKey).join(", ")}`);
    if (masterPrompt.includes("undefined")) throw new Error("พบค่า undefined ใน master prompt");
    return true;
  }, { sectionCount: sections.length, tokenEstimate });

  return { analysis, techStack, reversePrompt, sections, masterPrompt, metaPrompt, tokenEstimate, trace };
}

export function toMarkdown(b: CompiledBlueprint): string {
  const { analysis: a, techStack, reversePrompt, sections } = b;
  const parts: string[] = [];

  parts.push(`# ${a.domainEmoji} ${a.title}`);
  parts.push(`> ความต้องการต้นทาง: "${a.requirement}"`);
  parts.push(`> โดเมน: ${a.domainLabel} · ขนาด: ${a.scale} · ความมั่นใจในการตีความ: ${(a.confidence * 100).toFixed(0)}%`);
  parts.push("");
  parts.push("## 0. Reverse Prompt — ทวนความเข้าใจก่อนเริ่ม");
  parts.push(`**สรุปความต้องการ**: ${reversePrompt.restatement}`);
  parts.push("");
  parts.push("**การตีความเจตนา**");
  parts.push(reversePrompt.interpretation.map((x) => `- ${x}`).join("\n"));
  parts.push("");
  parts.push("**สมมติฐานที่ใช้**");
  parts.push(reversePrompt.assumptions.map((x) => `- ${x}`).join("\n"));
  parts.push("");
  parts.push("**คำถามที่ต้องการคำตอบ**");
  parts.push(reversePrompt.clarifyingQuestions.map((q) => `- [${q.id}] ${q.question}\n  - ทำไมต้องรู้: ${q.why}\n  - ถ้าไม่ตอบ: ${q.default}`).join("\n"));
  parts.push("");
  parts.push("**เกณฑ์ยอมรับผลงาน (Acceptance Criteria)**");
  parts.push(reversePrompt.acceptanceCriteria.map((x) => `- ${x}`).join("\n"));
  parts.push("");
  parts.push("**นอกขอบเขต**");
  parts.push(reversePrompt.outOfScope.map((x) => `- ${x}`).join("\n"));
  parts.push("");
  parts.push(`**ประตูยืนยัน**: ${reversePrompt.confirmationGate}`);
  parts.push("");

  parts.push("## Tech Stack for Implementation");
  parts.push(techStack.headline);
  for (const g of techStack.groups) {
    parts.push(`### ${g.layer}`);
    parts.push(g.picks.map((p) => `- **${p.name}** — ${p.why}`).join("\n"));
  }
  parts.push("### แผนการส่งมอบ");
  for (const p of techStack.phases) {
    parts.push(`**${p.phase}** (${p.weeks})`);
    parts.push(p.deliverables.map((d) => `- ${d}`).join("\n"));
  }
  parts.push("### กฎเหล็กในการเลือกเทคโนโลยี");
  parts.push(techStack.guardrails.map((x) => `- ${x}`).join("\n"));
  parts.push("");

  let currentPillar = "";
  for (const s of sections) {
    if (s.pillarLabel !== currentPillar) {
      currentPillar = s.pillarLabel;
      parts.push(`## ${s.pillarOrder}. ${currentPillar}`);
    }
    parts.push(`### ${s.pillarOrder}.${s.sectionOrder} ${s.titleTh}`);
    parts.push(`_${s.summary}_`);
    parts.push(s.body);
    parts.push("**Prompt Snippet**");
    parts.push("```text");
    parts.push(s.promptSnippet);
    parts.push("```");
    parts.push("**Checklist**");
    parts.push(s.checklist.map((c) => `- [ ] ${c}`).join("\n"));
    parts.push("**Anti-patterns**");
    parts.push(s.antiPatterns.map((c) => `- ❌ ${c}`).join("\n"));
    parts.push("");
  }

  parts.push("## MASTER PROMPT (360°)");
  parts.push("```text");
  parts.push(b.masterPrompt);
  parts.push("```");
  parts.push("");
  parts.push("## META-PROMPT (พรอมต์สำหรับสั่ง AI ให้สร้าง Prompt)");
  parts.push("```text");
  parts.push(b.metaPrompt);
  parts.push("```");

  return parts.join("\n");
}
