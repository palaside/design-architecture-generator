import type { Analysis, CompiledSection, GenerateInput } from "@/lib/types";
import { PILLARS } from "@/lib/types";

const li = (items: string[], bullet = "-") => items.map((i) => `${bullet} ${i}`).join("\n");
const num = (items: string[]) => items.map((i, idx) => `${idx + 1}. ${i}`).join("\n");
const estTokens = (s: string) => Math.max(1, Math.round(s.length / 3.4));

interface Draft {
  key: string;
  th: string;
  en: string;
  summary: string;
  body: string;
  snippet: string;
  checklist: string[];
  antiPatterns: string[];
}

function pillarLabel(key: string) {
  return PILLARS.find((p) => p.key === key)!.label;
}

/* 1. BRAND IDENTITY & MOOD */
function brandPillar(a: Analysis, input: GenerateInput): Draft[] {
  return [
    {
      key: "brand_tone",
      th: "Mood & Tone — อารมณ์และความรู้สึกหลัก",
      en: "Mood & Tone",
      summary: "กำหนดทิศทางอารมณ์และภาพลักษณ์หลักของดีไซน์ที่ต้องการสะท้อนผ่านหน้าต่างระบบ",
      body: `แนวทางดีไซน์ของ ${a.title} จะเน้นอารมณ์ที่เข้ากับผู้ใช้แบบ ${a.scale} ด้วยน้ำเสียงและโทนของ UI ที่ชัดเจนและเป็นมิตร`,
      snippet: "<mood_tone>เน้นดีไซน์แนวทันสมัย สะอาด สบายตา เข้าถึงง่าย</mood_tone>",
      checklist: ["มีนิยาม Mood & Tone ชัดเจน", "ตรงตามเป้าหมายของกลุ่มผู้ใช้"],
      antiPatterns: ["ใช้โทนดีไซน์ขัดแย้งกับจุดประสงค์ของระบบ"]
    },
    {
      key: "brand_keywords",
      th: "Brand Keywords — คำสำคัญประจำดีไซน์",
      en: "Brand Keywords",
      summary: "คำนิยามหรือคีย์เวิร์ดที่ใช้ในการตีกรอบไอเดียดีไซน์ทั้งหมด",
      body: li(["Friendly — เป็นมิตรเข้าถึงง่าย", "Professional — มีความน่าเชื่อถือสูง", "Intuitive — สังเกตและใช้งานง่ายโดยไม่ต้องสอน"]),
      snippet: "<keywords>Friendly, Professional, Intuitive</keywords>",
      checklist: ["ระบุคีย์เวิร์ดอย่างน้อย 3 คำ"],
      antiPatterns: ["ใช้คีย์เวิร์ดกว้างเกินไปไม่มีผลเชิงรูปธรรม"]
    },
    {
      key: "logo_direction",
      th: "Logo & Icons Direction — แนวทางการดีไซน์โลโก้และไอคอน",
      en: "Logo & Icons Direction",
      summary: "รูปแบบแนวทางในการออกแบบโลโก้และสไตล์ของไอคอนที่เข้าคู่กัน",
      body: `แนวทางไอคอนเน้นสไตล์ Line Icons ความหนาคงที่ 2px เพื่อความมินิมอล`,
      snippet: "<icons>Line Icon style, 2px stroke width</icons>",
      checklist: ["ระบุสไตล์ความหนาของเส้นไอคอน", "ระบุธีมไอคอนที่ล้อไปกับแบรนด์"],
      antiPatterns: ["ผสมไอคอนหลายสไตล์ (เช่น ลายเส้นผสมแบบทึบสี)"]
    },
    {
      key: "typography_mood",
      th: "Typography Tone — อารมณ์ของฟอนต์หลัก",
      en: "Typography Tone",
      summary: "การจับคู่ฟอนต์เพื่อสร้างอารมณ์เฉพาะทางในการสื่อสาร",
      body: "ใช้ฟอนต์แบบไม่มีหัว (Sans-serif) สำหรับปุ่มและเมนู และฟอนต์มีหัว (Serif) สำหรับหัวข้อเรื่องสำคัญเพื่อความพรีเมียม",
      snippet: "<typography_mood>Use Sans-serif as main application UI font</typography_mood>",
      checklist: ["ระบุการนำเสนอประเภทฟอนต์", "กำหนดความสัมพันธ์ระหว่างหัวข้อและเนื้อหา"],
      antiPatterns: ["เลือกใช้ฟอนต์แฟนซีอ่านยากในเนื้อหาหลัก"]
    },
    {
      key: "illustration_style",
      th: "Illustration Style — รูปแบบภาพประกอบ",
      en: "Illustration Style",
      summary: "กำหนดทิศทางสไตล์ของภาพประกอบในหน้าจอเพื่อคุมโทนงานดีไซน์",
      body: "เน้นสไตล์แบบ 2D Flat Illustration ใช้สัดส่วนคนเป็นธรรมชาติ เลี่ยงภาพกราฟิกที่มีรายละเอียดแน่นเกินไป",
      snippet: "<illustration>2D Flat Design Illustration style</illustration>",
      checklist: ["ระบุแนวทางและมิติของภาพประกอบ"],
      antiPatterns: ["ปะปนภาพถ่ายจริงเข้ากับภาพการ์ตูนแบบตัดเส้นโดยไม่มีทิศทาง"]
    },
    {
      key: "brand_voice",
      th: "Brand Voice & Copywriting — น้ำเสียงการเขียนเนื้อหา",
      en: "Brand Voice",
      summary: "แนวทางการเขียนคำอธิบาย ปุ่ม ปุ่มกด และข้อความแจ้งเตือนต่างๆ ให้สอดคล้องกัน",
      body: "น้ำเสียงสุภาพ เป็นกันเอง มีความชัดเจนตรงไปตรงมา และมีคำสร้อยครับ/ค่ะ ที่เหมาะสม",
      snippet: "<brand_voice>Friendly, supportive, and direct tone</brand_voice>",
      checklist: ["กำหนดระดับความเป็นกันเองของการเลือกใช้คำ"],
      antiPatterns: ["ใช้ภาษาเขียนทางการเกินไปในส่วนแจ้งเตือนความผิดพลาด"]
    }
  ];
}

