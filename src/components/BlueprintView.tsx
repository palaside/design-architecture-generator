"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Markdown } from "@/components/Markdown";
import { WireframeCanvas } from "@/components/WireframeCanvas";
import type { Analysis, CompiledSection, ReversePrompt, TechStack } from "@/lib/types";
import { PILLARS } from "@/lib/types";

interface RunEventView {
  id: string;
  stage: string;
  status: string;
  message: string;
  latencyMs: number;
  createdAt: string;
  meta: Record<string, unknown>;
}

interface Props {
  id: string;
  title: string;
  requirement: string;
  version: number;
  tokenEstimate: number;
  createdAt: string;
  analysis: Analysis;
  techStack: TechStack;
  reversePrompt: ReversePrompt;
  masterPrompt: string;
  metaPrompt: string;
  refinements: { question: string; answer: string }[];
  sections: CompiledSection[];
  events: RunEventView[];
}

const TABS = [
  { key: "overview", label: "ภาพรวม & Design Tokens", emoji: "🧭" },
  { key: "reverse", label: "Reverse Prompt", emoji: "🔄" },
  { key: "brand", label: "1 · Brand Mood", emoji: "🎨" },
  { key: "visual", label: "2 · Visual Scale", emoji: "✨" },
  { key: "layout", label: "3 · Navigation", emoji: "📐" },
  { key: "components", label: "4 · UI Specs", emoji: "🧱" },
  { key: "ux", label: "5 · UX Patterns", emoji: "⚡" },
  { key: "wireframe", label: "Wireframe Sandbox", emoji: "✏️" },
  { key: "master", label: "Master Spec", emoji: "📜" },
  { key: "meta", label: "Meta-Prompt", emoji: "🧬" },
  { key: "trace", label: "Trace", emoji: "📈" },
];

