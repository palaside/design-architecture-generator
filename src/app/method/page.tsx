import Link from "next/link";

export const metadata = {
  title: "วิธีการทำงาน — Prompt Architect 360°",
};

const STEPS = [
  {
    n: "01",
    title: "DECODE — ถอดรหัสความต้องการ",
    body: "แยก “สิ่งที่ผู้ใช้พูด” ออกจาก “สิ่งที่ผู้ใช้ต้องการจริง” ตรวจจับโดเมนจากคำสำคัญไทย-อังกฤษ ประเมินขนาดการใช้งาน แพลตฟอร์ม งบประมาณ และกรอบเวลา พร้อมให้คะแนนความมั่นใจในการตีความ",
  },
  {
    n: "02",
    title: "ENRICH — เติมความรู้เฉพาะโดเมน",
    body: "เติมสิ่งที่ผู้เชี่ยวชาญรู้แต่ผู้ใช้ไม่ได้บอก: เอนทิตีข้อมูล เวิร์กโฟลว์มาตรฐาน ตัวชี้วัด ข้อกำหนดกฎหมายไทย (PDPA/สรรพากร/แรงงาน) ความเสี่ยงที่พบบ่อย และเครื่องมือที่ระบบต้องมี ทุกอย่างที่เติมจะติดป้าย [ASSUMPTION] จนกว่ามนุษย์จะยืนยัน",
  },
  {
    n: "03",
    title: "ARCHITECT — ประกอบ 5 เสา × 6 หัวข้อ",
    body: "คอมไพล์ 30 หัวข้อ โดยแต่ละหัวข้อมี: สรุป · เนื้อหาออกแบบเจาะจงโดเมน (ตาราง/ตัวเลข/JSON Schema) · Prompt Snippet ที่คัดลอกไปใช้ได้ทันที · Checklist · Anti-patterns",
  },
  {
    n: "04",
    title: "REVERSE — ทวนความเข้าใจกลับ",
    body: "ก่อนลงมือจริง ระบบจะสรุปความเข้าใจกลับ พร้อมสมมติฐาน คำถามที่ต้องยืนยัน (≤6 ข้อ) เกณฑ์ยอมรับผลงาน และสิ่งที่อยู่นอกขอบเขต — ตอบคำถามแล้วระบบจะคอมไพล์ใหม่ทั้งชุด (Human-in-the-Loop จริง)",
  },
  {
    n: "05",
    title: "ASSEMBLE — ประกอบ Master Prompt 360°",
    body: "รวม 30 Snippet เป็นพรอมต์เดียวที่เรียงลำดับถูกต้อง role → context → task → constraints → tools → safety → loop → output format → examples → final check",
  },
  {
    n: "06",
    title: "META — ผลิต Meta-Prompt",
    body: "ผลิตพรอมต์สำหรับสั่ง AI ตัวอื่นให้สร้างพรอมต์ต่อ ครอบคลุมกระบวนการ 8 ขั้น (DECODE → ENRICH → ARCHITECT → REVERSE → ASSEMBLE → STRESS TEST → EVALUATE → DELIVER) พร้อมข้อห้าม รูปแบบผลลัพธ์ และ self-check",
  },
];

const PRINCIPLES = [
  { t: "เจาะจงเสมอ ไม่ลอยตัว", d: "ทุกบรรทัดของพรอมต์ต้องอ้างอิงรายละเอียดจริงของโดเมน ถ้าตัดออกแล้วพฤติกรรมไม่เปลี่ยน แปลว่าไม่ควรมีอยู่" },
  { t: "วัดผลได้", d: "ทุกหัวข้อมีตัวเลขที่ตรวจสอบได้อย่างน้อย 1 ตัว เช่น เพดาน token, จำนวน retry, SLA, เกณฑ์คะแนน" },
  { t: "ห้ามให้โมเดลคำนวณเงิน", d: "ตัวเลขการเงิน/ภาษี/สต๊อก ต้องมาจากฟังก์ชันที่ deterministic เสมอ โมเดลมีหน้าที่บรรยายเท่านั้น" },
  { t: "Guardrail อยู่นอกโมเดล", d: "การเขียนว่า “ห้ามทำ X” เป็นเพียงชั้นแรก สิทธิ์จริงต้องบังคับที่ API และฐานข้อมูล" },
  { t: "มีทางออกเมื่อไม่รู้", d: "ทุกพรอมต์ต้องระบุพฤติกรรมเมื่อข้อมูลไม่พอ เมื่อเครื่องมือล้มเหลว และเมื่อถูกโจมตีด้วย prompt injection" },
  { t: "จบด้วยสิ่งที่ทำต่อได้", d: "ทุกผลลัพธ์ต้องมี next action ที่ระบุกริยา ผู้รับผิดชอบ เวลา และผลที่คาดหวัง" },
];

export default function MethodPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-white">วิธีการทำงานของ Prompt Architect 360°</h1>
      <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-slate-400">
        ระบบนี้เป็น <strong className="text-slate-200">คอมไพเลอร์พรอมต์</strong> ที่ทำงานแบบกำหนดผลได้ (deterministic) —
        รับความต้องการภาษาคนสั้นๆ แล้วประกอบเป็นพิมพ์เขียวพรอมต์ที่ครบทุกมิติ โดยไม่ต้องพึ่งการเดาของโมเดล
        ทำให้ผลลัพธ์คงเส้นคงวา ตรวจสอบย้อนหลังได้ และเก็บลงฐานข้อมูลเพื่อทำเวอร์ชันได้จริง
      </p>

      <div className="mt-8 space-y-3">
        {STEPS.map((s) => (
          <div key={s.n} className="glass flex gap-4 rounded-2xl p-5">
            <span className="text-2xl font-black text-white/15">{s.n}</span>
            <div>
              <p className="text-[15px] font-bold text-white">{s.title}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-slate-400">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold text-white">หลักการที่ยึดในทุกหัวข้อ</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <div key={p.t} className="glass rounded-2xl p-4">
            <p className="text-[13.5px] font-semibold text-violet-200">{p.t}</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-400">{p.d}</p>
          </div>
        ))}
      </div>

      <div className="glass mt-10 rounded-3xl border-violet-400/25 bg-violet-500/[0.07] p-6 text-center">
        <p className="text-[15px] font-semibold text-white">พร้อมลองแล้วใช่ไหม</p>
        <p className="mt-1 text-[13px] text-slate-400">พิมพ์ความต้องการ 1 บรรทัด แล้วดูพิมพ์เขียว 30 หัวข้อที่ระบบสร้างให้</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 px-5 py-2.5 text-[13.5px] font-semibold text-white transition hover:brightness-110"
        >
          เริ่มสร้างพิมพ์เขียว →
        </Link>
      </div>
    </div>
  );
}