/* 2. VISUAL LANGUAGE */
function visualPillar(a: Analysis, input: GenerateInput): Draft[] {
  return [
    {
      key: "color_primary",
      th: "Primary & Accent Colors — สีหลักและสีเน้น",
      en: "Primary Colors",
      summary: "โทนสีหลักที่ระบุอัตลักษณ์เด่นชัดของระบบ รวมถึงสีรองและสีพื้นฐาน",
      body: "สีหลัก: #FF6B6B (Salmon Pink), สีเน้น: #4D96FF (Sky Blue)",
      snippet: "<colors_primary>Primary: #FF6B6B, Accent: #4D96FF</colors_primary>",
      checklist: ["ระบุรหัสสีแบบ Hex Code ชัดเจน"],
      antiPatterns: ["ไม่มีสีเน้นทำให้อัตลักษณ์หน้าจอจม"]
    },
    {
      key: "color_secondary",
      th: "Secondary & Neutral Colors — สีรองและสีกลาง",
      en: "Secondary & Neutral Colors",
      summary: "กำหนดกลุ่มสีกลางสำหรับพื้นหลัง ตัวอักษร และขอบต่าง ๆ ของหน้าแอป",
      body: "พื้นหลังเบา: #F9FAFB, สีขอบเทา: #E5E7EB, ตัวอักษรหลัก: #1F2937",
      snippet: "<colors_neutral>Background: #F9FAFB, Border: #E5E7EB, Text: #1F2937</colors_neutral>",
      checklist: ["มีสีเทาและสีพื้นหลังที่ชัดเจน"],
      antiPatterns: ["ใช้สีดาร์กโหมดปะปนกับไลท์โหมดโดยไม่มีสไตล์คุม"]
    },
    {
      key: "typography_tokens",
      th: "Typography Tokens — ขนาดและน้ำหนักฟอนต์",
      en: "Typography Tokens",
      summary: "ข้อกำหนดมาตราส่วนขนาดฟอนต์สำหรับการนำไปใช้งานในโค้ด",
      body: "หัวข้อหลัก: 24px/Bold, หัวข้อรอง: 18px/Semi-Bold, เนื้อหา: 14px/Regular, ตัวหนังสือเล็ก: 12px",
      snippet: "<typo_tokens>H1: 24px/700, Body: 14px/400</typo_tokens>",
      checklist: ["ระบุสเกลขนาดตัวอักษรครบถ้วน"],
      antiPatterns: ["ตั้งขนาดฟอนต์สะเปะสะปะตามความชอบรายหน้าจอ"]
    },
    {
      key: "spacing_scale",
      th: "Spacing Scale — มาตราส่วนระยะห่าง",
      en: "Spacing Scale",
      summary: "สเกลสำหรับระยะห่าง Margin และ Padding ที่ล้อไปกับสเกล 8px คีย์เวิร์ด",
      body: "กำหนดสเกลหลัก: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px",
      snippet: "<spacing>Base: 8px, Scale: 4px-8px-12px-16px-24px-32px</spacing>",
      checklist: ["ยึดตามหลักการ Spacing System เลขคู่"],
      antiPatterns: ["มีระยะห่าง 7px หรือ 11px ปะปนมาโดยไม่มีเหตุผล"]
    },
    {
      key: "grid_system",
      th: "Grid & Column Scales — ระบบกริดจัดหน้าแอป",
      en: "Grid System",
      summary: "ระบบกริดและเลย์เอาต์เพื่อการออกแบบหน้าจอที่ยืดหยุ่นตาม Responsive Grid",
      body: "จอ Desktop: 12 คอลัมน์ (Gutter: 24px), จอ Mobile: 4 คอลัมน์ (Gutter: 16px)",
      snippet: "<grids>Desktop: 12 columns, Mobile: 4 columns</grids>",
      checklist: ["ระบุจำนวนคอลัมน์ของหน้าจอแต่ละแบบ"],
      antiPatterns: ["ออกแบบ Layout แบบ Fix ขนาดกว้างตายตัว"]
    },
    {
      key: "effects_shadows",
      th: "Shadows, Borders & Elevations — เงา ขอบ และมิติ",
      en: "Shadows & Borders",
      summary: "มิติความลึก (Elevation) และเงาตกกระทบสำหรับกล่องข้อความและการ์ดต่าง ๆ",
      body: "กรอบมนการ์ด: 8px, เงาระดับต่ำ: 0 1px 3px rgba(0,0,0,0.1), เงาเด่น: 0 4px 6px rgba(0,0,0,0.1)",
      snippet: "<effects>Border Radius: 8px, Shadow-sm: 0 1px 2px rgba(0,0,0,0.05)</effects>",
      checklist: ["ระบุขนาด Border Radius", "ระบุรายละเอียดการใช้เงา"],
      antiPatterns: ["ใช้เงาที่ทึบและดำเกินไปจนทำให้งานดูไม่สะอาดตา"]
    }
  ];
}