export function BlueprintView(props: Props) {
  const [tab, setTab] = useState("overview");
  const { analysis: a } = props;

  const pillarSections = useMemo(() => {
    const map: Record<string, CompiledSection[]> = {};
    for (const s of props.sections) {
      map[s.pillarKey] = map[s.pillarKey] ?? [];
      map[s.pillarKey].push(s);
    }
    return map;
  }, [props.sections]);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-8">
      {/* Header */}
      <div className="glass fade-up rounded-3xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="rounded-full border border-violet-400/30 bg-violet-500/15 px-2.5 py-0.5 font-medium text-violet-200">
                {a.domainEmoji} {a.domainLabel}
              </span>
              <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-0.5 text-slate-300">
                ความมั่นใจในการตีความ {(a.confidence * 100).toFixed(0)}%
              </span>
              <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-0.5 text-slate-300">v{props.version}</span>
              <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-0.5 text-slate-300">
                ~{props.tokenEstimate.toLocaleString("th-TH")} tokens
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {a.domainEmoji} {props.title}
            </h1>
            <p className="mt-1.5 text-[13.5px] text-slate-400">
              ความต้องการต้นทาง: <span className="text-slate-200">&ldquo;{props.requirement}&rdquo;</span>
            </p>
            <p className="mt-1 text-[12.5px] text-slate-500">
              {a.scale} · {a.platforms.join(" + ")} · {a.timelineHint} · งบ {a.budgetHint}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`/api/blueprints/${props.id}/export?format=md`}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-[12px] font-medium text-slate-200 transition hover:border-violet-400/50 hover:bg-violet-500/15"
            >
              ⬇ Markdown
            </a>
            <a
              href={`/api/blueprints/${props.id}/export?format=json`}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-[12px] font-medium text-slate-200 transition hover:border-sky-400/50 hover:bg-sky-500/15"
            >
              ⬇ JSON
            </a>
            <Link
              href="/"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 px-3 py-2 text-[12px] font-semibold text-white transition hover:brightness-110"
            >
              + สร้างใหม่
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[57px] z-40 -mx-5 mt-5 border-y border-white/8 bg-[#070912]/85 px-5 py-2 backdrop-blur-xl">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-[12.5px] font-medium transition ${
                tab === t.key
                  ? "bg-gradient-to-r from-violet-600/90 to-fuchsia-600/80 text-white shadow shadow-violet-900/40"
                  : "border border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-100"
              }`}
            >
              <span className="mr-1">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {tab === "overview" ? <Overview analysis={a} techStack={props.techStack} /> : null}
        {tab === "reverse" ? (
          <ReverseSection id={props.id} data={props.reversePrompt} refinements={props.refinements} />
        ) : null}
        {PILLARS.map((p) =>
          tab === p.key ? <PillarPanel key={p.key} pillar={p.label} pillarTh={p.labelTh} sections={pillarSections[p.key] ?? []} /> : null,
        )}
        {tab === "wireframe" ? (
          <WireframeCanvas sections={props.sections} />
        ) : null}
        {tab === "master" ? (
          <PromptPanel
            id={props.id}
            title="MASTER SPECS 360°"
            description="ข้อกำหนดงานออกแบบประกอบร่างจากทั้ง 30 หัวข้อ เรียงลำดับพร้อมใช้สำหรับส่งต่อให้ดีไซเนอร์และโปรแกรมเมอร์"
            content={props.masterPrompt}
            downloadFormat="master"
          />
        ) : null}
        {tab === "meta" ? (
          <PromptPanel
            id={props.id}
            title="META-PROMPT (สำหรับให้ AI ผลิตดีไซน์)"
            description="ใช้สั่ง AI ให้ช่วยร่าง UI/UX Design System และคุมงานภาพของระบบสเกลอื่นๆ ตามความเหมาะสม"
            content={props.metaPrompt}
            downloadFormat="meta"
          />
        ) : null}
        {tab === "trace" ? <TracePanel events={props.events} sections={props.sections} /> : null}
      </div>
    </div>
  );
}

/* ----------------------------- OVERVIEW ----------------------------- */
function Overview({ analysis: a, techStack }: { analysis: Analysis; techStack: TechStack }) {
  return (
    <div className="fade-up space-y-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="ผู้ใช้จริงและความเจ็บปวด" icon="👥" className="lg:col-span-2">
          <div className="space-y-2.5">
            {a.actors.map((actor) => (
              <div key={actor.name} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                <p className="text-[13.5px] font-semibold text-white">{actor.name}</p>
                <p className="mt-1 text-[12.5px] text-emerald-300/90">🎯 {actor.goal}</p>
                <p className="mt-0.5 text-[12.5px] text-rose-300/80">💢 {actor.pain}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="ตัวชี้วัดความสำเร็จ" icon="📈">
          <div className="space-y-2">
            {a.kpis.map((k) => (
              <div key={k.name} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                <p className="text-[12.5px] font-medium text-white">{k.name}</p>
                <p className="text-[12px] text-sky-300">{k.target}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="เอนทิตีข้อมูลหลัก" icon="🗂">
          <div className="space-y-2">
            {a.entities.map((e) => (
              <div key={e.name} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                <p className="text-[13px] font-semibold text-violet-200">{e.name}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-400">{e.fields.join(" · ")}</p>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <Card title="งานหลักที่ระบบต้องรองรับ" icon="⚙️">
            <ol className="space-y-1.5 text-[12.5px] text-slate-300">
              {a.jobs.map((j, i) => (
                <li key={j} className="flex gap-2">
                  <span className="shrink-0 text-slate-600">{String(i + 1).padStart(2, "0")}</span>
                  <span>{j}</span>
                </li>
              ))}
            </ol>
          </Card>
          <Card title="ข้อกำหนดกฎหมาย / มาตรฐาน" icon="⚖️">
            <ul className="space-y-1.5 text-[12.5px] text-slate-300">
              {a.compliance.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-amber-400">§</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card title="ความเสี่ยงหลักและมาตรการป้องกัน" icon="⚠️">
        <div className="grid gap-2.5 md:grid-cols-3">
          {a.risks.map((r) => (
            <div key={r.risk} className="rounded-xl border border-amber-400/15 bg-amber-500/[0.06] p-3">
              <p className="text-[12.5px] font-semibold text-amber-200">{r.risk}</p>
              <p className="mt-1 text-[12px] text-slate-300">✅ {r.mitigation}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Tech Stack for Implementation" icon="🧱" subtitle={techStack.headline}>
        <div className="grid gap-3 md:grid-cols-2">
          {techStack.groups.map((g) => (
            <div key={g.layer} className="rounded-xl border border-white/8 bg-white/[0.02] p-3.5">
              <p className="text-[12px] font-bold uppercase tracking-wide text-sky-300">{g.layer}</p>
              <ul className="mt-2 space-y-2">
                {g.picks.map((p) => (
                  <li key={p.name}>
                    <p className="text-[12.5px] font-medium text-white">{p.name}</p>
                    <p className="text-[11.5px] leading-relaxed text-slate-400">{p.why}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-violet-400/20 bg-violet-500/[0.07] p-3.5">
          <p className="text-[12px] font-bold uppercase tracking-wide text-violet-200">กฎเหล็กในการเลือกเทคโนโลยี</p>
          <ul className="mt-1.5 space-y-1 text-[12.5px] text-slate-300">
            {techStack.guardrails.map((g) => (
              <li key={g}>• {g}</li>
            ))}
          </ul>
        </div>
      </Card>

      <Card title="แผนส่งมอบเป็นเฟส" icon="🗓">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {techStack.phases.map((p) => (
            <div key={p.phase} className="rounded-xl border border-white/8 bg-white/[0.02] p-3.5">
              <p className="text-[12.5px] font-bold text-white">{p.phase}</p>
              <p className="text-[11px] text-emerald-300">{p.weeks}</p>
              <ul className="mt-2 space-y-1 text-[11.5px] leading-relaxed text-slate-400">
                {p.deliverables.map((d) => (
                  <li key={d}>▸ {d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* -------------------------- REVERSE PROMPT -------------------------- */
function ReverseSection({
  id,
  data,
  refinements,
}: {
  id: string;
  data: ReversePrompt;
  refinements: { question: string; answer: string }[];
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    const payload = data.clarifyingQuestions
      .map((q) => ({ question: q.question, answer: (answers[q.id] ?? "").trim() }))
      .filter((x) => x.answer.length > 0);
    if (payload.length === 0) {
      setMessage("กรุณาตอบอย่างน้อย 1 ข้อ ก่อนกดยืนยัน");
      return;
    }
    setSaving(true);
    setMessage(null);
    const res = await fetch(`/api/blueprints/${id}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ answers: payload }),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("✓ อัปเดตพิมพ์เขียวใหม่ตามคำตอบของคุณแล้ว (Human-in-the-Loop)");
      setAnswers({});
      router.refresh();
    } else {
      setMessage("บันทึกไม่สำเร็จ กรุณาลองใหม่");
    }
  }

  return (
    <div className="fade-up space-y-5">
      <Card title="สรุปความเข้าใจกลับ (Restatement)" icon="🔄">
        <p className="text-[14px] leading-relaxed text-slate-200">{data.restatement}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-sky-400/20 bg-sky-500/[0.06] p-3.5">
            <p className="text-[12px] font-bold uppercase tracking-wide text-sky-300">การตีความเจตนา</p>
            <ul className="mt-1.5 space-y-1.5 text-[12.5px] text-slate-300">
              {data.interpretation.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-400/20 bg-amber-500/[0.06] p-3.5">
            <p className="text-[12px] font-bold uppercase tracking-wide text-amber-300">สมมติฐานที่ใช้ [ASSUMPTION]</p>
            <ul className="mt-1.5 space-y-1.5 text-[12.5px] text-slate-300">
              {data.assumptions.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card
        title={`คำถามที่ต้องยืนยัน (${data.clarifyingQuestions.length} ข้อ)`}
        icon="❓"
        subtitle="ตอบแล้วกดยืนยัน ระบบจะคอมไพล์พิมพ์เขียวใหม่ทั้ง 30 หัวข้อโดยรวมคำตอบของคุณเข้าไป"
      >
        {data.clarifyingQuestions.length === 0 ? (
          <p className="text-[13px] text-emerald-300">ทุกคำถามได้รับคำตอบแล้ว ✓</p>
        ) : (
          <div className="space-y-3">
            {data.clarifyingQuestions.map((q) => (
              <div key={q.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-3.5">
                <p className="text-[13px] font-semibold text-white">
                  <span className="mr-2 rounded bg-violet-500/25 px-1.5 py-0.5 text-[11px] text-violet-200">{q.id}</span>
                  {q.question}
                </p>
                <p className="mt-1 text-[11.5px] text-slate-500">ทำไมต้องรู้: {q.why}</p>
                <p className="text-[11.5px] text-slate-500">ถ้าไม่ตอบ: {q.default}</p>
                <input
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="พิมพ์คำตอบของคุณ…"
                  className="mt-2 w-full rounded-lg border border-white/12 bg-black/35 px-3 py-2 text-[13px] text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400/60"
                />
              </div>
            ))}
            <button
              onClick={submit}
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "กำลังคอมไพล์ใหม่…" : "✓ ยืนยันคำตอบ & คอมไพล์พิมพ์เขียวใหม่"}
            </button>
            {message ? <p className="text-[12.5px] text-emerald-300">{message}</p> : null}
          </div>
        )}

        {refinements.length > 0 ? (
          <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.06] p-3.5">
            <p className="text-[12px] font-bold uppercase tracking-wide text-emerald-300">คำตอบที่ยืนยันแล้ว (HITL)</p>
            <ul className="mt-1.5 space-y-1 text-[12.5px] text-slate-300">
              {refinements.map((r) => (
                <li key={r.question}>
                  <span className="text-slate-500">{r.question}</span> → <span className="text-white">{r.answer}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="เกณฑ์ยอมรับผลงาน (Acceptance Criteria)" icon="✅">
          <ul className="space-y-1.5 text-[12.5px] text-slate-300">
            {data.acceptanceCriteria.map((x) => (
              <li key={x} className="flex gap-2">
                <span className="text-emerald-400">☐</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="นอกขอบเขต (Out of Scope)" icon="🚫">
          <ul className="space-y-1.5 text-[12.5px] text-slate-300">
            {data.outOfScope.map((x) => (
              <li key={x} className="flex gap-2">
                <span className="text-rose-400">✕</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="glass rounded-2xl border-violet-400/25 bg-violet-500/[0.08] p-5">
        <p className="text-[12px] font-bold uppercase tracking-wide text-violet-200">ประตูยืนยัน (Confirmation Gate)</p>
        <p className="mt-1.5 whitespace-pre-line text-[13.5px] leading-relaxed text-slate-200">{data.confirmationGate}</p>
      </div>
    </div>
  );
}

/* ----------------------------- PILLARS ------------------------------ */
function PillarPanel({ pillar, pillarTh, sections }: { pillar: string; pillarTh: string; sections: CompiledSection[] }) {
  const [orderedSections, setOrderedSections] = useState<CompiledSection[]>(sections);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Sync state if props change
  useMemo(() => {
    setOrderedSections(sections);
  }, [sections]);

  const [open, setOpen] = useState<string | null>(sections[0]?.sectionKey ?? null);
  const allSnippets = orderedSections.map((s) => s.promptSnippet).join("\n\n");

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    
    const items = [...orderedSections];
    const [draggedItem] = items.splice(draggedIdx, 1);
    items.splice(index, 0, draggedItem);
    
    const updated = items.map((item, idx) => ({
      ...item,
      sectionOrder: idx + 1,
    }));
    
    setOrderedSections(updated);
    setDraggedIdx(null);
  };

  return (
    <div className="fade-up space-y-3">
      <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
        <div>
          <h2 className="text-lg font-bold text-white">{pillar}</h2>
          <p className="text-[12.5px] text-slate-400">
            {pillarTh} · {orderedSections.length} หัวข้อ · ~{orderedSections.reduce((s, x) => s + x.tokenEstimate, 0).toLocaleString("th-TH")} tokens
          </p>
        </div>
        <CopyButton text={allSnippets} label="คัดลอก Prompt Snippet ทั้งเสา" />
      </div>

      {orderedSections.map((s, idx) => {
        const isOpen = open === s.sectionKey;
        const isDraggingThis = draggedIdx === idx;
        return (
          <div
            key={s.sectionKey}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            className={`glass overflow-hidden rounded-2xl transition-all duration-200 ${
              isDraggingThis ? "opacity-40 border border-violet-500/50 scale-[0.99]" : ""
            }`}
          >
            <div className="flex w-full items-center pl-4 pr-1">
              {/* Drag Handle */}
              <div className="cursor-grab text-slate-500 hover:text-slate-300 pr-1 select-none text-[15px]">
                ⋮⋮
              </div>
              <button
                onClick={() => setOpen(isOpen ? null : s.sectionKey)}
                className="flex flex-1 items-start gap-3 py-4 text-left transition hover:bg-white/[0.03]"
              >
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-500/30 to-sky-500/20 text-[11.5px] font-bold text-violet-100">
                  {s.pillarOrder}.{s.sectionOrder}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold text-white">{s.titleTh}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-relaxed text-slate-400">{s.summary}</span>
                </span>
                <span className={`mt-1 pr-3 shrink-0 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`}>▾</span>
              </button>
            </div>

            {isOpen ? (
              <div className="border-t border-white/8 px-4 pb-5 pt-4">
                <Markdown source={s.body} />

                <div className="mt-4 rounded-xl border border-violet-400/25 bg-violet-500/[0.07] p-3.5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-[11.5px] font-bold uppercase tracking-wide text-violet-200">
                      Prompt Snippet — คัดลอกไปใช้ได้ทันที
                    </p>
                    <CopyButton text={s.promptSnippet} />
                  </div>
                  <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-black/45 p-3 text-[11.5px] leading-relaxed text-sky-100">
                    {s.promptSnippet}
                  </pre>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/[0.06] p-3.5">
                    <p className="text-[11.5px] font-bold uppercase tracking-wide text-emerald-300">Checklist</p>
                    <ul className="mt-1.5 space-y-1 text-[12.5px] text-slate-300">
                      {s.checklist.map((c) => (
                        <li key={c}>☐ {c}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-rose-400/20 bg-rose-500/[0.06] p-3.5">
                    <p className="text-[11.5px] font-bold uppercase tracking-wide text-rose-300">Anti-patterns</p>
                    <ul className="mt-1.5 space-y-1 text-[12.5px] text-slate-300">
                      {s.antiPatterns.map((c) => (
                        <li key={c}>✕ {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------- PROMPT PANEL --------------------------- */
function PromptPanel({
  id,
  title,
  description,
  content,
  downloadFormat,
}: {
  id: string;
  title: string;
  description: string;
  content: string;
  downloadFormat: string;
}) {
  return (
    <div className="fade-up glass rounded-3xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="mt-1 max-w-3xl text-[12.5px] leading-relaxed text-slate-400">{description}</p>
          <p className="mt-1 text-[11.5px] text-slate-500">
            ความยาว {content.length.toLocaleString("th-TH")} ตัวอักษร · ประมาณ {Math.round(content.length / 3.4).toLocaleString("th-TH")} tokens
          </p>
        </div>
        <div className="flex gap-2">
          <CopyButton text={content} label="คัดลอกทั้งหมด" />
          <a
            href={`/api/blueprints/${id}/export?format=${downloadFormat}`}
            className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:border-sky-400/50 hover:bg-sky-500/15"
          >
            ⬇ ดาวน์โหลด .txt
          </a>
        </div>
      </div>
      <pre className="mt-4 max-h-[70vh] overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-black/50 p-4 text-[11.5px] leading-relaxed text-slate-200">
        {content}
      </pre>
    </div>
  );
}

/* ------------------------------ TRACE ------------------------------- */
function TracePanel({ events, sections }: { events: RunEventView[]; sections: CompiledSection[] }) {
  const totalMs = events.reduce((s, e) => s + e.latencyMs, 0);
  return (
    <div className="fade-up space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <MiniStat label="ขั้นตอนในไปป์ไลน์" value={String(events.length)} />
        <MiniStat label="เวลารวมการคอมไพล์" value={`${totalMs} ms`} />
        <MiniStat label="หัวข้อที่ผลิต" value={`${sections.length} / 30`} />
        <MiniStat
          label="สถานะทั้งหมด"
          value={events.every((e) => e.status === "ok") ? "ผ่านทุกขั้น ✓" : "มีข้อผิดพลาด"}
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="text-[14px] font-bold text-white">Observability Trace — บันทึกการทำงานของไปป์ไลน์</h3>
        <p className="text-[12.5px] text-slate-400">
          ตัวอย่างจริงของหลักการใน Harness Engineering 3.6 — ทุกขั้นตอนถูกบันทึกพร้อมเวลาและ metadata
        </p>
        <ol className="mt-4 space-y-2">
          {events.map((e, i) => (
            <li key={e.id} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <span
                className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                  e.status === "ok" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-white">
                  {e.stage.toUpperCase()} <span className="ml-2 text-[11px] font-normal text-slate-500">{e.latencyMs} ms</span>
                </p>
                <p className="text-[12.5px] text-slate-400">{e.message}</p>
                {Object.keys(e.meta ?? {}).length > 0 ? (
                  <p className="mt-1 font-mono text-[11px] text-sky-300/80">{JSON.stringify(e.meta)}</p>
                ) : null}
              </div>
              <span className="shrink-0 text-[11px] text-slate-600">
                {new Date(e.createdAt).toLocaleTimeString("th-TH", { hour12: false })}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="text-[14px] font-bold text-white">การกระจายโทเคนตามเสา</h3>
        <div className="mt-3 space-y-2">
          {PILLARS.map((p) => {
            const list = sections.filter((s) => s.pillarKey === p.key);
            const tokens = list.reduce((s, x) => s + x.tokenEstimate, 0);
            const max = Math.max(
              1,
              ...PILLARS.map((pp) => sections.filter((s) => s.pillarKey === pp.key).reduce((s, x) => s + x.tokenEstimate, 0)),
            );
            return (
              <div key={p.key} className="flex items-center gap-3">
                <span className="w-44 shrink-0 text-[12px] text-slate-300">
                  {p.emoji} {p.label}
                </span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/6">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400"
                    style={{ width: `${Math.round((tokens / max) * 100)}%` }}
                  />
                </span>
                <span className="w-20 shrink-0 text-right text-[11.5px] text-slate-400">{tokens.toLocaleString("th-TH")}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ SHARED ------------------------------ */
function Card({
  title,
  icon,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  icon: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`glass rounded-2xl p-5 ${className}`}>
      <h3 className="text-[14px] font-bold text-white">
        <span className="mr-2">{icon}</span>
        {title}
      </h3>
      {subtitle ? <p className="mb-3 mt-1 text-[12.5px] leading-relaxed text-slate-400">{subtitle}</p> : <div className="h-3" />}
      {children}
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}
