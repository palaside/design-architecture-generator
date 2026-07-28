import Link from "next/link";
import { GeneratorForm } from "@/components/GeneratorForm";
import { listBlueprints, statsOverview } from "@/lib/repo";

export const dynamic = "force-dynamic";

const PILLAR_MAP = [
  {
    emoji: "🎯",
    key: "1",
    title: "Prompt Engineering",
    th: "วิศวกรรมพรอมต์",
    accent: "from-violet-500/25 to-violet-500/0",
    items: ["Persona & Role", "Context & Background", "Task & Instructions", "Constraints & Guardrails", "Output Format", "Examples & Few-Shot"],
  },
  {
    emoji: "🧠",
    key: "2",
    title: "Context Engineering",
    th: "วิศวกรรมบริบท",
    accent: "from-sky-500/25 to-sky-500/0",
    items: ["Retrieval & Sources", "Memory & History", "Token Budget", "Dynamic State", "Semantic Filtering", "Intent Profiling"],
  },
  {
    emoji: "🛡️",
    key: "3",
    title: "Harness Engineering",
    th: "วิศวกรรมโครงรัด",
    accent: "from-emerald-500/25 to-emerald-500/0",
    items: ["Tool Definition", "Guardrails & Safety", "Retry & Error Handling", "Runtime Control", "Human-in-the-Loop", "Observability"],
  },
  {
    emoji: "🔁",
    key: "4",
    title: "Loop Engineering",
    th: "วิศวกรรมลูปทำงาน",
    accent: "from-amber-500/25 to-amber-500/0",
    items: ["Plan & Decomposition", "Act & Execution", "Observe & Monitor", "Reflection", "Termination Criteria", "State Handoff"],
  },
  {
    emoji: "📊",
    key: "5",
    title: "Graph Engineering",
    th: "วิศวกรรมการนำเสนอผล",
    accent: "from-rose-500/25 to-rose-500/0",
    items: ["Schema & Structure", "Multi-Modal Layouts", "Progressive Disclosure", "Deterministic Template", "Localization", "Actionable Outputs"],
  },
];

export default async function HomePage() {
  const [recent, stats] = await Promise.all([listBlueprints(6), statsOverview()]);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-16 pt-10">
      <section className="fade-up text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3.5 py-1 text-[11.5px] font-medium text-violet-200">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300" />
          Reverse Prompt → 30 หัวข้อ → Master Prompt → Meta-Prompt
        </span>
        <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          เขียนความต้องการ 1 บรรทัด
          <br />
          ได้ <span className="text-gradient">พิมพ์เขียว Prompt 360°</span> ระดับ Production
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-400">
          พิมพ์ว่า &ldquo;อยากทำระบบ POS ร้านอาหารเล็กๆ&rdquo; ระบบจะถอดรหัสโดเมน เติมความรู้เฉพาะทาง แล้วประกอบเป็น
          <strong className="text-slate-200"> 5 เสาวิศวกรรม × 6 หัวข้อ = 30 ส่วน</strong> พร้อม Tech Stack, Reverse Prompt
          ทวนความเข้าใจ และ Meta-Prompt สำหรับสั่ง AI ให้สร้าง Prompt ต่อ
        </p>

        <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-[11.5px] text-slate-400">
          <Stat label="พิมพ์เขียวที่สร้างแล้ว" value={stats.total.toLocaleString("th-TH")} />
          <Stat label="หัวข้อที่คอมไพล์" value={stats.sections.toLocaleString("th-TH")} />
          <Stat label="โทเคนที่ประเมิน" value={stats.tokens.toLocaleString("th-TH")} />
        </div>
      </section>

      <section className="fade-up mx-auto mt-9 max-w-4xl">
        <GeneratorForm />
      </section>

      <section className="mt-16">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">แผนที่ 5 เสา × 6 หัวข้อ</h2>
            <p className="text-[13px] text-slate-400">ทุกพิมพ์เขียวจะถูกคอมไพล์ครบทั้ง 30 หัวข้อนี้เสมอ พร้อม Prompt Snippet ที่คัดลอกไปใช้ได้ทันที</p>
          </div>
          <Link href="/method" className="hidden shrink-0 text-[13px] text-violet-300 hover:text-violet-200 sm:block">
            อ่านวิธีการทำงาน →
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {PILLAR_MAP.map((p) => (
            <div key={p.key} className={`glass rounded-2xl bg-gradient-to-b p-4 transition hover:border-white/20 ${p.accent}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{p.emoji}</span>
                <div>
                  <p className="text-[13.5px] font-bold text-white">{p.title}</p>
                  <p className="text-[11px] text-slate-400">{p.th}</p>
                </div>
              </div>
              <ol className="mt-3 space-y-1.5 text-[12px] text-slate-300">
                {p.items.map((it, idx) => (
                  <li key={it} className="flex gap-2">
                    <span className="text-slate-600">{p.key}.{idx + 1}</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {recent.length > 0 ? (
        <section className="mt-16">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-bold text-white">พิมพ์เขียวล่าสุด</h2>
            <Link href="/library" className="text-[13px] text-violet-300 hover:text-violet-200">
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((b) => (
              <Link
                key={b.id}
                href={`/blueprint/${b.id}`}
                className="glass group rounded-2xl p-4 transition hover:border-violet-400/40 hover:bg-violet-500/5"
              >
                <p className="text-[11px] font-medium uppercase tracking-wide text-violet-300">{b.domainLabel}</p>
                <p className="mt-1 line-clamp-1 text-[15px] font-semibold text-white group-hover:text-violet-100">{b.title}</p>
                <p className="mt-1 line-clamp-2 text-[12.5px] text-slate-400">&ldquo;{b.requirement}&rdquo;</p>
                <p className="mt-3 flex gap-3 text-[11px] text-slate-500">
                  <span>{b.sectionCount} หัวข้อ</span>
                  <span>~{b.tokenEstimate.toLocaleString("th-TH")} tokens</span>
                  <span>v{b.version}</span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="glass rounded-full px-3.5 py-1.5">
      <strong className="text-slate-100">{value}</strong> <span className="text-slate-500">{label}</span>
    </span>
  );
}