/* 3. CORE LAYOUT & NAVIGATION */
function layoutPillar(a: Analysis, input: GenerateInput): Draft[] {
  return [
    {
      key: "nav_patterns",
      th: "Navigation Patterns — รูปแบบการนำทาง",
      en: "Navigation Patterns",
      summary: "การเลือกใช้ระบบโครงข่ายนำทาง เช่น Sidebar หรือ Top Navbar ให้เหมาะสมกับแอป",
      body: "ใช้ระบบ Left Sidebar สำหรับ Desktop และ Bottom Navigation Bar สำหรับการแสดงผลบนสมาร์ตโฟน",
      snippet: "<navigation>Desktop: Left Sidebar, Mobile: Bottom Nav</navigation>",
      checklist: ["กำหนดเมนูการนำทางหลักของระบบ"],
      antiPatterns: ["นำเมนูทั้งหมดไปซ่อนไว้ใน Hamburger Menu บนจอขนาดใหญ่"]
    },
    {
      key: "layout_desktop",
      th: "Desktop Dashboard Grid — การจัดหน้าจอคอมพิวเตอร์",
      en: "Desktop Layout Grid",
      summary: "การกำหนดโครงสร้างคอลัมน์และกริดสำหรับการจัดวางเนื้อหาบนหน้าจอ Desktop",
      body: "แบ่งหน้าจอออกเป็น 2 ส่วนหลัก: Sidebar ด้านซ้ายกว้าง 260px และพื้นที่ทำงานหลักด้านขวาที่ขยายตามความกว้างจอ",
      snippet: "<layout_desktop>Sidebar (260px) + Fluid Content Area</layout_desktop>",
      checklist: ["ระบุขนาดของ Sidebar ชัดเจน"],
      antiPatterns: ["ทำให้ Sidebar ยืดกว้างตามขนาดหน้าจอเกินความพอดี"]
    },
    {
      key: "layout_mobile",
      th: "Mobile Responsive Layout — โครงสร้างย่อสำหรับมือถือ",
      en: "Mobile Layout Grid",
      summary: "การย่อและเปลี่ยนโครงสร้างให้เหมาะสมกับการสัมผัสและสกรอลล์บนมือถือ",
      body: "สเกลหน้าจอแนวตั้งชิ้นเดียวเป็นหลัก ปุ่มกดทุกชิ้นกว้างไม่ต่ำกว่า 44px เพื่อความแม่นยำในการสัมผัสด้วยนิ้วมือ",
      snippet: "<layout_mobile>Single column vertical layout, min touch target 44px</layout_mobile>",
      checklist: ["ขนาดเป้าหมายการกดอย่างน้อย 44px"],
      antiPatterns: ["วางปุ่มขนาดเล็กชิดกันเกินไปทำให้ผู้ใช้กดพลาดบ่อย"]
    },
    {
      key: "layout_tablet",
      th: "Tablet POS Layout — โครงสำหรับแท็บเล็ตหน้าร้าน",
      en: "Tablet POS Layout",
      summary: "สำหรับโดเมนระบบหน้าร้าน ออกแบบโครงสร้าง Grid แบ่งสัดส่วนจอแท็บเล็ตเฉพาะงาน",
      body: "แบ่งจอเป็น 3:2 (พื้นที่เลือกสินค้าด้านซ้าย 60% และพื้นที่รายการสั่งซื้อและชำระเงินด้านขวา 40%)",
      snippet: "<layout_tablet>60/40 Split Screen for POS view</layout_tablet>",
      checklist: ["สัดส่วนหน้าจอด้านซ้ายและขวาชัดเจน"],
      antiPatterns: ["ใช้เลย์เอาต์เว็บแบบดั้งเดิมทำให้การคีย์ข้อมูลหน้าร้านล่าช้า"]
    },
    {
      key: "structure_headers",
      th: "Header & Footer Structure — การจัดวางส่วนหัวและส่วนท้าย",
      en: "Header & Footer Structure",
      summary: "การวางปุ่มตั้งค่า โปรไฟล์ และข้อมูลลิขสิทธิ์ความช่วยเหลือท้ายหน้าเว็บ",
      body: "ส่วนหัวแสดงชื่อระบบ พร้อมช่องค้นหาตรงกลาง และโปรไฟล์ผู้ใช้อยู่ทางขวา ส่วนท้ายมีลิงก์ช่วยเหลือด่วน",
      snippet: "<header_structure>Left: Brand Logo, Center: Search, Right: User Profile</header_structure>",
      checklist: ["มีโครงสร้าง Header จัดการองค์ประกอบหลักครบ"],
      antiPatterns: ["ใส่เครื่องมือกระจัดกระจายไม่เป็นระเบียบ"]
    },
    {
      key: "responsive_breakpoints",
      th: "Responsive Breakpoints Rules — จุดแบ่งหน้าจอ",
      en: "Responsive Breakpoints",
      summary: "กำหนดเงื่อนไขของขีดแบ่งความกว้างจอสำหรับแปลงเลย์เอาต์",
      body: "Mobile: < 640px, Tablet: 640px to 1024px, Desktop: > 1024px",
      snippet: "<breakpoints>Mobile: 640px, Tablet: 768px, Desktop: 1024px</breakpoints>",
      checklist: ["กำหนดขีดแบ่งตามมาตรฐานยอดนิยม"],
      antiPatterns: ["มีจุดแบ่งหน้าจอย่อยเกินความจำเป็นทำให้ควบคุมโค้ดยาก"]
    }
  ];
}

