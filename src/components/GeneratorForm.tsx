"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EXAMPLES = [
  "อยากทำระบบ POS ร้านอาหารเล็กๆ",
  "อยากได้เว็บขายของออนไลน์ พร้อมตัดสต๊อกและเก็บเงินปลายทาง",
  "ทำระบบจองคิวร้านตัดผม แจ้งเตือนผ่าน LINE",
  "ระบบคลินิกทันตกรรม จัดคิว เวชระเบียน และใบสั่งยา",
  "แชทบอทตอบลูกค้าบน LINE จากคู่มือสินค้าของบริษัท",
  "ระบบลงเวลาและคำนวณเงินเดือนพนักงาน 30 คน",
  "ระบบจัดเส้นทางส่งของและติดตามพัสดุแบบเรียลไทม์",
  "ระบบบันทึกรายรับรายจ่ายและออกใบกำกับภาษีสำหรับ SME",
];

const STAGES = [
  "DECODE — ถอดรหัสความต้องการ & ตรวจจับโดเมน",
  "ENRICH — เติมความรู้เฉพาะทาง (เอนทิตี/KPI/กฎหมาย)",
  "ARCHITECT — ประกอบ 5 เสา × 6 หัวข้อ = 30 ส่วน",
  "REVERSE — ทวนความเข้าใจกลับหามนุษย์",
  "ASSEMBLE — ประกอบ Master Prompt 360°",
  "META — ผลิต Meta-Prompt ระดับ Production",
];

export function GeneratorForm() {
  const router = useRouter();
  const [requirement, setRequirement] = useState("");
  const [language, setLanguage] = useState("th");
  const [depth, setDepth] = useState("production");
  const [audience, setAudience] = useState("dev_team");
  const [targetModel, setTargetModel] = useState("generic");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) return;
    setStage(0);
    const timer = setInterval(() => setStage((s) => (s < STAGES.length - 1 ? s + 1 : s)), 380);
    return () => clearInterval(timer);
  }, [loading]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (requirement.trim().length < 6) {
      setError("กรุณาระบุความต้องการอย่างน้อย 6 ตัวอักษร เช่น \"อยากทำระบบ POS ร้านอาหารเล็กๆ\"");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/blueprints", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ requirement: requirement.trim(), language, depth, audience, targetModel }),
      });
      const data = (await res.json()) as { ok: boolean; id?: string; error?: string };
      if (!res.ok || !data.ok || !data.id) {
        setError(data.error ?? "สร้างพิมพ์เขียวไม่สำเร็จ");
        setLoading(false);
        return;
      }
      router.push(`/blueprint/${data.id}`);
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ กรุณาลองใหม่");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="glass glow-violet rounded-3xl p-5 sm:p-7">
      <label className="mb-2 flex items-center justify-between text-xs font-medium text-slate-400">
        <span>ความต้องการของคุณ (เขียนสั้นๆ เป็นภาษาคนก็พอ)</span>
        <span className={requirement.length > 2000 ? "text-rose-400" : ""}>{requirement.length}/2000</span>
      </label>
      <textarea
        value={requirement}
        onChange={(e) => setRequirement(e.target.value)}
        rows={4}
        maxLength={2000}
        disabled={loading}
        placeholder='ตัวอย่าง: "อยากทำระบบ POS ร้านอาหารเล็กๆ" — ระบบจะขยายให้เป็นพรอมต์ 360 องศาครบ 30 หัวข้อ'
        className="w-full resize-y rounded-2xl border border-white/12 bg-black/35 p-4 text-[15px] text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-4 focus:ring-violet-500/15 disabled:opacity-60"
      />



      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="ภาษาผลลัพธ์">
          <Select value={language} onChange={setLanguage} disabled={loading} options={[
            { v: "th", l: "ไทย (แนะนำ)" },
            { v: "bilingual", l: "ไทย + ศัพท์อังกฤษ" },
            { v: "en", l: "English" },
          ]} />
        </Field>
        <Field label="ระดับความละเอียด">
          <Select value={depth} onChange={setDepth} disabled={loading} options={[
            { v: "lite", l: "Lite — เร็ว กระชับ" },
            { v: "production", l: "Production (แนะนำ)" },
            { v: "enterprise", l: "Enterprise — เข้มงวดสูงสุด" },
          ]} />
        </Field>
        <Field label="ผู้อ่านหลัก">
          <Select value={audience} onChange={setAudience} disabled={loading} options={[
            { v: "dev_team", l: "ทีมพัฒนา" },
            { v: "founder", l: "เจ้าของธุรกิจ" },
            { v: "agency", l: "เอเจนซี/ที่ปรึกษา" },
            { v: "student", l: "ผู้เรียน/นักศึกษา" },
          ]} />
        </Field>
        <Field label="โมเดลเป้าหมาย">
          <Select value={targetModel} onChange={setTargetModel} disabled={loading} options={[
            { v: "generic", l: "ทั่วไป (ย้ายข้ามค่ายได้)" },
            { v: "claude", l: "Claude (XML tags)" },
            { v: "gpt", l: "GPT (structured output)" },
            { v: "gemini", l: "Gemini (system instruction)" },
          ]} />
        </Field>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-sky-500 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:brightness-110 active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "กำลังคอมไพล์พิมพ์เขียว…" : "⚡ สร้าง Prompt 360° (5 เสา · 30 หัวข้อ)"}
      </button>

      {loading ? (
        <div className="mt-5 space-y-2">
          {STAGES.map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-[12.5px] transition ${
                i < stage
                  ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                  : i === stage
                    ? "border-violet-400/40 bg-violet-500/15 text-violet-100"
                    : "border-white/8 bg-white/[0.02] text-slate-500"
              }`}
            >
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-[10px]">
                {i < stage ? "✓" : i + 1}
              </span>
              <span className="flex-1">{s}</span>
              {i === stage ? <span className="h-1.5 w-16 rounded-full shimmer" /> : null}
            </div>
          ))}
        </div>
      ) : null}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-white/12 bg-black/35 px-3 py-2.5 text-[13px] text-slate-200 outline-none transition focus:border-violet-400/60 focus:ring-4 focus:ring-violet-500/10 disabled:opacity-60"
    >
      {options.map((o) => (
        <option key={o.v} value={o.v} className="bg-[#0b1020]">
          {o.l}
        </option>
      ))}
    </select>
  );
}
