import { detectDomain } from "./domains";
import type { Analysis, GenerateInput } from "@/lib/types";

const SCALE_RULES: { key: string; label: string; words: string[] }[] = [
  { key: "solo", label: "ขนาดเล็กมาก (1-5 ผู้ใช้ / ร้านเดียว)", words: ["เล็กๆ", "เล็ก ๆ", "เล็ก", "ร้านเดียว", "คนเดียว", "small", "tiny", "เริ่มต้น", "มือใหม่", "งบน้อย"] },
  { key: "sme", label: "ขนาดกลาง (5-50 ผู้ใช้ / หลายสาขา)", words: ["sme", "ขนาดกลาง", "หลายสาขา", "สาขา", "ทีม", "บริษัท", "medium"] },
  { key: "enterprise", label: "ระดับองค์กร (50+ ผู้ใช้ / หลายหน่วยงาน)", words: ["องค์กร", "enterprise", "หลายบริษัท", "ทั่วประเทศ", "ขนาดใหญ่", "large", "corporate", "multi-tenant"] },
];

const PLATFORM_RULES: { label: string; words: string[] }[] = [
  { label: "Web (Responsive)", words: ["เว็บ", "web", "เว็บไซต์", "browser", "dashboard", "แดชบอร์ด"] },
  { label: "Tablet POS / Kiosk", words: ["แท็บเล็ต", "tablet", "ipad", "pos", "หน้าร้าน", "kiosk", "จอสัมผัส"] },
  { label: "Mobile App (iOS/Android)", words: ["มือถือ", "แอป", "app", "ios", "android", "mobile", "โทรศัพท์"] },
  { label: "LINE OA / Chat", words: ["line", "ไลน์", "แชท", "chat", "messenger", "บอท"] },
  { label: "Back-office / Admin", words: ["หลังบ้าน", "admin", "แอดมิน", "back office", "ผู้ดูแล", "รายงาน"] },
];

function titleCaseRequirement(req: string): string {
  const cleaned = req.replace(/\s+/g, " ").trim();
  return cleaned.length > 90 ? `${cleaned.slice(0, 88)}…` : cleaned;
}

export function analyzeRequirement(input: GenerateInput): Analysis {
  const requirement = input.requirement.trim();
  const lower = requirement.toLowerCase();
  const { pack, confidence, matched } = detectDomain(requirement);

  const scale =
    SCALE_RULES.find((rule) => rule.words.some((w) => lower.includes(w.toLowerCase())))?.label ??
    "ยังไม่ระบุขนาด — ตั้งสมมติฐานเป็นทีมเล็ก 1-10 ผู้ใช้";

  const platforms = PLATFORM_RULES.filter((rule) => rule.words.some((w) => lower.includes(w.toLowerCase()))).map((r) => r.label);
  if (platforms.length === 0) platforms.push("Web (Responsive)", "Back-office / Admin");
  if (pack.key === "pos_restaurant" && !platforms.includes("Tablet POS / Kiosk")) platforms.push("Tablet POS / Kiosk");

  const wantsFast = /(เร็ว|ด่วน|รีบ|ภายใน|สัปดาห์|เดือน|mvp|prototype|ทดลอง)/i.test(lower);
  const lowBudget = /(งบน้อย|ถูก|ประหยัด|ฟรี|budget|cheap|ไม่มีงบ)/i.test(lower);

  const refinementFacts = (input.refinements ?? []).filter((r) => r.answer.trim().length > 0);

  const assumptions: string[] = [
    `ตีความว่าโดเมนหลักคือ "${pack.label}" (ความมั่นใจ ${(confidence * 100).toFixed(0)}%)${matched.length ? ` จากคำสำคัญ: ${matched.slice(0, 5).join(", ")}` : " — ไม่พบคำสำคัญเฉพาะทาง จึงใช้เทมเพลตธุรกิจทั่วไป"}`,
    `ขนาดการใช้งาน: ${scale}`,
    `แพลตฟอร์มเป้าหมาย: ${platforms.join(" + ")}`,
    "ภาษาหลักของ UI และข้อมูลคือภาษาไทย รองรับสกุลเงิน THB และเขตเวลา Asia/Bangkok",
    lowBudget
      ? "งบประมาณจำกัด จึงเลือกสถาปัตยกรรม single-server + managed Postgres และหลีกเลี่ยง SaaS ราคาสูง"
      : "งบประมาณระดับปกติสำหรับ SME สามารถใช้บริการ managed service ที่ช่วยลดงานดูแลระบบได้",
    wantsFast
      ? "ต้องการเห็นผลเร็ว จึงวางแผนแบบ MVP-first ส่งมอบใช้งานจริงได้ใน 4-6 สัปดาห์"
      : "ยังไม่ระบุกรอบเวลา จึงเสนอแผน 3 เฟส (MVP → Hardening → Scale) เป็นค่าเริ่มต้น",
  ];

  for (const fact of refinementFacts) {
    assumptions.push(`ผู้ใช้ยืนยันเพิ่มเติม: ${fact.question} → ${fact.answer}`);
  }

  const answeredQuestions = new Set(refinementFacts.map((r) => r.question));
  const unknowns = pack.unknowns.filter((q) => !answeredQuestions.has(q));

  const title = pack.key === "generic" ? titleCaseRequirement(requirement) : `${pack.titleTemplate}`;

  const nonFunctional = [...pack.nonFunctional];
  if (input.depth === "enterprise") {
    nonFunctional.push(
      "Multi-tenant isolation ระดับแถว (Row-Level Security) + การแยกคีย์เข้ารหัสต่อผู้เช่า",
      "SSO ด้วย SAML/OIDC และบังคับ MFA สำหรับบทบาทที่มีสิทธิ์สูง",
      "แผนกู้คืนภัยพิบัติ: RPO ≤ 15 นาที, RTO ≤ 4 ชั่วโมง พร้อมซ้อมจริงปีละ 2 ครั้ง",
      "การควบคุมตามกรอบ ISO 27001 / SOC 2: access review รายไตรมาส และ change management ที่ตรวจสอบได้",
    );
    assumptions.push("ระดับ Enterprise: เพิ่มข้อกำหนดด้าน multi-tenant, SSO/MFA, DR และการตรวจสอบตามมาตรฐานสากล");
  } else if (input.depth === "lite") {
    assumptions.push("ระดับ Lite: ตัดรายละเอียดที่ยังไม่จำเป็นในเฟสแรกออก เน้นให้ทีมเริ่มลงมือได้เร็วที่สุด");
  }

  return {
    requirement,
    normalized: requirement.replace(/\s+/g, " ").trim(),
    title,
    subtitle: `${pack.label} · ${scale}`,
    domainKey: pack.key,
    domainLabel: pack.label,
    domainEmoji: pack.emoji,
    confidence,
    scale,
    platforms,
    actors: pack.actors,
    entities: pack.entities,
    jobs: pack.jobs,
    kpis: pack.kpis,
    compliance: pack.compliance,
    integrations: pack.integrations,
    risks: pack.risks,
    nonFunctional,
    glossary: pack.glossary,
    dataSources: pack.dataSources,
    tools: pack.tools,
    keywords: matched,
    assumptions,
    unknowns,
    outOfScope: pack.outOfScope,
    budgetHint: lowBudget ? "ประหยัดสุด (< 3,000 บาท/เดือน)" : "มาตรฐาน SME (3,000-15,000 บาท/เดือน)",
    timelineHint: wantsFast ? "MVP ภายใน 4-6 สัปดาห์" : "3 เฟส ประมาณ 10-14 สัปดาห์",
  };
}