/* 4. UI COMPONENT SPECS */
function componentsPillar(a: Analysis, input: GenerateInput): Draft[] {
  return [
    {
      key: "comp_buttons",
      th: "Buttons Specs — ข้อกำหนดปุ่มกดต่าง ๆ",
      en: "Buttons Specs",
      summary: "ขนาด ความโค้ง และสีสันของปุ่มปฐมภูมิ (Primary) และปุ่มทุติยภูมิ (Secondary)",
      body: "Primary: พื้นสีหลัก ขอบมน 8px ตัวหนังสือสีขาว, Secondary: ขอบเส้นสีเทา พื้นหลังโปร่งใส",
      snippet: "<buttons>Primary: bg-primary rounded-lg text-white, Secondary: border border-gray</buttons>",
      checklist: ["มีสไตล์ปุ่มทั้ง 2 รูปแบบชัดเจน"],
      antiPatterns: ["ความมนของปุ่มในหน้าจอต่างกันโดยไม่คุมสไตล์"]
    },
    {
      key: "comp_inputs",
      th: "Text Inputs & Forms Specs — ข้อมูลช่องกรอกฟอร์ม",
      en: "Text Inputs & Forms Specs",
      summary: "ความสูง ระยะ Padding ข้างใน และสีของเส้นของช่องกรอกข้อมูลปกติและขณะติด Error",
      body: "ความสูง: 40px, Padding: ซ้าย-ขวา 12px, ขอบสีเทา #D1D5DB, เมื่อเกิด Error ขอบจะเปลี่ยนเป็นสีแดง #EF4444",
      snippet: "<inputs>Height: 40px, Normal border: #D1D5DB, Error border: #EF4444</inputs>",
      checklist: ["กำหนดความสูงของ Input", "มีตัวบ่งบอกข้อผิดพลาดชัดเจน"],
      antiPatterns: ["ไม่มีสระว่ายน้ำแสดงผลเมื่อเกิดข้อผิดพลาดในการกรอกข้อมูล"]
    },
    {
      key: "comp_cards",
      th: "Cards & Grid Items Specs — การ์ดข้อมูล",
      en: "Cards Specs",
      summary: "การออกแบบกรอบการ์ดแสดงสินค้าหรือหัวข้อรายงานต่าง ๆ",
      body: "สไตล์การ์ดขอบมน 12px พร้อมล้อมกรอบบาง 1px สองชั้น และใส่เงาเบาบาง",
      snippet: "<cards>Border-radius: 12px, Shadow-sm, Padding: 16px</cards>",
      checklist: ["ระบุระยะห่างภายในตัวการ์ด"],
      antiPatterns: ["ขอบการ์ดแข็งกระด้างไม่มีความโค้งทำให้การมองเห็นขัดตา"]
    },
    {
      key: "comp_modals",
      th: "Modals & Dialogs Specs — หน้าต่างป๊อปอัป",
      en: "Modals & Dialogs Specs",
      summary: "กำหนดทิศทางป๊อปอัปยืนยันการทำรายการต่าง ๆ ในระบบ",
      body: "ป๊อปอัปจะแสดงผลตรงกลางจอ พร้อมแผ่นหลังดำโปร่งแสง 50% (Backdrop) เพื่อขับความสนใจ",
      snippet: "<modals>Center aligned, Backdrop opacity 50%</modals>",
      checklist: ["มีวิธีการปิดป๊อปอัปเมื่อกดด้านนอกชัดเจน"],
      antiPatterns: ["ไม่มีปุ่มปิดที่เห็นชัดเจนบนป๊อปอัป"]
    },
    {
      key: "comp_menus",
      th: "Dropdowns & Context Menus Specs — เมนูเลือกเสริม",
      en: "Dropdowns Specs",
      summary: "ระบบป๊อปอัปชี้ทางเลือกย่อยเพื่อลดการรกของหน้าจอหลัก",
      body: "เมนูย่อยจะโผล่ด้านล่างปุ่มกด มีความกว้างอย่างน้อย 160px เพื่อป้องกันตัวอักษรตัดบรรทัดผิด",
      snippet: "<dropdowns>Min-width: 160px, Shadow-md</dropdowns>",
      checklist: ["กำหนดความกว้างขั้นต่ำ"],
      antiPatterns: ["ขอบเมนูตัดข้อความหายไปเพราะความกว้างไม่เพียงพอ"]
    },
    {
      key: "comp_states",
      th: "UI States (Hover/Active/Disabled) — สถานะการทำงาน",
      en: "UI States",
      summary: "การออกแบบการเปลี่ยนสีเมื่อเมาส์ไปวาง หรือปุ่มกดแบบที่ไม่สามารถใช้งานได้",
      body: "Hover: ปรับสีหลักให้เข้มขึ้น 10%, Disabled: ปรับความโปร่งใสลงเหลือ 50% และเปลี่ยนเคอร์เซอร์เป็นเครื่องหมายห้าม",
      snippet: "<states>Hover: brightness-90, Disabled: opacity-50 cursor-not-allowed</states>",
      checklist: ["มีคุณสมบัติที่เด่นชัดของสถานะ Disabled"],
      antiPatterns: ["ปุ่ม Disabled ยังดูสว่างสดใสจนชวนสับสน"]
    }
  ];
}

