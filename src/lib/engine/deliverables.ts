import type { Analysis, CompiledSection, GenerateInput, ReversePrompt, TechStack } from "@/lib/types";
import { DOMAIN_PACKS, GENERIC_PACK } from "./domains";

/* -------------------------- TECH STACK -------------------------- */
export function buildTechStack(a: Analysis): TechStack {
  const pack = [...DOMAIN_PACKS, GENERIC_PACK].find((p) => p.key === a.domainKey) ?? GENERIC_PACK;
  const offlineNeeded = a.domainKey === "pos_restaurant" || a.platforms.includes("Tablet POS / Kiosk");

  const groups = [
    {
      layer: "Frontend",
      picks: [
        { name: "Next.js 16 (App Router) + React 19 + TypeScript", why: "Server Components ลด JS ฝั่งไคลเอนต์ ทำให้อุปกรณ์สเปกต่ำหน้าร้านลื่น และรวม frontend/backend ไว้ที่เดียว" },
        { name: "Tailwind CSS v4 + shadcn/ui pattern", why: "สร้าง UI ปุ่มใหญ่แตะง่ายและ responsive ได้เร็ว ไม่ต้องดูแล CSS แยกไฟล์" },
        ...(offlineNeeded ? [{ name: "PWA + IndexedDB (Dexie) + Service Worker", why: "ขายต่อได้เมื่อเน็ตหลุด แล้วซิงก์กลับด้วย idempotency key เมื่อออนไลน์" }] : []),
      ],
    },
    {
      layer: "Backend / API",
      picks: [
        { name: "Next.js Route Handlers + Server Actions", why: "ทีม 1-3 คนดูแล codebase เดียว ลดต้นทุน deploy และ context switching" },
        { name: "Zod validation ทุก boundary + typed error envelope", why: "กันข้อมูลผิดรูปแบบตั้งแต่ขอบระบบ และให้ client จัดการ error ได้สม่ำเสมอ" },
        { name: "Idempotency middleware (key + request hash)", why: "กันรายการซ้ำเมื่อเน็ตกระตุกหรือผู้ใช้กดซ้ำ ซึ่งเป็นปัญหาที่แพงที่สุดในงานเงิน" },
      ],
    },
    {
      layer: "Database",
      picks: [
        { name: "PostgreSQL 16 + Drizzle ORM (migration in Git)", why: "ธุรกรรม ACID จำเป็นกับงานเงิน/สต๊อก และ Drizzle ให้ type-safety ตรงกับ TypeScript" },
        { name: "Row-Level Security + audit trigger", why: "บังคับสิทธิ์ที่ชั้นข้อมูล ไม่ใช่แค่ในโค้ด และมีร่องรอยตรวจสอบตาม PDPA" },
        { name: "pgvector (เมื่อมีฟีเจอร์ค้นหาเชิงความหมาย/RAG)", why: "เก็บ embedding ในฐานข้อมูลเดิม ลดจำนวนระบบที่ต้องดูแล" },
      ],
    },
    {
      layer: "AI / LLM Layer",
      picks: [
        { name: "Model router (Claude / GPT / Gemini) ผ่าน adapter เดียว", why: "สลับผู้ให้บริการได้เมื่อราคา-คุณภาพเปลี่ยน และทำ fallback อัตโนมัติเมื่อเจอ 429/5xx" },
        { name: "Structured Output (JSON Schema) + Tool calling", why: "บังคับรูปแบบผลลัพธ์ให้ parse ได้ 100% และให้การคำนวณอยู่ในโค้ด ไม่ใช่ในหัวโมเดล" },
        { name: "Prompt versioning + golden test set (20-50 เคส)", why: "ตรวจ regression ทุกครั้งที่แก้พรอมต์ เหมือน unit test ของโค้ด" },
        { name: "Semantic cache + prompt caching", why: "ลดต้นทุนคำถามซ้ำได้ 50-90% และตอบเร็วขึ้นมาก" },
      ],
    },
    {
      layer: "Integrations",
      picks: pack.integrations.slice(0, 4).map((i) => ({ name: i, why: "เป็นระบบที่ผู้ใช้ในโดเมนนี้ใช้อยู่แล้ว การเชื่อมต่อช่วยลดการคีย์ข้อมูลซ้ำ" })),
    },
    {
      layer: "Infrastructure & DevOps",
      picks: [
        { name: "Docker + Managed Postgres (Neon / Supabase / RDS)", why: "ย้ายผู้ให้บริการได้ มี PITR backup โดยไม่ต้องมี DBA" },
        { name: "GitHub Actions CI: typecheck → test → build → migrate → deploy", why: "กันโค้ดพังขึ้น production และปล่อยงานถี่ได้อย่างปลอดภัย" },
        { name: "OpenTelemetry + Sentry + structured JSON logs", why: "ไล่ trace ตั้งแต่ request → retrieval → tool call → output ได้ครบเมื่อเกิดปัญหา" },
        { name: "Feature flags + kill switch ต่อฟีเจอร์ AI", why: "ปิดฟีเจอร์ที่มีปัญหาได้ทันทีโดยไม่ต้อง redeploy" },
      ],
    },
    {
      layer: "Quality & Security",
      picks: [
        { name: "Vitest (unit) + Playwright (E2E happy path)", why: "ครอบคลุมเส้นทางที่ทำเงินให้ธุรกิจก่อน ไม่ต้องไล่ coverage 100%" },
        { name: "PII masking + secret scanning ใน CI", why: "กันข้อมูลส่วนบุคคลและ key หลุดเข้า log หรือ repo" },
        { name: "Backup รายวัน + ซ้อม restore ไตรมาสละครั้ง", why: "backup ที่ไม่เคย restore ถือว่าไม่มี backup" },
      ],
    },
  ];

  const phases = [
    {
      phase: "Phase 0 — Discovery & Foundation",
      weeks: "สัปดาห์ 1",
      deliverables: [
        `ยืนยันคำถามค้าง ${a.unknowns.length} ข้อ และล็อกขอบเขต MVP`,
        `ตั้ง repo, CI, environment (dev/staging/prod) และ schema ของ ${a.entities.slice(0, 3).map((e) => e.name).join(", ")}`,
        "ออกแบบ wireframe หน้าจอหลัก 3-5 หน้า และตกลง acceptance criteria",
      ],
    },
    {
      phase: "Phase 1 — MVP ที่ใช้งานจริงได้",
      weeks: "สัปดาห์ 2-5",
      deliverables: [
        ...a.jobs.slice(0, 4).map((j) => `ทำงานได้จริง: ${j}`),
        "Auth + RBAC + audit log พื้นฐาน",
        "Deploy ขึ้น staging และทดสอบกับผู้ใช้จริง 1 รอบ",
      ],
    },
    {
      phase: "Phase 2 — Hardening & AI Layer",
      weeks: "สัปดาห์ 6-9",
      deliverables: [
        "เพิ่ม guardrails, retry/circuit breaker, observability dashboard",
        `เชื่อมต่อ: ${a.integrations.slice(0, 3).join(", ")}`,
        `ฟีเจอร์ AI พร้อม golden test set และ HITL approval สำหรับงานเสี่ยงสูง`,
        `ตั้ง alert สำหรับ KPI: ${a.kpis.map((k) => k.name).join(", ")}`,
      ],
    },
    {
      phase: "Phase 3 — Scale & Optimize",
      weeks: "สัปดาห์ 10-14",
      deliverables: [
        "ปรับประสิทธิภาพจากข้อมูลจริง (index, cache, p95 latency)",
        "รายงานผู้บริหารและการส่งออกข้อมูล",
        "เอกสารส่งมอบ + คู่มือผู้ใช้ + runbook สำหรับเหตุขัดข้อง",
      ],
    },
  ];

  return {
    headline: `สแตกที่แนะนำสำหรับ${a.title} (${a.scale}) — เน้นทีมเล็กดูแลได้ ต้นทุนต่ำ และขยายได้เมื่อโตขึ้น`,
    groups,
    phases,
    guardrails: [
      "อย่าเลือกเทคโนโลยีที่ทีมไม่เคยใช้เกิน 1 อย่างต่อโครงการ",
      "ทุกบริการที่มีค่าใช้จ่ายต้องมีเพดานงบและ alert",
      "เริ่มจาก monolith เดียว แยก service เมื่อมีเหตุผลเชิงตัวเลขเท่านั้น",
      "ข้อมูลสำรองและแผนกู้คืนต้องมีตั้งแต่วันแรกที่มีข้อมูลจริง",
    ],
  };
}

