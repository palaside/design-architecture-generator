export type Language = "th" | "bilingual" | "en";
export type Depth = "lite" | "production" | "enterprise";
export type Audience = "dev_team" | "founder" | "agency" | "student";
export type TargetModel = "generic" | "claude" | "gpt" | "gemini";

export interface Actor {
  name: string;
  goal: string;
  pain: string;
}

export interface EntityDef {
  name: string;
  fields: string[];
}

export interface Kpi {
  name: string;
  target: string;
}

export interface RiskItem {
  risk: string;
  mitigation: string;
}

export interface ToolDef {
  name: string;
  purpose: string;
  input: string;
  output: string;
  danger: "low" | "medium" | "high";
}

export interface DataSource {
  name: string;
  type: string;
  refresh: string;
  priority: number;
}

export interface Analysis {
  requirement: string;
  normalized: string;
  title: string;
  subtitle: string;
  domainKey: string;
  domainLabel: string;
  domainEmoji: string;
  confidence: number;
  scale: string;
  platforms: string[];
  actors: Actor[];
  entities: EntityDef[];
  jobs: string[];
  kpis: Kpi[];
  compliance: string[];
  integrations: string[];
  risks: RiskItem[];
  nonFunctional: string[];
  glossary: { term: string; meaning: string }[];
  dataSources: DataSource[];
  tools: ToolDef[];
  keywords: string[];
  assumptions: string[];
  unknowns: string[];
  outOfScope: string[];
  budgetHint: string;
  timelineHint: string;
}

export interface TechStackGroup {
  layer: string;
  picks: { name: string; why: string }[];
}

export interface TechStack {
  headline: string;
  groups: TechStackGroup[];
  phases: { phase: string; weeks: string; deliverables: string[] }[];
  guardrails: string[];
}

export interface ReversePrompt {
  restatement: string;
  interpretation: string[];
  assumptions: string[];
  clarifyingQuestions: { id: string; question: string; why: string; default: string }[];
  acceptanceCriteria: string[];
  outOfScope: string[];
  confirmationGate: string;
}

export interface CompiledSection {
  pillarKey: string;
  pillarLabel: string;
  pillarOrder: number;
  sectionKey: string;
  sectionOrder: number;
  titleTh: string;
  titleEn: string;
  summary: string;
  body: string;
  promptSnippet: string;
  checklist: string[];
  antiPatterns: string[];
  tokenEstimate: number;
}

export interface CompiledBlueprint {
  analysis: Analysis;
  techStack: TechStack;
  reversePrompt: ReversePrompt;
  sections: CompiledSection[];
  masterPrompt: string;
  metaPrompt: string;
  tokenEstimate: number;
  trace: { stage: string; status: string; message: string; latencyMs: number; meta: Record<string, unknown> }[];
}

export interface GenerateInput {
  requirement: string;
  language: Language;
  depth: Depth;
  audience: Audience;
  targetModel: TargetModel;
  refinements?: { question: string; answer: string }[];
}

export const PILLARS = [
  { key: "brand", label: "Brand Identity & Mood", labelTh: "อัตลักษณ์และอารมณ์แบรนด์", emoji: "🎨", accent: "violet" },
  { key: "visual", label: "Visual Language", labelTh: "คู่มือภาษาภาพ", emoji: "✨", accent: "sky" },
  { key: "layout", label: "Layout & Navigation", labelTh: "เลย์เอาต์และการนำทางหลัก", emoji: "📐", accent: "emerald" },
  { key: "components", label: "UI Component Specs", labelTh: "ข้อกำหนดชิ้นส่วน UI", emoji: "🧱", accent: "amber" },
  { key: "ux", label: "UX & Micro-interactions", labelTh: "พฤติกรรมผู้ใช้และอนิเมชัน", emoji: "⚡", accent: "rose" },
] as const;

export type PillarKey = (typeof PILLARS)[number]["key"];