/* 5. UX & MICRO-INTERACTIONS */
function uxPillar(a: Analysis, input: GenerateInput): Draft[] {
  return [
    {
      key: "ux_validation",
      th: "Form Validation UX Flow — ลำดับการแจ้งตรวจฟอร์ม",
      en: "Form Validation Flow",
      summary: "การแจ้งเตือนรูปแบบข้อผิดพลาดเมื่อผู้ใช้งานป้อนฟิลด์ข้อมูลผิดพลาด",
      body: "ตรวจสอบและแสดงผลข้อผิดพลาดแบบ Real-time ใต้ช่องข้อความทันที โดยไม่ต้องรอให้ผู้ใช้งานกดปุ่มบันทึก",
      snippet: "<validation>Real-time validation inline below input fields</validation>",
      checklist: ["มีข้อความบอกชัดเจนว่าฟิลด์ใดที่ผิดพลาด"],
      antiPatterns: ["ใช้ Alert Pop-up แจ้งเตือนข้อผิดพลาดทีละช่องข้อความ"]
    },
    {
      key: "ux_loading",
      th: "Skeleton Loaders & Spinners — การดาวน์โหลดข้อมูล",
      en: "Skeleton Loaders",
      summary: "ภาพการเคลื่อนไหวเพื่อบอกใบ้ว่าระบบกำลังโหลดข้อมูล ช่วยลดอาการใจร้อนของผู้ใช้",
      body: "ใช้ Skeleton Screen รูปแบบโครงเปล่ากล่องข้อความสีเทาเคลื่อนไหวช้า ๆ แทนการใช้หัวหมุนแบบวงกลมแบบเดี่ยว",
      snippet: "<loading>Shimmer Skeleton Screen for data tables and card grids</loading>",
      checklist: ["สไตล์ของ Skeleton สอดรับกับเลย์เอาต์การ์ดตัวจริง"],
      antiPatterns: ["หน้าจอค้างนิ่งสนิทไม่มีสัญลักษณ์ตัวสแกนหรือสปินเนอร์บ่งบอก"]
    },
    {
      key: "ux_transitions",
      th: "Page Transitions & Animations — ลูกเล่นอนิเมชัน",
      en: "Transitions & Animations",
      summary: "ความรวดเร็วและลูกเล่นการเปลี่ยนหน้าจอเพื่อเพิ่มมิติความพรีเมียมให้ผู้ใช้งาน",
      body: "ความเร็วแอนิเมชันมาตรฐาน: 200ms, ฟังก์ชันความเร่ง: ease-in-out สำหรับไอคอนและปุ่มต่าง ๆ",
      snippet: "<animations>Transition duration: 200ms, timing function: ease-in-out</animations>",
      checklist: ["กำหนดความเร็วแอนิเมชันไม่ช้าเกินไปจนหน่วงระบบ"],
      antiPatterns: ["ใช้เอฟเฟกต์หมุนวนหรือกระเด้งแรง ๆ กับปุ่มปกติส่งผลกวนสายตา"]
    },
    {
      key: "ux_notifications",
      th: "Toast & Banner Alerts — แบนเนอร์ชี้แจงข่าวสาร",
      en: "Toast & Alerts",
      summary: "ข้อความแจ้งผลความสำเร็จ (Success) หรือข้อมูลแจ้งด่วนย่อยที่มุมหน้าต่างจอ",
      body: "ป้าย Toast แจ้งความสำเร็จจะปรากฏที่มุมบนขวา และจางหายไปเองโดยอัตโนมัติภายใน 3 วินาที",
      snippet: "<toasts>Success Toast: Top-right position, auto-hide in 3 seconds</toasts>",
      checklist: ["สีแยกตามประเภท (เขียว: สำเร็จ, แดง: แจ้งเตือน, เหลือง: ระวัง)"],
      antiPatterns: ["แจ้งเตือนการบันทึกสำเร็จด้วยป๊อปอัปบดบังหน้าจอหลักค้างยาว"]
    },
    {
      key: "ux_error_states",
      th: "Empty & Error Screens UX — หน้าข้อมูลว่าง",
      en: "Empty States",
      summary: "การดีไซน์หน้าที่ยังไม่มีข้อมูล หรือไม่มีผลการค้นหาให้ดูน่าใช้งานและมีทางไปต่อ",
      body: "แสดงภาพวาดภาพประกอบเรียบง่าย พร้อมคำเชิญชวนและปุ่มแอ็กชันเปิดช่องทางใหม่ (เช่น ปุ่ม 'เพิ่มชิ้นแรกเลย')",
      snippet: "<empty_states>Illustration + clear header + primary action button</empty_states>",
      checklist: ["มีปุ่มลัดให้ผู้ใช้สามารถเพิ่มข้อมูลชิ้นแรกได้ทันที"],
      antiPatterns: ["แสดงเฉพาะข้อความดิบสีแดง 'No Data Found' โล้น ๆ"]
    },
    {
      key: "ux_accessibility",
      th: "Accessibility & Contrast — มาตรฐานการใช้งานเข้าถึงง่าย",
      en: "Accessibility (A11y)",
      summary: "อัตราส่วนความต่างสีของตัวหนังสือและปุ่ม เพื่อความคมชัดสำหรับผู้บกพร่องทางสายตา",
      body: "อัตราส่วนความต่างสีของตัวหนังสือและพื้นหลังต้องผ่านเกณฑ์ WCAG 2.1 AA (อย่างน้อย 4.5:1)",
      snippet: "<a11y>Contrast ratio min 4.5:1 for body text, focus ring visible on tab</a11y>",
      checklist: ["มีขอบเน้นสำหรับผู้ใช้ที่กดปุ่ม Tab บนคีย์บอร์ด"],
      antiPatterns: ["ใช้ตัวหนังสือสีเทาอ่อนบนพื้นหลังขาวทำให้มองยาก"]
    }
  ];
}

/* ------------------------------------------------------------------ */
export function compileSections(a: Analysis, input: GenerateInput): CompiledSection[] {
  const groups: { key: string; drafts: Draft[] }[] = [
    { key: "brand", drafts: brandPillar(a, input) },
    { key: "visual", drafts: visualPillar(a, input) },
    { key: "layout", drafts: layoutPillar(a, input) },
    { key: "components", drafts: componentsPillar(a, input) },
    { key: "ux", drafts: uxPillar(a, input) },
  ];

  const out: CompiledSection[] = [];
  groups.forEach((group, gi) => {
    group.drafts.forEach((d, di) => {
      out.push({
        pillarKey: group.key,
        pillarLabel: pillarLabel(group.key),
        pillarOrder: gi + 1,
        sectionKey: d.key,
        sectionOrder: di + 1,
        titleTh: d.th,
        titleEn: d.en,
        summary: d.summary,
        body: d.body,
        promptSnippet: d.snippet,
        checklist: d.checklist,
        antiPatterns: d.antiPatterns,
        tokenEstimate: estTokens(d.body + d.snippet),
      });
    });
  });
  return out;
}