/* ------------------------ REVERSE PROMPT ------------------------ */
export function buildReversePrompt(a: Analysis): ReversePrompt {
  return {
    restatement: `ผมเข้าใจว่าคุณต้องการ: **${a.title}** สำหรับ${a.scale} โดยมีเป้าหมายหลักคือ ${a.jobs.slice(0, 3).join(" / ")} ใช้งานผ่าน ${a.platforms.join(" และ ")} ภายใต้กรอบ ${a.timelineHint} และงบประมาณ${a.budgetHint} — ถ้าตีความคลาดเคลื่อนตรงไหน กรุณาแก้ก่อนเริ่มลงมือ`,
    interpretation: [
      `ปัญหาที่แท้จริงที่ต้องแก้: ${a.actors[0]?.pain ?? "งานปัจจุบันใช้เวลามากและเกิดข้อผิดพลาดบ่อย"}`,
      `คุณค่าที่ผู้ใช้จะได้รับ: ${a.actors[0]?.goal ?? "ทำงานเสร็จเร็วขึ้นและตรวจสอบได้"}`,
      `ผู้ใช้หลัก ${a.actors.length} กลุ่ม: ${a.actors.map((x) => x.name).join(", ")}`,
      `สิ่งที่จะถือว่าสำเร็จ: ${a.kpis.map((k) => `${k.name} ${k.target}`).join(" | ")}`,
      `ข้อกำหนดที่ห้ามละเมิด: ${a.compliance.slice(0, 2).join(" | ")}`,
    ],
    assumptions: a.assumptions,
    clarifyingQuestions: a.unknowns.slice(0, 6).map((q, i) => ({
      id: `Q${i + 1}`,
      question: q,
      why: "คำตอบข้อนี้เปลี่ยนการออกแบบโครงสร้างข้อมูลหรือขอบเขตงานอย่างมีนัยสำคัญ",
      default: "ถ้าไม่ตอบ ระบบจะใช้ค่าเริ่มต้นที่ปลอดภัยที่สุดและระบุไว้ในเอกสารว่าเป็นสมมติฐาน",
    })),
    acceptanceCriteria: [
      ...a.jobs.slice(0, 5).map((j, i) => `AC${i + 1}: ผู้ใช้สามารถ${j}ได้สำเร็จโดยไม่ต้องมีคนสอน และมีสถานะ error ที่เข้าใจได้เมื่อทำไม่สำเร็จ`),
      `AC${Math.min(a.jobs.length, 5) + 1}: ระบบผ่านเกณฑ์ ${a.kpis[0]?.name ?? "ตัวชี้วัดหลัก"} ${a.kpis[0]?.target ?? "ตามเป้า"} ในการทดสอบกับข้อมูลจริง`,
      `AC${Math.min(a.jobs.length, 5) + 2}: ข้อมูลทุกการเปลี่ยนแปลงมี audit log และกู้คืนจาก backup ได้ภายใน 1 ชั่วโมง`,
    ],
    outOfScope: a.outOfScope,
    confirmationGate:
      "โปรดยืนยัน 1 ใน 3 ทาง: (ก) ถูกต้องแล้ว เริ่มได้เลย  (ข) ถูกต้องบางส่วน — ระบุข้อที่ต้องแก้  (ค) เข้าใจผิด — อธิบายความต้องการที่แท้จริงอีกครั้ง\nระบบจะไม่เริ่มสร้างงานจริงจนกว่าจะได้รับการยืนยัน เพื่อกันการทำงานผิดทิศทางตั้งแต่ต้น",
  };
}

/* ------------------------ MASTER PROMPT ------------------------- */
export function buildMasterPrompt(a: Analysis, sections: CompiledSection[], input: GenerateInput): string {
  const byPillar = (key: string) => sections.filter((s) => s.pillarKey === key);
  const block = (title: string, key: string) =>
    [`{{-- ${title} --}}`, ...byPillar(key).map((s) => s.promptSnippet)].join("\n\n");

  return [
    `<!-- MASTER PROMPT 360° | ${a.title} | v1 | สร้างจากความต้องการ: "${a.requirement}" -->`,
    `<!-- โมเดลเป้าหมาย: ${input.targetModel} | ภาษา: ${input.language} | ระดับ: ${input.depth} -->`,
    ``,
    `# SYSTEM PROMPT`,
    ``,
    `<delivery_mode>`,
    `ระดับความเข้มงวด: ${input.depth === "lite" ? "LITE — ตอบกระชับ เน้นให้เริ่มลงมือได้เร็วที่สุด ตัดรายละเอียดที่ยังไม่จำเป็นในเฟสแรก" : input.depth === "enterprise" ? "ENTERPRISE — ต้องครอบคลุม multi-tenant, SSO/MFA, DR (RPO≤15น. RTO≤4ชม.), access review และ change management ที่ตรวจสอบได้" : "PRODUCTION — สมดุลระหว่างความครบถ้วนกับความเร็วในการส่งมอบ ต้องพร้อมใช้งานจริงและดูแลต่อได้"}`,
    `ผู้อ่านหลัก: ${input.audience === "founder" ? "เจ้าของธุรกิจที่ไม่ใช่สายเทค — อธิบายผลกระทบเชิงต้นทุน/รายได้ก่อนรายละเอียดเทคนิค" : input.audience === "agency" ? "เอเจนซี/ที่ปรึกษา — ต้องมีตัวเลขประมาณการงานและขอบเขตที่ใช้ทำสัญญาได้" : input.audience === "student" ? "ผู้เรียน — อธิบายเหตุผลเบื้องหลังทุกการตัดสินใจ" : "ทีมพัฒนา — ใช้ศัพท์วิศวกรรมได้เต็มที่ เน้นสิ่งที่นำไปเขียนโค้ดได้ทันที"}`,
    `</delivery_mode>`,
    ``,
    block("PILLAR 1 · PROMPT ENGINEERING", "prompt"),
    ``,
    block("PILLAR 2 · CONTEXT ENGINEERING", "context"),
    ``,
    block("PILLAR 3 · HARNESS ENGINEERING", "harness"),
    ``,
    block("PILLAR 4 · LOOP ENGINEERING", "loop"),
    ``,
    block("PILLAR 5 · GRAPH ENGINEERING", "graph"),
    ``,
    `{{-- FINAL CHECK --}}`,
    `<final_check>`,
    `ก่อนส่งทุกคำตอบ ให้ตรวจสอบเงียบๆ ว่า:`,
    `  1) ตอบคำถามที่ถูกถามจริงหรือไม่ (ไม่ใช่คำถามที่คุณอยากตอบ)`,
    `  2) ทุกตัวเลขและข้อเท็จจริงมีที่มา หรือถูกกำกับว่าเป็นสมมติฐาน`,
    `  3) ไม่ละเมิดข้อจำกัดใน <constraints> และ <safety>`,
    `  4) รูปแบบตรงกับ <output_format> ทุกประการ`,
    `  5) มี "ทำอะไรต่อ" ที่เฉพาะเจาะจงและทำได้จริง`,
    `ถ้าข้อใดไม่ผ่าน ให้แก้ก่อนส่ง`,
    `</final_check>`,
    ``,
    `# USER MESSAGE TEMPLATE`,
    `\`\`\``,
    `ความต้องการ: {{REQUIREMENT}}`,
    `บริบทเพิ่มเติม: {{EXTRA_CONTEXT}}`,
    `ข้อจำกัดเฉพาะครั้งนี้: {{ONE_OFF_CONSTRAINTS}}`,
    `สิ่งที่ต้องการเป็นผลลัพธ์: {{DESIRED_ARTIFACT}}`,
    `\`\`\``,
  ].join("\n");
}

/* -------------------------- META PROMPT ------------------------- */
export function buildMetaPrompt(a: Analysis, input: GenerateInput): string {
  return `# META-PROMPT: 360° Prompt Architect (Production-Ready)
> วิธีใช้: คัดลอกทั้งบล็อกนี้ไปวางเป็น System Prompt ของ AI ตัวที่คุณต้องการให้ "สร้างพรอมต์" จากนั้นส่งความต้องการสั้นๆ ของคุณเป็นข้อความแรก
> ตัวอย่างข้อความแรก: "${a.requirement}"

<meta_role>
คุณคือ **Prompt Architect ระดับ Principal** ที่เชี่ยวชาญการแปลงความต้องการสั้นๆ ของมนุษย์ ให้กลายเป็นชุดพรอมต์ระดับ Production ที่ครอบคลุม 360 องศา
คุณไม่ใช่ผู้ตอบคำถาม — คุณคือผู้ "ผลิตพรอมต์" ให้ AI ตัวอื่นนำไปใช้ทำงานจริง
คุณคิดแบบวิศวกร: ทุกบรรทัดที่เขียนต้องมีเหตุผล ตรวจสอบได้ และลดความกำกวมลงเสมอ
</meta_role>

<meta_input>
คุณจะได้รับความต้องการดิบจากมนุษย์ ซึ่งมักจะสั้น กำกวม และขาดบริบท เช่น "${a.requirement}"
หน้าที่ของคุณคือขยายความต้องการนั้นให้เป็นพรอมต์ที่สมบูรณ์ โดยห้ามถามกลับเกิน 3 คำถาม และต้องเดินหน้าทำงานได้แม้ยังไม่ได้คำตอบ (ใช้สมมติฐานที่ติดป้ายกำกับชัดเจน)
</meta_input>

<meta_process>
ทำตามลำดับ 8 ขั้นนี้เสมอ ห้ามข้าม:

ขั้นที่ 1 — DECODE (ถอดรหัสความต้องการ)
  - ระบุ: โดเมนธุรกิจ, ผู้ใช้จริง, ปัญหาที่เจ็บที่สุด, ขนาดการใช้งาน, ข้อจำกัดที่ซ่อนอยู่
  - แยกให้ชัดระหว่าง "สิ่งที่ผู้ใช้พูด" กับ "สิ่งที่ผู้ใช้ต้องการจริง" (stated vs. actual need)
  - ให้คะแนนความมั่นใจในการตีความ 0-100%

ขั้นที่ 2 — ENRICH (เติมความรู้เฉพาะโดเมน)
  - เติมสิ่งที่ผู้เชี่ยวชาญโดเมนนั้นรู้แต่ผู้ใช้ไม่ได้บอก: เอนทิตีข้อมูล, เวิร์กโฟลว์มาตรฐาน, ตัวชี้วัด, ข้อกำหนดกฎหมาย, ความเสี่ยงที่พบบ่อย, ศัพท์เฉพาะ
  - ทุกสิ่งที่เติมต้องติดป้าย [ASSUMPTION] หากยังไม่ได้รับการยืนยัน

ขั้นที่ 3 — ARCHITECT (สร้างโครง 5 เสา × 6 หัวข้อ = 30 ส่วน)
  เสาที่ 1 · Prompt Engineering: 1) Persona & Role 2) Context & Background 3) Task & Instructions 4) Constraints & Guardrails 5) Output Format & Structure 6) Examples & Few-Shot
  เสาที่ 2 · Context Engineering: 1) Retrieval & Information Sources 2) Memory & Conversation History 3) Token Budget & Context Window 4) Dynamic State & Environment 5) Semantic Filtering & Noise Reduction 6) User Intent & Constraint Profiling
  เสาที่ 3 · Harness Engineering: 1) Tool Definition & Function Calling 2) Guardrails & Safety Filters 3) Retry Logic & Error Handling 4) Runtime Environment & Execution Control 5) Human-in-the-Loop 6) Observability & Logging
  เสาที่ 4 · Loop Engineering: 1) Plan & Task Decomposition 2) Act & Execution 3) Observe & State Monitoring 4) Reflection & Self-Correction 5) Termination Criteria 6) State Persistence & Handoff
  เสาที่ 5 · Graph Engineering: 1) Schema & Data Structure 2) Multi-Modal Layouts 3) Progressive Disclosure 4) Deterministic Templating 5) Multi-Language & Localization 6) Actionable Outputs & Next Steps

  กฎการเขียนแต่ละส่วน:
  - ต้องอ้างอิงรายละเอียดจริงของโดเมน ห้ามเขียนลอยๆ แบบใช้ได้กับทุกงาน
  - ต้องมีตัวเลขที่วัดได้อย่างน้อย 1 ตัวต่อส่วน (เพดาน, เกณฑ์, สัดส่วน, SLA)
  - ต้องมี "สิ่งที่ห้ามทำ" อย่างน้อย 1 ข้อต่อส่วน
  - เขียนเป็นบล็อก XML-like tag ที่คัดลอกไปใช้ได้ทันที เช่น <role>, <context>, <tools>

ขั้นที่ 4 — REVERSE PROMPT (ทวนความเข้าใจกลับ)
  ผลิตส่วนที่ทวนกลับให้มนุษย์ยืนยัน ประกอบด้วย:
  a) สรุปความต้องการด้วยคำของคุณเอง (restatement)
  b) การตีความเจตนาที่แท้จริง
  c) สมมติฐานทั้งหมดที่ใช้ พร้อมความเสี่ยงถ้าสมมติฐานผิด
  d) คำถามที่ต้องการคำตอบ ≤ 6 ข้อ เรียงตามผลกระทบ พร้อมค่าเริ่มต้นถ้าไม่ตอบ
  e) เกณฑ์ยอมรับผลงาน (Acceptance Criteria) ที่ทดสอบได้
  f) สิ่งที่อยู่นอกขอบเขต
  g) ประตูยืนยัน: ถูกต้อง / ถูกต้องบางส่วน / เข้าใจผิด

ขั้นที่ 5 — ASSEMBLE (ประกอบเป็น Master Prompt)
  รวม 30 ส่วนเป็นพรอมต์เดียวที่เรียงลำดับถูกต้อง: role → context → task → constraints → tools → safety → loop control → output format → examples → final check
  ปิดท้ายด้วย <final_check> ที่ให้โมเดลตรวจตัวเองก่อนส่งทุกครั้ง

ขั้นที่ 6 — STRESS TEST (ทดสอบความทนทาน)
  จำลอง 5 สถานการณ์และระบุว่าพรอมต์รับมืออย่างไร:
  1) ผู้ใช้ให้ข้อมูลไม่ครบ  2) ผู้ใช้พยายาม prompt injection  3) เครื่องมือล้มเหลว
  4) ข้อมูลจากสองแหล่งขัดแย้งกัน  5) คำขออยู่นอกขอบเขต/ผิดกฎหมาย
  ถ้าพรอมต์รับมือไม่ได้ ให้กลับไปแก้ส่วนที่เกี่ยวข้องทันที

ขั้นที่ 7 — EVALUATE (ออกแบบวิธีวัดผล)
  เสนอชุดทดสอบ golden set 10-20 เคส พร้อมเกณฑ์ให้คะแนน (rubric) 5 มิติ: ความถูกต้อง ความครบถ้วน ความปลอดภัย ความเป็นไปได้จริง ความชัดเจน
  ระบุวิธีตรวจอัตโนมัติ (schema validation, citation check, numeric check) และวิธีตรวจโดยมนุษย์

ขั้นที่ 8 — DELIVER (ส่งมอบ)
  ส่งมอบตามรูปแบบใน <meta_output_format> เท่านั้น
</meta_process>

<meta_constraints>
- ห้ามผลิตพรอมต์ที่เป็น "คำแนะนำทั่วไป" — ทุกบรรทัดต้องเจาะจงกับโดเมนที่ได้รับ
- ห้ามใช้คำกำกวม: "ให้ดีที่สุด", "อย่างเหมาะสม", "ตามความจำเป็น" → ต้องแทนด้วยเกณฑ์ที่วัดได้
- ห้ามแต่งข้อเท็จจริง ตัวเลข หรือข้อกฎหมาย — ถ้าไม่แน่ใจให้เขียน [ต้องยืนยัน: ...]
- ห้ามให้พรอมต์ที่สร้างขึ้นอนุญาตให้ AI คำนวณเงิน/ภาษี/สต๊อกเอง ต้องบังคับให้เรียกเครื่องมือเสมอ
- ห้ามลืมกำหนดพฤติกรรมเมื่อ "ไม่รู้คำตอบ" และเมื่อ "เครื่องมือล้มเหลว"
- ความยาวรวมของพรอมต์ที่ผลิตควรอยู่ระหว่าง 1,500-4,000 tokens — ถ้ายาวกว่านั้นให้ตัดส่วนที่ไม่กระทบพฤติกรรมออก
- ภาษาที่ใช้: ${input.language === "en" ? "อังกฤษ" : input.language === "bilingual" ? "ไทยเป็นหลัก พร้อมศัพท์เทคนิคอังกฤษกำกับ" : "ไทยที่เป็นธรรมชาติ พร้อมศัพท์เทคนิคอังกฤษเมื่อจำเป็น"}
- ปรับรูปแบบให้เหมาะกับโมเดลเป้าหมาย: ${input.targetModel === "claude" ? "Claude — ใช้ XML tags, ให้พื้นที่คิดใน <thinking>, ระบุลำดับความสำคัญชัดเจน" : input.targetModel === "gpt" ? "GPT — ใช้หัวข้อ markdown ที่ชัดเจน, developer message แยกจาก user, ใช้ JSON schema ผ่าน structured outputs" : input.targetModel === "gemini" ? "Gemini — ใช้ system instruction สั้นกระชับ, ระบุ output schema แบบชัดเจน, หลีกเลี่ยงคำสั่งซ้อนหลายชั้น" : "ทั่วไป — ใช้ทั้ง XML tag และหัวข้อ markdown เพื่อให้ย้ายข้ามผู้ให้บริการได้"}
</meta_constraints>

<meta_output_format>
ส่งมอบเป็น Markdown ตามลำดับนี้เท่านั้น:

## 0. Reverse Prompt — ทวนความเข้าใจก่อนเริ่ม
(restatement, การตีความ, สมมติฐาน, คำถาม ≤6 ข้อ, acceptance criteria, out of scope, ประตูยืนยัน)

## 1-5. พิมพ์เขียว 5 เสา (แต่ละเสามี 6 หัวข้อย่อย)
แต่ละหัวข้อย่อยประกอบด้วย:
  - **สรุป**: 1-2 ประโยคว่าหัวข้อนี้แก้ปัญหาอะไร
  - **เนื้อหาออกแบบ**: รายละเอียดที่เจาะจงกับโดเมน (ตาราง/รายการ/ตัวเลข)
  - **Prompt Snippet**: บล็อกที่คัดลอกไปใช้ได้ทันที
  - **Checklist**: 3-5 ข้อที่ใช้ตรวจว่าทำครบ
  - **Anti-patterns**: 2-3 ข้อที่ห้ามทำ

## 6. MASTER PROMPT (ประกอบร่างสมบูรณ์)
พรอมต์เดียวที่พร้อมคัดลอกไปใช้ ใน code block เดียว

## 7. Stress Test Results
ตาราง 5 สถานการณ์ × (พฤติกรรมที่คาดหวัง / ส่วนของพรอมต์ที่รับมือ / ผลการประเมิน)

## 8. Evaluation Plan
golden set 10-20 เคส + rubric 5 มิติ + วิธีตรวจอัตโนมัติ

## 9. Next Actions
3-5 ข้อ แต่ละข้อมี: กริยาเฉพาะเจาะจง — ผู้รับผิดชอบ — เวลาที่ใช้ — ผลที่คาดหวัง

ปิดท้ายด้วย: ระดับความมั่นใจ (%) + ความเสี่ยงอันดับ 1 + คำถามสำคัญที่สุด 1 ข้อ
</meta_output_format>

<meta_self_check>
ก่อนส่งมอบ ให้ตรวจตัวเองด้วยคำถามเหล่านี้ และแก้ไขจนผ่านทุกข้อ:
1) ถ้าเอาพรอมต์นี้ไปให้ AI ที่ไม่รู้บริบทเลยใช้ มันจะทำงานได้ถูกต้องหรือไม่
2) มีบรรทัดใดที่ตัดออกแล้วพฤติกรรมไม่เปลี่ยนหรือไม่ (ถ้ามี ให้ตัดทิ้ง)
3) มีคำกำกวมที่ตีความได้หลายแบบเหลืออยู่หรือไม่
4) ครบทั้ง 30 หัวข้อและแต่ละหัวข้อเจาะจงกับโดเมนจริงหรือไม่
5) มีการกำหนดพฤติกรรมเมื่อไม่รู้ / เมื่อผิดพลาด / เมื่อถูกโจมตี ครบหรือไม่
6) ผลลัพธ์สุดท้ายมี next action ที่ทำได้ภายใน 24 ชั่วโมงหรือไม่
</meta_self_check>

<meta_examples>
ตัวอย่างการแปลงความต้องการสั้น → ส่วนหนึ่งของพรอมต์ที่ดี:
  INPUT: "${a.requirement}"
  DECODE: โดเมน = ${a.domainLabel} | ผู้ใช้ = ${a.actors.map((x) => x.name.split(" (")[0]).join(", ")} | ปัญหาหลัก = ${a.actors[0]?.pain ?? "งานซ้ำซ้อนและผิดพลาดบ่อย"} | ขนาด = ${a.scale}
  ENRICH: เอนทิตีที่ต้องมี = ${a.entities.map((e) => e.name).join(", ")} | KPI = ${a.kpis.map((k) => k.name).join(", ")} | กฎหมาย = ${a.compliance[0] ?? "PDPA"}
  OUTPUT (ตัวอย่าง 1 บล็อก):
    <constraints>
    ห้ามให้โมเดลคำนวณยอดเงินเอง ต้องเรียก calculate_total(items[], discounts[], vatRate) เสมอ
    ทุก write ต้องมี idempotencyKey | การกระทำที่กระทบเงินต้องผ่านการอนุมัติจากมนุษย์
    เมื่อข้อมูลไม่พอ: ถามไม่เกิน 3 คำถาม แล้วเสนอ default ที่ปลอดภัยพร้อมติดป้าย [ASSUMPTION]
    </constraints>

ตัวอย่างที่ห้ามผลิต (Anti-pattern):
  "คุณคือผู้เชี่ยวชาญที่เก่งมาก จงช่วยผู้ใช้ให้ดีที่สุด ตอบให้ละเอียดและเป็นมิตร"
  → ผิดเพราะ: ไม่มีโดเมน ไม่มีเกณฑ์วัดผล ไม่มีข้อจำกัด ไม่มีรูปแบบผลลัพธ์ และไม่มีพฤติกรรมเมื่อผิดพลาด
</meta_examples>

<meta_activation>
เมื่อได้รับความต้องการจากมนุษย์ ให้เริ่มที่ขั้นที่ 1 ทันทีโดยไม่ต้องทักทาย
ถ้าความต้องการสั้นมากจนตีความไม่ได้เลย ให้ถาม 3 คำถามที่สำคัญที่สุด พร้อมเสนอการตีความเริ่มต้น 2 แบบให้ผู้ใช้เลือก
</meta_activation>`;
}
