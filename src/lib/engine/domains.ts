import type { Actor, DataSource, EntityDef, Kpi, RiskItem, ToolDef } from "@/lib/types";

export interface DomainPack {
  key: string;
  label: string;
  emoji: string;
  keywords: string[];
  titleTemplate: string;
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
  outOfScope: string[];
  unknowns: string[];
  stackHints: { layer: string; picks: { name: string; why: string }[] }[];
}

const commonNfr = [
  "ตอบสนอง (P95) ภายใน 400ms สำหรับ API หลัก และ First Contentful Paint < 1.8s บน 4G",
  "Uptime ≥ 99.5% ต่อเดือน พร้อม Health check + Auto restart",
  "Backup ฐานข้อมูลรายวัน เก็บย้อนหลัง 30 วัน และทดสอบ Restore อย่างน้อยไตรมาสละครั้ง",
  "รองรับภาษาไทยเต็มรูปแบบ (การเรียงลำดับ, วันที่ พ.ศ./ค.ศ., สกุลเงิน THB, ฟอนต์ที่อ่านง่าย)",
  "Audit log ทุกการกระทำที่กระทบเงินหรือข้อมูลส่วนบุคคล เก็บอย่างน้อย 1 ปี",
];

export const DOMAIN_PACKS: DomainPack[] = [
  {
    key: "pos_restaurant",
    label: "ระบบ POS / ร้านอาหารและเครื่องดื่ม",
    emoji: "🍜",
    keywords: [
      "pos", "ร้านอาหาร", "ขายหน้าร้าน", "คาเฟ่", "ร้านกาแฟ", "เมนู", "โต๊ะ", "ครัว", "restaurant",
      "cafe", "food", "เครื่องดื่ม", "บิล", "ใบเสร็จ", "ออเดอร์", "สั่งอาหาร", "แคชเชียร์", "ร้านชานม",
    ],
    titleTemplate: "ระบบ POS สำหรับร้านอาหาร",
    actors: [
      { name: "เจ้าของร้าน (Owner)", goal: "เห็นยอดขาย กำไรขั้นต้น และต้นทุนวัตถุดิบแบบเรียลไทม์บนมือถือ", pain: "ปิดร้านแล้วต้องนั่งนับเงินและจดสมุดเอง ไม่รู้ว่าเมนูไหนทำกำไรจริง" },
      { name: "แคชเชียร์ / พนักงานหน้าร้าน", goal: "กดขายจบบิลได้ใน 3 แตะ รับเงินสด/พร้อมเพย์/บัตร และพิมพ์ใบเสร็จ", pain: "ช่วงพีคคิวยาว กดผิดแล้วแก้ยาก ต้องเรียกเจ้าของมาปลดล็อก" },
      { name: "พนักงานเสิร์ฟ", goal: "รับออเดอร์ที่โต๊ะด้วยแท็บเล็ต ส่งเข้าครัวอัตโนมัติ แยกโต๊ะ/แยกบิลได้", pain: "จดกระดาษแล้วครัวอ่านไม่ออก ออเดอร์ตกหล่นช่วงลูกค้าเยอะ" },
      { name: "ครัว / บาร์ (KDS)", goal: "เห็นคิวออเดอร์เรียงตามเวลา กดเสร็จแล้วแจ้งหน้าร้านทันที", pain: "ไม่รู้ว่าออเดอร์ไหนมาก่อน ทำให้ลูกค้ารอนานและด่าหน้าร้าน" },
    ],
    entities: [
      { name: "Menu / MenuItem", fields: ["id", "ชื่อไทย-อังกฤษ", "หมวดหมู่", "ราคา", "ต้นทุน", "ตัวเลือก/ท็อปปิ้ง", "สถานะของหมด", "รูป"] },
      { name: "Order", fields: ["id", "เลขบิล", "โต๊ะ/ช่องทาง (ทานที่ร้าน/กลับบ้าน/เดลิเวอรี)", "รายการ", "ส่วนลด", "VAT", "สถานะ", "พนักงาน", "เวลา"] },
      { name: "Payment", fields: ["id", "orderId", "วิธีจ่าย (เงินสด/พร้อมเพย์/บัตร/วอลเล็ต)", "จำนวน", "เงินทอน", "อ้างอิงสลิป", "สถานะ"] },
      { name: "Table / Zone", fields: ["id", "ชื่อโต๊ะ", "โซน", "จำนวนที่นั่ง", "สถานะ (ว่าง/มีลูกค้า/รอเก็บ)"] },
      { name: "Ingredient & Recipe (BOM)", fields: ["id", "ชื่อวัตถุดิบ", "หน่วย", "สต๊อกคงเหลือ", "จุดสั่งซื้อ", "สูตรต่อเมนู"] },
      { name: "Shift & CashDrawer", fields: ["id", "พนักงาน", "เงินตั้งต้น", "ยอดขายรวม", "ยอดนับจริง", "ผลต่าง", "เวลาเปิด-ปิดรอบ"] },
    ],
    jobs: [
      "เปิดรอบขาย (Open shift) พร้อมนับเงินตั้งต้นในลิ้นชัก",
      "รับออเดอร์แบบเร็ว: ค้นเมนู → เลือกตัวเลือก → ระบุโต๊ะ → ส่งครัว",
      "แยกบิล / รวมบิล / ย้ายโต๊ะ / ยกเลิกรายการโดยต้องมี PIN ผู้จัดการ",
      "ชำระเงินหลายช่องทางในบิลเดียว (Split payment) และออกใบเสร็จ/ใบกำกับภาษีอย่างย่อ",
      "ตัดสต๊อกวัตถุดิบอัตโนมัติตามสูตร (BOM) เมื่อบิลถูกชำระ",
      "ปิดรอบขาย: สรุปยอดตามวิธีจ่าย, เงินขาด/เกิน, ยอดยกเลิก",
      "รายงานผู้บริหาร: ยอดขายรายวัน/ชั่วโมง, เมนูขายดี, กำไรขั้นต้นต่อเมนู, Peak hour",
      "โหมดออฟไลน์: ขายต่อได้เมื่อเน็ตหลุด แล้วซิงก์กลับเมื่อออนไลน์",
    ],
    kpis: [
      { name: "เวลาปิดการขายต่อบิล", target: "≤ 45 วินาทีในชั่วโมงเร่งด่วน" },
      { name: "ความแม่นยำของสต๊อกวัตถุดิบ", target: "ผลต่างจากการนับจริง ≤ 3%" },
      { name: "เงินขาด/เกินต่อรอบ", target: "≤ 20 บาทต่อรอบขาย" },
      { name: "Order error rate", target: "≤ 1% ของบิลทั้งหมด" },
    ],
    compliance: [
      "ใบกำกับภาษีอย่างย่อตามข้อกำหนดกรมสรรพากร (เลขประจำตัวผู้เสียภาษี, VAT 7%, เลขที่ใบเสร็จเรียงต่อเนื่อง)",
      "PDPA: เก็บเบอร์โทร/ชื่อลูกค้าสมาชิกเท่าที่จำเป็น พร้อมฐานการประมวลผลและสิทธิขอลบ",
      "มาตรฐาน PCI-DSS หากรับบัตรเครดิต — ห้ามเก็บเลขบัตรเต็มในระบบเอง ให้ใช้ Payment gateway/EDC",
    ],
    integrations: ["PromptPay QR (Dynamic QR)", "เครื่องพิมพ์ใบเสร็จ ESC/POS ผ่าน USB/LAN/Bluetooth", "ลิ้นชักเก็บเงิน (Cash drawer kick)", "LINE Notify แจ้งยอดปิดรอบ", "แพลตฟอร์มเดลิเวอรี (Grab/LINE MAN/Shopee Food)", "โปรแกรมบัญชี (PEAK/FlowAccount)"],
    risks: [
      { risk: "เน็ตร้านหลุดช่วงพีค ทำให้ขายไม่ได้", mitigation: "Offline-first ด้วย local queue + IndexedDB แล้ว sync แบบ idempotent ด้วย client-generated order id" },
      { risk: "พนักงานยกเลิกบิลเพื่อยักยอกเงิน", mitigation: "บังคับ PIN ผู้จัดการ + บันทึกเหตุผลการยกเลิก + รายงาน void สรุปรายวัน" },
      { risk: "สต๊อกเพี้ยนเพราะสูตรไม่ตรงความจริง", mitigation: "ให้ปรับ yield/waste factor ต่อเมนู และมีรอบนับสต๊อก (stock count) รายสัปดาห์" },
    ],
    nonFunctional: [
      "ใช้งานได้บนแท็บเล็ต Android/iPad ราคาประหยัด หน้าจอ 10 นิ้ว แตะด้วยนิ้วโป้งได้ ปุ่มขนาด ≥ 44px",
      ...commonNfr,
    ],
    glossary: [
      { term: "KDS", meaning: "Kitchen Display System จอแสดงคิวออเดอร์ในครัว" },
      { term: "BOM", meaning: "Bill of Materials สูตรวัตถุดิบต่อ 1 เมนู ใช้ตัดสต๊อก" },
      { term: "Void / Refund", meaning: "การยกเลิกรายการก่อนชำระ vs. การคืนเงินหลังชำระ" },
      { term: "Shift / รอบขาย", meaning: "ช่วงเวลาที่ผูกกับพนักงานและลิ้นชักเงินหนึ่งใบ" },
    ],
    dataSources: [
      { name: "ตารางเมนูและราคา (Postgres)", type: "structured", refresh: "ทันทีเมื่อแก้ไข", priority: 1 },
      { name: "ประวัติการขายย้อนหลัง 90 วัน", type: "analytics", refresh: "รายชั่วโมง", priority: 2 },
      { name: "สต๊อกวัตถุดิบและใบสั่งซื้อ", type: "structured", refresh: "เรียลไทม์เมื่อปิดบิล", priority: 2 },
      { name: "คู่มือ SOP หน้าร้าน / นโยบายส่วนลด", type: "document", refresh: "รายเดือน", priority: 3 },
    ],
    tools: [
      { name: "search_menu", purpose: "ค้นเมนูตามชื่อ/หมวด/แท็ก", input: "{ query: string, limit?: number }", output: "MenuItem[]", danger: "low" },
      { name: "create_order", purpose: "สร้างออเดอร์ใหม่พร้อมรายการ", input: "{ tableId, items[], channel, idempotencyKey }", output: "{ orderId, total }", danger: "medium" },
      { name: "capture_payment", purpose: "บันทึกการชำระเงินและปิดบิล", input: "{ orderId, method, amount, idempotencyKey }", output: "{ receiptNo, change }", danger: "high" },
      { name: "void_order_item", purpose: "ยกเลิกรายการในบิล (ต้องมี PIN)", input: "{ orderId, itemId, reason, managerPin }", output: "{ ok, auditId }", danger: "high" },
      { name: "get_sales_report", purpose: "ดึงรายงานยอดขายตามช่วงเวลา", input: "{ from, to, groupBy }", output: "SalesReport", danger: "low" },
    ],
    outOfScope: ["ระบบบัญชีคู่ (Double-entry) เต็มรูปแบบ", "ระบบเงินเดือนพนักงาน", "แอปสั่งอาหารของลูกค้าปลายทาง (Phase 2)"],
    unknowns: [
      "ร้านมีกี่สาขา และต้องรวมรายงานข้ามสาขาหรือไม่",
      "จดทะเบียน VAT หรือไม่ (มีผลกับการออกใบกำกับภาษีและการคำนวณราคา)",
      "ต้องเชื่อมแพลตฟอร์มเดลิเวอรีเจ้าไหนบ้าง และรับออเดอร์อย่างไร",
      "อุปกรณ์ที่มีอยู่แล้ว (แท็บเล็ต/เครื่องพิมพ์/ลิ้นชัก) รุ่นอะไร",
    ],
    stackHints: [
      { layer: "Hardware / Edge", picks: [{ name: "Android tablet + ESC/POS thermal printer (LAN)", why: "ต้นทุนต่ำ หาอะไหล่ง่ายในไทย และพิมพ์ผ่าน network ได้เสถียรกว่า Bluetooth" }] },
      { layer: "Payments", picks: [{ name: "PromptPay Dynamic QR + EDC ของธนาคาร", why: "ค่าธรรมเนียมต่ำสุดสำหรับร้านเล็ก และไม่ต้องเก็บข้อมูลบัตรเอง" }] },
    ],
  },
  {
    key: "ecommerce",
    label: "อีคอมเมิร์ซ / ร้านค้าออนไลน์",
    emoji: "🛒",
    keywords: ["ขายของออนไลน์", "อีคอมเมิร์ซ", "ecommerce", "ร้านค้าออนไลน์", "ตะกร้า", "shopee", "lazada", "เว็บขายของ", "dropship", "สินค้า", "shop"],
    titleTemplate: "ระบบร้านค้าออนไลน์",
    actors: [
      { name: "ลูกค้า (Shopper)", goal: "ค้นเจอสินค้าเร็ว จ่ายเงินง่าย ติดตามพัสดุได้", pain: "ขั้นตอนเช็คเอาต์ยาว ค่าส่งไม่ชัด และไม่รู้ว่าของถึงไหน" },
      { name: "แอดมินร้าน", goal: "จัดการสต๊อก ออเดอร์ และแพ็กของได้ในที่เดียว", pain: "ต้องสลับหลายแพลตฟอร์ม สต๊อกไม่ตรงจนขายเกิน (oversell)" },
      { name: "ฝ่ายการตลาด", goal: "สร้างโค้ดส่วนลด แคมเปญ และดูอัตราแปลง", pain: "ไม่มีข้อมูล funnel ว่าลูกค้าหลุดตรงไหน" },
      { name: "ฝ่ายคลัง/แพ็ก", goal: "พิมพ์ใบปะหน้าและอัปเดตเลขพัสดุเป็นชุด", pain: "คีย์เลขพัสดุมือทำให้ผิดพลาดและลูกค้าโวย" },
    ],
    entities: [
      { name: "Product / Variant", fields: ["sku", "ชื่อ", "ราคา", "ราคาโปร", "ตัวเลือก (สี/ไซซ์)", "น้ำหนัก", "สต๊อก", "รูป"] },
      { name: "Cart & Checkout", fields: ["id", "รายการ", "ที่อยู่จัดส่ง", "วิธีส่ง", "ค่าส่ง", "โค้ดส่วนลด", "ยอดสุทธิ"] },
      { name: "Order & Fulfillment", fields: ["เลขออเดอร์", "สถานะ", "ผู้ขนส่ง", "tracking", "สลิป", "การคืนสินค้า"] },
      { name: "Customer", fields: ["id", "ชื่อ", "เบอร์", "อีเมล", "ที่อยู่หลายรายการ", "แต้มสะสม"] },
      { name: "Promotion", fields: ["code", "ประเภท", "เงื่อนไขขั้นต่ำ", "วันเริ่ม-สิ้นสุด", "จำนวนสิทธิ์"] },
    ],
    jobs: [
      "ค้นหา/กรองสินค้า พร้อม facet และการค้นหาภาษาไทยที่ตัดคำถูกต้อง",
      "ตะกร้า + เช็คเอาต์แบบหน้าเดียว รองรับ Guest checkout",
      "คำนวณค่าส่งตามน้ำหนัก/โซน และโปรส่งฟรีเมื่อครบยอด",
      "ชำระเงิน: PromptPay QR, บัตร, เก็บปลายทาง (COD) พร้อม webhook ยืนยัน",
      "จัดการออเดอร์: ยืนยัน → แพ็ก → ออกเลขพัสดุ → แจ้งลูกค้าอัตโนมัติ",
      "จัดการสต๊อกแบบ reserve ตอนกดสั่ง เพื่อกันขายเกิน",
      "รายงาน: ยอดขาย, AOV, อัตราแปลง, สินค้าขายดี, ตะกร้าที่ถูกทิ้ง",
    ],
    kpis: [
      { name: "Conversion rate", target: "≥ 2.5% ของผู้เข้าชม" },
      { name: "Cart abandonment", target: "≤ 65% และมีอีเมล/LINE ตามกลับ" },
      { name: "Oversell incidents", target: "0 ครั้งต่อเดือน" },
      { name: "เวลาโหลดหน้า PDP", target: "LCP ≤ 2.5s บน 4G" },
    ],
    compliance: [
      "PDPA: ขอความยินยอมคุกกี้/การตลาด แยกจากการใช้บริการ",
      "พ.ร.บ. ขายตรงและตลาดแบบตรง: แสดงราคาชัดเจน เงื่อนไขคืนสินค้า และช่องทางติดต่อ",
      "PCI-DSS: ใช้ hosted payment page ของ gateway ไม่เก็บเลขบัตรเอง",
    ],
    integrations: ["Omise / 2C2P / Stripe", "PromptPay", "Thailand Post / Flash / Kerry API", "LINE Official Account", "Facebook/Google Pixel & GA4"],
    risks: [
      { risk: "ขายเกินสต๊อก (oversell) ตอนแคมเปญ", mitigation: "Reserve stock ด้วย row-level lock + TTL และปล่อยคืนเมื่อจ่ายไม่สำเร็จใน 15 นาที" },
      { risk: "Webhook การจ่ายเงินซ้ำ/หาย", mitigation: "Idempotency key + reconciliation job ทุก 10 นาที" },
      { risk: "โค้ดส่วนลดถูกนำไปใช้ผิดเงื่อนไข", mitigation: "ตรวจเงื่อนไขฝั่งเซิร์ฟเวอร์เท่านั้น + จำกัดสิทธิ์ต่อผู้ใช้" },
    ],
    nonFunctional: commonNfr,
    glossary: [
      { term: "AOV", meaning: "Average Order Value มูลค่าเฉลี่ยต่อออเดอร์" },
      { term: "PDP", meaning: "Product Detail Page หน้ารายละเอียดสินค้า" },
      { term: "COD", meaning: "Cash on Delivery เก็บเงินปลายทาง" },
    ],
    dataSources: [
      { name: "แคตตาล็อกสินค้าและสต๊อก", type: "structured", refresh: "เรียลไทม์", priority: 1 },
      { name: "นโยบายคืนสินค้า/ค่าส่ง", type: "document", refresh: "รายเดือน", priority: 2 },
      { name: "พฤติกรรมผู้ใช้ (GA4/events)", type: "analytics", refresh: "รายวัน", priority: 3 },
    ],
    tools: [
      { name: "search_products", purpose: "ค้นสินค้าพร้อม filter", input: "{ q, category?, priceRange? }", output: "Product[]", danger: "low" },
      { name: "check_stock", purpose: "ตรวจสต๊อกคงเหลือแบบเรียลไทม์", input: "{ sku[] }", output: "{ sku, available }[]", danger: "low" },
      { name: "create_checkout", purpose: "สร้างรายการชำระเงิน", input: "{ cartId, shipping, paymentMethod }", output: "{ checkoutUrl }", danger: "high" },
      { name: "track_shipment", purpose: "ติดตามพัสดุ", input: "{ trackingNo }", output: "TrackingEvent[]", danger: "low" },
    ],
    outOfScope: ["ระบบ Marketplace หลายผู้ขาย", "ระบบคลังอัตโนมัติ (WMS) เต็มรูปแบบ"],
    unknowns: ["ขายกี่ SKU และมี variant ซับซ้อนแค่ไหน", "ต้อง sync กับ Shopee/Lazada หรือไม่", "รับ COD หรือไม่"],
    stackHints: [{ layer: "Search", picks: [{ name: "Postgres full-text + pg_trgm หรือ Typesense", why: "รองรับการค้นหาภาษาไทยแบบ fuzzy โดยไม่ต้องจ่ายค่า SaaS แพง" }] }],
  },
  {
    key: "clinic",
    label: "สุขภาพ / คลินิก / โรงพยาบาล",
    emoji: "🩺",
    keywords: ["คลินิก", "โรงพยาบาล", "คนไข้", "ผู้ป่วย", "นัดหมายหมอ", "เวชระเบียน", "hospital", "clinic", "patient", "ทันตกรรม", "สุขภาพ", "ยา"],
    titleTemplate: "ระบบบริหารคลินิก",
    actors: [
      { name: "ผู้ป่วย", goal: "จองคิวออนไลน์ ดูประวัติการรักษาและใบนัด", pain: "โทรจองยาก รอคิวนาน ไม่รู้ว่าต้องเตรียมอะไร" },
      { name: "แพทย์", goal: "เปิดเวชระเบียนได้เร็ว บันทึก SOAP note และสั่งยาแบบมีคำเตือน", pain: "พิมพ์ข้อมูลซ้ำซ้อน ทำให้เวลาตรวจต่อคนหายไป" },
      { name: "พยาบาล/เคาน์เตอร์", goal: "ลงทะเบียน คัดกรอง วัดสัญญาณชีพ และจัดคิว", pain: "ข้อมูลกระจายหลายสมุด ค้นประวัติเก่าไม่เจอ" },
      { name: "เภสัชกร", goal: "จ่ายยาตามใบสั่ง ตรวจ interaction และตัดสต๊อกยา", pain: "ลายมือหมออ่านยาก เสี่ยงจ่ายยาผิด" },
    ],
    entities: [
      { name: "Patient (HN)", fields: ["HN", "ชื่อ-สกุล", "เลขบัตรประชาชน", "วันเกิด", "แพ้ยา", "โรคประจำตัว", "สิทธิการรักษา"] },
      { name: "Visit / Encounter", fields: ["id", "HN", "วันที่", "สัญญาณชีพ", "อาการสำคัญ", "SOAP note", "การวินิจฉัย (ICD-10)"] },
      { name: "Prescription", fields: ["id", "visitId", "ยา", "ขนาด", "วิธีใช้", "จำนวน", "ผู้สั่ง"] },
      { name: "Appointment", fields: ["id", "HN", "แพทย์", "ช่วงเวลา", "สถานะ", "การแจ้งเตือน"] },
      { name: "Billing", fields: ["id", "visitId", "ค่าบริการ", "ค่ายา", "สิทธิ/ประกัน", "ยอดที่ผู้ป่วยจ่าย"] },
    ],
    jobs: [
      "ลงทะเบียนผู้ป่วยใหม่และค้นหาด้วย HN/เบอร์/บัตรประชาชน",
      "จองและจัดคิวนัดหมายพร้อมแจ้งเตือนล่วงหน้าทาง SMS/LINE",
      "บันทึกการตรวจแบบ SOAP + วินิจฉัย ICD-10 + สั่งยา",
      "ตรวจสอบการแพ้ยาและ drug interaction ก่อนยืนยันใบสั่งยา",
      "ออกใบเสร็จ/ใบรับรองแพทย์ และสรุปค่ารักษาตามสิทธิ",
      "รายงาน: จำนวนผู้ป่วยต่อวัน, รายได้ต่อหัตถการ, อัตราการนัดผิดนัด (no-show)",
    ],
    kpis: [
      { name: "เวลารอคิวเฉลี่ย", target: "≤ 20 นาที" },
      { name: "No-show rate", target: "≤ 10% หลังเปิดระบบเตือน" },
      { name: "ความถูกต้องของใบสั่งยา", target: "ข้อผิดพลาด 0 ครั้ง/เดือน" },
    ],
    compliance: [
      "PDPA + ข้อมูลอ่อนไหว (Sensitive data) ตามมาตรา 26 ต้องมีความยินยอมชัดแจ้งและเข้ารหัสขณะพัก (at rest)",
      "พ.ร.บ. สุขภาพแห่งชาติ มาตรา 7: ห้ามเปิดเผยข้อมูลสุขภาพส่วนบุคคล",
      "การเก็บเวชระเบียนอย่างน้อย 5 ปีตามข้อกำหนดสถานพยาบาล",
    ],
    integrations: ["LINE Notify / SMS gateway สำหรับเตือนนัด", "เครื่องอ่านบัตรประชาชน (Smart card reader)", "ระบบเบิกจ่าย สปสช./ประกันสังคม (ถ้ามี)", "Lab interface (HL7/FHIR)"],
    risks: [
      { risk: "ข้อมูลสุขภาพรั่วไหล", mitigation: "RBAC ระดับฟิลด์ + encryption at rest + audit log ทุกการเปิดดูเวชระเบียน" },
      { risk: "AI ให้คำแนะนำทางการแพทย์เกินขอบเขต", mitigation: "จำกัดบทบาทเป็นผู้ช่วยงานเอกสารเท่านั้น มี disclaimer และบังคับให้แพทย์ยืนยันทุกครั้ง" },
    ],
    nonFunctional: commonNfr,
    glossary: [
      { term: "HN", meaning: "Hospital Number เลขประจำตัวผู้ป่วย" },
      { term: "SOAP", meaning: "Subjective, Objective, Assessment, Plan รูปแบบบันทึกการตรวจ" },
      { term: "ICD-10", meaning: "รหัสมาตรฐานการวินิจฉัยโรค" },
    ],
    dataSources: [
      { name: "เวชระเบียนอิเล็กทรอนิกส์ (EMR)", type: "structured/sensitive", refresh: "เรียลไทม์", priority: 1 },
      { name: "บัญชียาและ interaction database", type: "reference", refresh: "รายไตรมาส", priority: 1 },
      { name: "ตารางเวรแพทย์", type: "structured", refresh: "รายสัปดาห์", priority: 2 },
    ],
    tools: [
      { name: "find_patient", purpose: "ค้นผู้ป่วยด้วย HN/ชื่อ/เบอร์", input: "{ query }", output: "PatientSummary[]", danger: "medium" },
      { name: "book_appointment", purpose: "จองคิวตรวจ", input: "{ hn, doctorId, slot }", output: "{ appointmentId }", danger: "medium" },
      { name: "check_drug_interaction", purpose: "ตรวจปฏิกิริยาระหว่างยาและการแพ้", input: "{ hn, drugCodes[] }", output: "Warning[]", danger: "high" },
    ],
    outOfScope: ["การวินิจฉัยโรคโดย AI", "ระบบ PACS/ภาพถ่ายรังสี", "การเบิกจ่ายประกันอัตโนมัติเต็มรูปแบบ"],
    unknowns: ["เป็นคลินิกเฉพาะทางด้านใด", "ต้องเชื่อมสิทธิ สปสช./ประกันสังคมหรือไม่", "มีเภสัชกรประจำหรือไม่"],
    stackHints: [{ layer: "Security", picks: [{ name: "Row-Level Security + pgcrypto", why: "จำกัดการเข้าถึงเวชระเบียนตามบทบาทและเข้ารหัสฟิลด์อ่อนไหว" }] }],
  },
  {
    key: "education",
    label: "การศึกษา / LMS / คอร์สออนไลน์",
    emoji: "🎓",
    keywords: ["โรงเรียน", "นักเรียน", "คอร์ส", "เรียนออนไลน์", "lms", "ติวเตอร์", "การบ้าน", "เกรด", "student", "course", "สอน", "ห้องเรียน", "มหาวิทยาลัย"],
    titleTemplate: "ระบบจัดการการเรียนรู้",
    actors: [
      { name: "ผู้เรียน", goal: "ดูบทเรียน ทำแบบฝึกหัด และเห็นความคืบหน้าของตัวเอง", pain: "ไม่รู้ว่าต้องเรียนอะไรต่อ และไม่ได้ feedback ทันที" },
      { name: "ผู้สอน", goal: "สร้างบทเรียน มอบหมายงาน และตรวจงานได้เร็ว", pain: "ตรวจงานซ้ำๆ กินเวลา และติดตามคนที่ตกหล่นไม่ทัน" },
      { name: "ผู้ปกครอง", goal: "เห็นผลการเรียนและการเข้าเรียนของบุตรหลาน", pain: "รู้ปัญหาช้าเกินไปเมื่อเกรดออกแล้ว" },
      { name: "ผู้ดูแลระบบ/ฝ่ายวิชาการ", goal: "จัดตารางเรียน ห้อง และรายงานภาพรวม", pain: "ข้อมูลอยู่ใน Excel หลายไฟล์" },
    ],
    entities: [
      { name: "Course & Lesson", fields: ["id", "ชื่อ", "คำอธิบาย", "หน่วยกิต", "โครงสร้างบท", "สื่อการสอน"] },
      { name: "Enrollment", fields: ["studentId", "courseId", "สถานะ", "วันลงทะเบียน", "ความคืบหน้า %"] },
      { name: "Assignment & Submission", fields: ["id", "กำหนดส่ง", "เกณฑ์ให้คะแนน (rubric)", "ไฟล์ส่ง", "คะแนน", "feedback"] },
      { name: "Attendance", fields: ["id", "วันที่", "สถานะ (มา/สาย/ลา/ขาด)", "หมายเหตุ"] },
    ],
    jobs: [
      "สร้างคอร์สและอัปโหลดสื่อการสอน (วิดีโอ/PDF/แบบทดสอบ)",
      "ลงทะเบียนเรียนและติดตามความคืบหน้ารายคน",
      "มอบหมายงานพร้อม rubric และตรวจงานด้วยผู้ช่วย AI (แต่ครูอนุมัติคะแนนสุดท้าย)",
      "แบบทดสอบอัตโนมัติพร้อมคลังข้อสอบและสุ่มข้อ",
      "รายงานความเสี่ยงตกหล่น (early warning) จากการเข้าเรียน + คะแนน",
    ],
    kpis: [
      { name: "อัตราเรียนจบคอร์ส", target: "≥ 70%" },
      { name: "เวลาตรวจงานเฉลี่ยต่อชิ้น", target: "ลดลง 50% เทียบก่อนใช้ระบบ" },
      { name: "นักเรียนกลุ่มเสี่ยงที่ถูกช่วยทัน", target: "≥ 80% ถูกติดตามภายใน 7 วัน" },
    ],
    compliance: ["PDPA กับข้อมูลผู้เยาว์ ต้องได้รับความยินยอมจากผู้ปกครอง", "นโยบายการใช้ AI ในการประเมินผล ต้องเปิดเผยและมีมนุษย์ตัดสินขั้นสุดท้าย"],
    integrations: ["Google Classroom / Workspace", "YouTube หรือ Vimeo แบบ unlisted", "LINE OA แจ้งผู้ปกครอง", "Zoom / Google Meet"],
    risks: [
      { risk: "AI ให้คะแนนไม่ยุติธรรม/มีอคติ", mitigation: "ใช้ rubric ที่ชัดเจน, แสดงเหตุผลประกอบคะแนน และบังคับ human review ก่อนเผยแพร่" },
      { risk: "ผู้เรียนใช้ AI ทำการบ้านแทน", mitigation: "ออกแบบงานเชิงกระบวนการ + ให้ส่งร่างระหว่างทาง + ตรวจสอบความคล้าย" },
    ],
    nonFunctional: commonNfr,
    glossary: [
      { term: "Rubric", meaning: "เกณฑ์ให้คะแนนแบบมีมิติชัดเจน" },
      { term: "SCORM/xAPI", meaning: "มาตรฐานแลกเปลี่ยนข้อมูลบทเรียนอิเล็กทรอนิกส์" },
    ],
    dataSources: [
      { name: "คลังบทเรียนและสื่อการสอน", type: "document", refresh: "รายภาคเรียน", priority: 1 },
      { name: "ผลคะแนนและการเข้าเรียน", type: "structured", refresh: "รายวัน", priority: 1 },
      { name: "หลักสูตรแกนกลาง/มาตรฐานตัวชี้วัด", type: "reference", refresh: "รายปี", priority: 2 },
    ],
    tools: [
      { name: "get_student_progress", purpose: "ดึงความคืบหน้าผู้เรียน", input: "{ studentId, courseId }", output: "ProgressReport", danger: "low" },
      { name: "grade_submission", purpose: "ให้คะแนนร่างตาม rubric", input: "{ submissionId, rubricId }", output: "{ score, rationale }", danger: "high" },
      { name: "generate_quiz", purpose: "สร้างข้อสอบจากบทเรียน", input: "{ lessonId, count, difficulty }", output: "Question[]", danger: "medium" },
    ],
    outOfScope: ["ระบบการเงิน/ค่าเทอมเต็มรูปแบบ", "การออกใบ ปพ. อย่างเป็นทางการ"],
    unknowns: ["ระดับชั้น/กลุ่มผู้เรียนคือใคร", "จำนวนผู้เรียนพร้อมกันสูงสุด", "ต้องออกใบประกาศนียบัตรหรือไม่"],
    stackHints: [{ layer: "Media", picks: [{ name: "Mux หรือ Cloudflare Stream", why: "สตรีมวิดีโอแบบ adaptive bitrate ประหยัดกว่าโฮสต์เอง" }] }],
  },
  {
    key: "logistics",
    label: "โลจิสติกส์ / คลังสินค้า / เดลิเวอรี",
    emoji: "🚚",
    keywords: ["ขนส่ง", "เดลิเวอรี", "คลังสินค้า", "สต๊อก", "โลจิสติกส์", "จัดส่ง", "พัสดุ", "delivery", "warehouse", "inventory", "รถ", "คนขับ", "เส้นทาง"],
    titleTemplate: "ระบบบริหารงานขนส่งและคลังสินค้า",
    actors: [
      { name: "ผู้จัดการคลัง", goal: "รู้ของคงเหลือแม่นยำและจัดสรรงานให้ทีมแพ็ก", pain: "ของหายไม่รู้ตัว นับสต๊อกทั้งคลังใช้เวลาหลายวัน" },
      { name: "พนักงานขับรถ", goal: "รับงาน ดูเส้นทาง และยืนยันการส่งพร้อมถ่ายรูป", pain: "โทรถามที่อยู่ตลอดทาง เสียเวลาและน้ำมัน" },
      { name: "ลูกค้าผู้รับ", goal: "รู้เวลาส่งโดยประมาณและติดตามสถานะ", pain: "รอทั้งวันไม่รู้ว่าของจะมาตอนไหน" },
      { name: "ฝ่ายวางแผน", goal: "จัดเส้นทางให้ประหยัดที่สุดตามข้อจำกัดรถและเวลา", pain: "จัดเส้นทางด้วยมือ ไม่ optimal และเปลี่ยนแผนกลางวันไม่ได้" },
    ],
    entities: [
      { name: "Shipment / Job", fields: ["id", "ต้นทาง", "ปลายทาง", "น้ำหนัก/ปริมาตร", "ช่วงเวลารับ-ส่ง", "สถานะ", "หลักฐานการส่ง (POD)"] },
      { name: "Vehicle & Driver", fields: ["id", "ทะเบียน", "ความจุ", "คนขับ", "สถานะ", "ตำแหน่งล่าสุด"] },
      { name: "Inventory / Bin", fields: ["sku", "ตำแหน่งจัดเก็บ", "จำนวน", "lot/expiry", "จำนวนที่จอง"] },
      { name: "Route Plan", fields: ["id", "วันที่", "ลำดับจุดส่ง", "ระยะทางรวม", "เวลาประมาณการ"] },
    ],
    jobs: [
      "รับงานขนส่งเข้าระบบจากหลายช่องทาง (ไฟล์/API/หน้าเว็บ)",
      "จัดเส้นทางอัตโนมัติตามข้อจำกัด (capacity, time window, โซน)",
      "แอปคนขับ: รับงาน → นำทาง → ถ่ายรูป POD → ปิดงาน",
      "ติดตามสถานะแบบเรียลไทม์และแจ้งเตือนเมื่อล่าช้า",
      "รับเข้า-เบิกออกคลัง พร้อมสแกนบาร์โค้ดและนับสต๊อกแบบ cycle count",
    ],
    kpis: [
      { name: "On-time delivery", target: "≥ 95%" },
      { name: "ต้นทุนต่อจุดส่ง", target: "ลดลง 15% ใน 3 เดือน" },
      { name: "ความแม่นยำสต๊อก", target: "≥ 99%" },
    ],
    compliance: ["กฎหมายชั่วโมงขับขี่และความปลอดภัย", "PDPA สำหรับตำแหน่ง GPS ของพนักงาน ต้องแจ้งวัตถุประสงค์และจำกัดเวลาเก็บ"],
    integrations: ["Google Maps Directions / Distance Matrix", "GPS tracker บนรถ", "API ผู้ให้บริการขนส่ง", "เครื่องสแกนบาร์โค้ด/RFID"],
    risks: [
      { risk: "แผนเส้นทางไม่สอดคล้องกับสภาพจราจรจริง", mitigation: "Re-optimize ระหว่างวันและให้คนขับแจ้ง exception ได้ทันที" },
      { risk: "POD ปลอมหรือไม่ครบ", mitigation: "บังคับถ่ายรูป + GPS stamp + ลายเซ็นผู้รับ และตรวจสอบ geofence" },
    ],
    nonFunctional: commonNfr,
    glossary: [
      { term: "POD", meaning: "Proof of Delivery หลักฐานการส่งมอบ" },
      { term: "Time window", meaning: "ช่วงเวลาที่ลูกค้ารับของได้" },
      { term: "Cycle count", meaning: "การนับสต๊อกบางส่วนหมุนเวียนแทนการปิดคลังนับทั้งหมด" },
    ],
    dataSources: [
      { name: "รายการงานขนส่งประจำวัน", type: "structured", refresh: "เรียลไทม์", priority: 1 },
      { name: "ตำแหน่งรถและสถานะคนขับ", type: "stream", refresh: "ทุก 30 วินาที", priority: 1 },
      { name: "ข้อมูลจราจรและระยะทาง", type: "external api", refresh: "ตามคำขอ", priority: 2 },
    ],
    tools: [
      { name: "optimize_route", purpose: "จัดลำดับจุดส่งให้ประหยัดที่สุด", input: "{ jobs[], vehicles[], constraints }", output: "RoutePlan", danger: "medium" },
      { name: "update_job_status", purpose: "อัปเดตสถานะงาน", input: "{ jobId, status, proof }", output: "{ ok }", danger: "medium" },
      { name: "lookup_inventory", purpose: "ตรวจของคงเหลือตามตำแหน่ง", input: "{ sku, warehouseId }", output: "StockLevel", danger: "low" },
    ],
    outOfScope: ["ระบบซ่อมบำรุงยานพาหนะ", "การคำนวณภาษีศุลกากรข้ามประเทศ"],
    unknowns: ["จำนวนรถและจุดส่งต่อวัน", "ต้องรองรับ COD หรือไม่", "มีคลังกี่แห่ง"],
    stackHints: [{ layer: "Geo", picks: [{ name: "PostGIS + Google Maps API", why: "คำนวณระยะทาง geofence และค้นหาเชิงพื้นที่ได้ในฐานข้อมูลเดียว" }] }],
  },
  {
    key: "fintech",
    label: "การเงิน / บัญชี / สินเชื่อ",
    emoji: "💳",
    keywords: ["บัญชี", "การเงิน", "สินเชื่อ", "เงินกู้", "งบการเงิน", "ใบแจ้งหนี้", "invoice", "ภาษี", "fintech", "กระเป๋าเงิน", "wallet", "ลงทุน", "หุ้น"],
    titleTemplate: "ระบบบริหารการเงิน",
    actors: [
      { name: "เจ้าของธุรกิจ", goal: "เห็นกระแสเงินสด กำไรขาดทุน และหนี้ค้างรับแบบเรียลไทม์", pain: "รู้ตัวเลขช้าเป็นเดือน ตัดสินใจไม่ทัน" },
      { name: "นักบัญชี", goal: "ลงบัญชีถูกหมวด กระทบยอดธนาคาร และปิดงบได้เร็ว", pain: "คีย์เอกสารมือจำนวนมากและกระทบยอดไม่ตรง" },
      { name: "ผู้อนุมัติ (Approver)", goal: "อนุมัติรายจ่าย/สินเชื่อตามวงเงินและนโยบาย", pain: "เอกสารกระจัดกระจาย ตรวจสอบย้อนหลังยาก" },
    ],
    entities: [
      { name: "Account & Ledger", fields: ["รหัสบัญชี", "ชื่อ", "ประเภท", "ยอดยกมา", "รายการเดบิต/เครดิต"] },
      { name: "Invoice / Bill", fields: ["เลขที่", "คู่ค้า", "วันครบกำหนด", "ยอดก่อน VAT", "VAT", "หัก ณ ที่จ่าย", "สถานะ"] },
      { name: "Transaction", fields: ["id", "วันที่", "ช่องทาง", "จำนวน", "หมวดหมู่", "หลักฐานแนบ", "สถานะกระทบยอด"] },
      { name: "Approval Workflow", fields: ["id", "ประเภท", "วงเงิน", "ลำดับผู้อนุมัติ", "สถานะ", "เหตุผล"] },
    ],
    jobs: [
      "บันทึกรายรับ-รายจ่ายพร้อมแนบหลักฐานและอ่านข้อมูลจากใบเสร็จ (OCR)",
      "ออกใบแจ้งหนี้/ใบเสร็จ/ใบกำกับภาษี พร้อมคำนวณ VAT และหัก ณ ที่จ่าย",
      "กระทบยอดธนาคาร (Bank reconciliation) แบบกึ่งอัตโนมัติ",
      "เวิร์กโฟลว์อนุมัติหลายลำดับตามวงเงิน",
      "รายงาน: กระแสเงินสด, งบกำไรขาดทุน, อายุลูกหนี้ (AR aging)",
    ],
    kpis: [
      { name: "เวลาปิดงบรายเดือน", target: "≤ 5 วันทำการ" },
      { name: "อัตราการกระทบยอดอัตโนมัติ", target: "≥ 85% ของรายการ" },
      { name: "ความคลาดเคลื่อนของตัวเลข", target: "0 บาท (ต้องกระทบยอดได้เสมอ)" },
    ],
    compliance: [
      "ประมวลรัษฎากร: รูปแบบใบกำกับภาษี, การหักภาษี ณ ที่จ่าย, การเก็บเอกสาร 5 ปี",
      "PDPA และการเข้ารหัสข้อมูลทางการเงิน",
      "หลักการแบ่งแยกหน้าที่ (Segregation of Duties) — ผู้บันทึกต้องไม่ใช่ผู้อนุมัติ",
    ],
    integrations: ["Bank statement API / ไฟล์ OFX-CSV", "PromptPay / payment gateway", "e-Tax Invoice by Email", "โปรแกรมบัญชีปลายทาง (PEAK/FlowAccount/Express)"],
    risks: [
      { risk: "AI คำนวณตัวเลขผิดแล้วผู้ใช้เชื่อ", mitigation: "ห้ามให้ LLM คำนวณเอง — ต้องเรียก tool คำนวณที่ deterministic และแสดงสูตรกำกับเสมอ" },
      { risk: "รายการซ้ำจากการนำเข้าไฟล์หลายครั้ง", mitigation: "Deduplicate ด้วย hash ของ (วันที่+จำนวน+อ้างอิง) และ dry-run ก่อน import จริง" },
    ],
    nonFunctional: commonNfr,
    glossary: [
      { term: "AR aging", meaning: "รายงานอายุหนี้ค้างรับแยกตามช่วงวัน" },
      { term: "WHT", meaning: "Withholding Tax ภาษีหัก ณ ที่จ่าย" },
      { term: "Reconciliation", meaning: "การกระทบยอดระหว่างบัญชีกับรายการธนาคารจริง" },
    ],
    dataSources: [
      { name: "สมุดบัญชีและผังบัญชี", type: "structured", refresh: "เรียลไทม์", priority: 1 },
      { name: "รายการเดินบัญชีธนาคาร", type: "external", refresh: "รายวัน", priority: 1 },
      { name: "กฎหมายภาษีและอัตราปัจจุบัน", type: "reference", refresh: "รายปี", priority: 2 },
    ],
    tools: [
      { name: "calculate_tax", purpose: "คำนวณ VAT/WHT แบบ deterministic", input: "{ amount, taxType, rate }", output: "{ net, tax, total }", danger: "medium" },
      { name: "post_journal_entry", purpose: "ลงรายการบัญชี", input: "{ entries[], date, ref, idempotencyKey }", output: "{ journalId }", danger: "high" },
      { name: "reconcile_bank", purpose: "จับคู่รายการธนาคารกับบัญชี", input: "{ statementId }", output: "MatchResult[]", danger: "medium" },
    ],
    outOfScope: ["การให้คำแนะนำการลงทุน", "การยื่นภาษีอัตโนมัติแทนผู้ใช้"],
    unknowns: ["จดทะเบียน VAT หรือไม่", "ใช้เกณฑ์เงินสดหรือเกณฑ์คงค้าง", "ต้องส่งข้อมูลต่อให้โปรแกรมบัญชีตัวไหน"],
    stackHints: [{ layer: "Numeric", picks: [{ name: "Postgres NUMERIC(18,4) + decimal.js", why: "หลีกเลี่ยงความคลาดเคลื่อนของ floating point ในงานเงิน" }] }],
  },
  {
    key: "booking",
    label: "จองคิว / นัดหมาย / ที่พัก",
    emoji: "📅",
    keywords: ["จองคิว", "นัดหมาย", "จองห้อง", "โรงแรม", "สปา", "ร้านตัดผม", "booking", "reservation", "ตารางเวลา", "ที่พัก", "สนาม", "เช่า"],
    titleTemplate: "ระบบจองและนัดหมายออนไลน์",
    actors: [
      { name: "ลูกค้า", goal: "เห็นเวลาว่างจริงและจองจบใน 1 นาที", pain: "ทักแชทถามเวลาว่างแล้วรอตอบนาน" },
      { name: "พนักงานให้บริการ", goal: "เห็นตารางงานของตัวเองและไม่โดนจองชนกัน", pain: "ตารางเปลี่ยนบ่อยจนสับสน" },
      { name: "เจ้าของกิจการ", goal: "เพิ่มอัตราการใช้ทรัพยากรและลดการยกเลิกนาทีสุดท้าย", pain: "มีช่วงเวลาว่างเสียเปล่าและ no-show" },
    ],
    entities: [
      { name: "Resource", fields: ["id", "ชื่อ (ห้อง/ช่าง/สนาม)", "ความจุ", "เวลาให้บริการ", "วันหยุด"] },
      { name: "Service", fields: ["id", "ชื่อ", "ระยะเวลา", "ราคา", "buffer ก่อน/หลัง"] },
      { name: "Booking", fields: ["id", "ลูกค้า", "ทรัพยากร", "ช่วงเวลา", "สถานะ", "มัดจำ", "ที่มา (walk-in/online)"] },
    ],
    jobs: [
      "แสดงช่วงเวลาว่างจริงตามระยะเวลาบริการและ buffer",
      "จอง/เลื่อน/ยกเลิกพร้อมกฎการคืนเงินและมัดจำ",
      "กันการจองชนกันด้วย transaction lock ระดับทรัพยากร",
      "แจ้งเตือนอัตโนมัติล่วงหน้า 24 ชม. และ 2 ชม.",
      "รายงานอัตราการใช้ทรัพยากร (utilization) และ no-show",
    ],
    kpis: [
      { name: "Utilization rate", target: "≥ 70% ของเวลาให้บริการ" },
      { name: "No-show", target: "≤ 8%" },
      { name: "Double booking", target: "0 ครั้ง" },
    ],
    compliance: ["PDPA สำหรับข้อมูลติดต่อลูกค้า", "เงื่อนไขการยกเลิก/คืนเงินต้องแสดงก่อนยืนยันการจ่าย"],
    integrations: ["Google Calendar sync", "LINE OA / SMS reminder", "PromptPay สำหรับมัดจำ"],
    risks: [
      { risk: "จองชนกันเมื่อคนกดพร้อมกัน", mitigation: "ใช้ DB unique constraint บนช่วงเวลา (exclusion constraint) แทนการเช็คในโค้ด" },
      { risk: "โซนเวลา/DST คำนวณผิด", mitigation: "เก็บเวลาเป็น UTC เสมอ และแปลงเป็น Asia/Bangkok ที่ชั้นแสดงผล" },
    ],
    nonFunctional: commonNfr,
    glossary: [
      { term: "Buffer time", meaning: "เวลาพักระหว่างคิวเพื่อเตรียมงาน" },
      { term: "Utilization", meaning: "สัดส่วนเวลาที่ถูกจองต่อเวลาที่เปิดให้บริการ" },
    ],
    dataSources: [
      { name: "ตารางเวลาว่างของทรัพยากร", type: "structured", refresh: "เรียลไทม์", priority: 1 },
      { name: "นโยบายการยกเลิก/คืนเงิน", type: "document", refresh: "รายไตรมาส", priority: 2 },
    ],
    tools: [
      { name: "get_availability", purpose: "ค้นช่วงเวลาว่าง", input: "{ serviceId, dateRange, resourceId? }", output: "Slot[]", danger: "low" },
      { name: "create_booking", purpose: "สร้างการจอง", input: "{ slot, customer, idempotencyKey }", output: "{ bookingId }", danger: "high" },
      { name: "cancel_booking", purpose: "ยกเลิกพร้อมคำนวณค่าปรับ", input: "{ bookingId, reason }", output: "{ refundAmount }", danger: "high" },
    ],
    outOfScope: ["ระบบ Channel manager เชื่อม OTA ทุกเจ้า", "ระบบสมาชิก/แต้มสะสมขั้นสูง"],
    unknowns: ["มีทรัพยากร/พนักงานให้บริการกี่คน", "ต้องเก็บมัดจำหรือไม่", "รองรับการจองข้ามวันหรือไม่"],
    stackHints: [{ layer: "Scheduling", picks: [{ name: "Postgres tstzrange + EXCLUDE constraint", why: "ป้องกันการจองซ้อนที่ระดับฐานข้อมูล แน่นอนกว่าเช็คในแอป" }] }],
  },
  {
    key: "chatbot",
    label: "แชทบอท / ผู้ช่วย AI / ศูนย์บริการลูกค้า",
    emoji: "🤖",
    keywords: ["แชทบอท", "chatbot", "ผู้ช่วย", "ai agent", "ตอบลูกค้า", "คอลเซ็นเตอร์", "support", "rag", "ถามตอบ", "line bot", "assistant"],
    titleTemplate: "ระบบผู้ช่วย AI สำหรับบริการลูกค้า",
    actors: [
      { name: "ลูกค้าผู้ถาม", goal: "ได้คำตอบถูกต้องทันที ไม่ต้องรอคิวแอดมิน", pain: "บอทตอบไม่ตรงคำถามและวนลูป" },
      { name: "แอดมิน/เจ้าหน้าที่", goal: "รับช่วงต่อจากบอทได้ทันทีพร้อมบริบทครบ", pain: "ต้องอ่านย้อนแชทยาวก่อนตอบ" },
      { name: "หัวหน้าทีมบริการ", goal: "วัดคุณภาพคำตอบและอัตราการปิดเคสอัตโนมัติ", pain: "ไม่มีข้อมูลว่าบอทตอบผิดตรงไหน" },
    ],
    entities: [
      { name: "Conversation", fields: ["id", "ช่องทาง", "ผู้ใช้", "สถานะ", "sentiment", "handoff flag"] },
      { name: "Message", fields: ["id", "บทบาท", "เนื้อหา", "tool calls", "citations", "latency", "token"] },
      { name: "KnowledgeChunk", fields: ["id", "แหล่งที่มา", "หัวข้อ", "เนื้อหา", "embedding", "วันที่อัปเดต"] },
      { name: "Escalation Ticket", fields: ["id", "conversationId", "เหตุผล", "ผู้รับผิดชอบ", "SLA"] },
    ],
    jobs: [
      "ตอบคำถามจากฐานความรู้พร้อมอ้างอิงแหล่งที่มา (RAG + citation)",
      "ตรวจจับเจตนาและส่งต่อให้มนุษย์เมื่อความมั่นใจต่ำหรือเป็นเรื่องอ่อนไหว",
      "เรียกใช้เครื่องมือ (เช็คสถานะออเดอร์/ยอดเงิน) แทนการเดา",
      "สรุปบทสนทนาให้เจ้าหน้าที่เมื่อ handoff",
      "แดชบอร์ดคุณภาพ: deflection rate, CSAT, hallucination report",
    ],
    kpis: [
      { name: "Auto-resolution (deflection)", target: "≥ 60% ของเคสทั้งหมด" },
      { name: "Groundedness (มีการอ้างอิง)", target: "≥ 95% ของคำตอบเชิงข้อเท็จจริง" },
      { name: "เวลาตอบเฉลี่ยครั้งแรก", target: "≤ 3 วินาที" },
    ],
    compliance: ["ต้องเปิดเผยว่าผู้ใช้กำลังคุยกับ AI", "PDPA: ไม่เก็บข้อมูลอ่อนไหวในบันทึกแชทโดยไม่จำเป็น และมี retention policy", "ห้ามให้คำแนะนำทางกฎหมาย/การแพทย์/การลงทุนเกินขอบเขต"],
    integrations: ["LINE Messaging API", "Facebook Messenger", "ระบบ Ticket (Freshdesk/Zendesk)", "Vector database (pgvector)"],
    risks: [
      { risk: "Hallucination ตอบข้อมูลที่ไม่มีในฐานความรู้", mitigation: "บังคับ 'ตอบจาก context เท่านั้น' + ตรวจ citation ก่อนส่ง + ถ้าไม่มีข้อมูลให้ตอบว่าไม่ทราบและ escalate" },
      { risk: "Prompt injection จากเนื้อหาที่ดึงมา", mitigation: "แยก system/context ด้วย delimiter, treat retrieved text as data-not-instructions, sanitize และมี allowlist ของ tool" },
    ],
    nonFunctional: commonNfr,
    glossary: [
      { term: "RAG", meaning: "Retrieval-Augmented Generation การดึงข้อมูลจริงมาประกอบคำตอบ" },
      { term: "Deflection rate", meaning: "สัดส่วนเคสที่บอทปิดได้เองโดยไม่ต้องใช้คน" },
      { term: "Groundedness", meaning: "ระดับที่คำตอบอ้างอิงกับเอกสารจริง" },
    ],
    dataSources: [
      { name: "ฐานความรู้/FAQ ภายใน (pgvector)", type: "vector", refresh: "รายสัปดาห์", priority: 1 },
      { name: "ข้อมูลธุรกรรมของผู้ใช้ผ่าน API", type: "live api", refresh: "ตามคำขอ", priority: 1 },
      { name: "ประวัติการสนทนาย้อนหลัง", type: "memory", refresh: "เรียลไทม์", priority: 2 },
    ],
    tools: [
      { name: "search_knowledge", purpose: "ค้นฐานความรู้แบบ hybrid (BM25 + vector)", input: "{ query, topK }", output: "Chunk[] with score & source", danger: "low" },
      { name: "lookup_order", purpose: "ตรวจสถานะคำสั่งซื้อของผู้ใช้", input: "{ userId, orderNo }", output: "OrderStatus", danger: "medium" },
      { name: "escalate_to_human", purpose: "ส่งต่อเจ้าหน้าที่พร้อมสรุป", input: "{ conversationId, reason, summary }", output: "{ ticketId }", danger: "medium" },
    ],
    outOfScope: ["การตอบเชิงกฎหมายที่มีผลผูกพัน", "การทำธุรกรรมเงินโดยไม่ยืนยันตัวตน"],
    unknowns: ["ช่องทางหลักคือ LINE หรือเว็บ", "ฐานความรู้อยู่ในรูปแบบใดและใหญ่แค่ไหน", "ต้องรองรับกี่ภาษา"],
    stackHints: [{ layer: "AI", picks: [{ name: "pgvector + hybrid search + reranker", why: "ใช้ Postgres เดิมเก็บ embedding ได้ ลดจำนวนระบบที่ต้องดูแล" }] }],
  },
  {
    key: "hr",
    label: "ทรัพยากรบุคคล / บริหารพนักงาน",
    emoji: "🧑‍💼",
    keywords: ["พนักงาน", "hr", "เงินเดือน", "payroll", "ลางาน", "ลงเวลา", "สรรหา", "recruit", "ประเมินผล", "กะ", "โอที", "บุคคล"],
    titleTemplate: "ระบบบริหารทรัพยากรบุคคล",
    actors: [
      { name: "พนักงาน", goal: "ลงเวลา ขอลา และดูสลิปเงินเดือนบนมือถือ", pain: "ต้องกรอกใบลากระดาษและตามหาหัวหน้าเซ็น" },
      { name: "หัวหน้างาน", goal: "อนุมัติลา/โอที และดูกำลังคนในทีม", pain: "ไม่รู้ว่าใครลาซ้อนกันจนงานขาดคน" },
      { name: "ฝ่ายบุคคล", goal: "คำนวณเงินเดือน ประกันสังคม ภาษี และออกรายงาน", pain: "ทำ Excel หลายไฟล์ ผิดพลาดง่ายและเสี่ยงข้อมูลรั่ว" },
    ],
    entities: [
      { name: "Employee", fields: ["รหัส", "ชื่อ", "ตำแหน่ง", "แผนก", "วันเริ่มงาน", "ฐานเงินเดือน", "บัญชีธนาคาร"] },
      { name: "TimeAttendance", fields: ["id", "วันที่", "เวลาเข้า-ออก", "สถานที่ (GPS)", "กะ", "โอที"] },
      { name: "LeaveRequest", fields: ["id", "ประเภทลา", "ช่วงวัน", "เหตุผล", "ผู้อนุมัติ", "สถานะ", "โควตาคงเหลือ"] },
      { name: "Payroll Run", fields: ["งวด", "รายการรายได้/หัก", "ประกันสังคม", "ภาษี", "ยอดสุทธิ", "สถานะจ่าย"] },
    ],
    jobs: [
      "ลงเวลาเข้า-ออกด้วย GPS/QR พร้อมกันการโกงเวลา",
      "ยื่นและอนุมัติใบลาตามลำดับสายบังคับบัญชาและโควตา",
      "คำนวณเงินเดือน โอที ประกันสังคม และภาษีหัก ณ ที่จ่าย",
      "ออกสลิปเงินเดือนอิเล็กทรอนิกส์แบบมีการเข้ารหัส",
      "รายงาน: อัตราการลา, OT, turnover, headcount ต่อแผนก",
    ],
    kpis: [
      { name: "ความถูกต้องของการคำนวณเงินเดือน", target: "100% (0 ข้อผิดพลาด)" },
      { name: "เวลาปิดรอบเงินเดือน", target: "≤ 1 วันทำการ" },
      { name: "อัตราการใช้ระบบผ่านมือถือ", target: "≥ 90% ของพนักงาน" },
    ],
    compliance: [
      "พ.ร.บ. คุ้มครองแรงงาน: ชั่วโมงทำงาน วันลา และการคำนวณ OT",
      "PDPA: ข้อมูลพนักงานเป็นข้อมูลส่วนบุคคล ต้องจำกัดสิทธิ์เข้าถึงตามบทบาท",
      "ประกันสังคมและภาษีตามอัตราปีปัจจุบัน",
    ],
    integrations: ["เครื่องสแกนนิ้ว/ใบหน้า", "ธนาคารสำหรับโอนเงินเดือน (text file/API)", "LINE OA แจ้งเตือนอนุมัติ"],
    risks: [
      { risk: "ข้อมูลเงินเดือนรั่วภายในองค์กร", mitigation: "RBAC เข้มงวด + field-level masking + audit log ทุกการเปิดดู" },
      { risk: "กฎหมายแรงงาน/อัตราภาษีเปลี่ยน", mitigation: "แยกอัตราเป็น configuration table มีวันที่มีผลบังคับใช้ ไม่ hardcode" },
    ],
    nonFunctional: commonNfr,
    glossary: [
      { term: "SSO (ประกันสังคม)", meaning: "เงินสมทบประกันสังคมที่ต้องหักและนำส่ง" },
      { term: "Turnover", meaning: "อัตราการลาออกของพนักงาน" },
    ],
    dataSources: [
      { name: "ทะเบียนพนักงานและโครงสร้างองค์กร", type: "structured", refresh: "เรียลไทม์", priority: 1 },
      { name: "ตารางกะและวันหยุดประจำปี", type: "structured", refresh: "รายปี", priority: 2 },
      { name: "ระเบียบบริษัทและกฎหมายแรงงาน", type: "document", refresh: "รายปี", priority: 2 },
    ],
    tools: [
      { name: "get_leave_balance", purpose: "ดูโควตาวันลาคงเหลือ", input: "{ employeeId, leaveType, year }", output: "{ used, remaining }", danger: "low" },
      { name: "submit_leave", purpose: "ยื่นใบลา", input: "{ employeeId, type, from, to, reason }", output: "{ requestId }", danger: "medium" },
      { name: "run_payroll", purpose: "ประมวลผลเงินเดือนงวดหนึ่ง (dry-run ได้)", input: "{ period, dryRun }", output: "PayrollSummary", danger: "high" },
    ],
    outOfScope: ["ระบบสรรหาแบบ ATS เต็มรูปแบบ", "การให้คำปรึกษาด้านกฎหมายแรงงาน"],
    unknowns: ["จำนวนพนักงานและมีกะทำงานหรือไม่", "จ่ายเงินเดือนกี่งวดต่อเดือน", "มีสวัสดิการพิเศษอะไรที่ต้องคำนวณ"],
    stackHints: [{ layer: "Compliance", picks: [{ name: "Effective-dated configuration tables", why: "รองรับการเปลี่ยนอัตราภาษี/ประกันสังคมโดยไม่ต้องแก้โค้ด" }] }],
  },
];

export const GENERIC_PACK: DomainPack = {
  key: "generic",
  label: "ระบบธุรกิจทั่วไป (Custom Software)",
  emoji: "🧩",
  keywords: [],
  titleTemplate: "ระบบซอฟต์แวร์ตามความต้องการ",
  actors: [
    { name: "ผู้ใช้งานหลัก (End user)", goal: "ทำงานประจำวันให้เสร็จเร็วขึ้นและผิดพลาดน้อยลง", pain: "ยังทำงานด้วย Excel/กระดาษ ข้อมูลกระจัดกระจาย" },
    { name: "ผู้ดูแลระบบ (Admin)", goal: "ตั้งค่า จัดการผู้ใช้ และดูแลข้อมูลหลัก", pain: "ต้องพึ่งโปรแกรมเมอร์ทุกครั้งที่จะเปลี่ยนค่า" },
    { name: "ผู้บริหาร (Stakeholder)", goal: "เห็นภาพรวมและตัวเลขสำคัญเพื่อการตัดสินใจ", pain: "รายงานล่าช้าและไม่น่าเชื่อถือ" },
  ],
  entities: [
    { name: "User & Role", fields: ["id", "ชื่อ", "อีเมล", "บทบาท", "สถานะ", "เข้าใช้ล่าสุด"] },
    { name: "Core Record", fields: ["id", "รหัสอ้างอิง", "ชื่อ", "สถานะ", "เจ้าของ", "วันที่สร้าง/แก้ไข"] },
    { name: "Activity Log", fields: ["id", "ผู้กระทำ", "การกระทำ", "ข้อมูลก่อน-หลัง", "เวลา"] },
    { name: "Setting", fields: ["key", "value", "scope", "วันที่มีผล"] },
  ],
  jobs: [
    "เข้าสู่ระบบและกำหนดสิทธิ์ตามบทบาท (RBAC)",
    "สร้าง/แก้ไข/ค้นหา/ลบข้อมูลหลักพร้อมการตรวจสอบความถูกต้อง",
    "เวิร์กโฟลว์อนุมัติและการเปลี่ยนสถานะที่ตรวจสอบย้อนหลังได้",
    "แดชบอร์ดสรุปตัวเลขสำคัญและ export CSV/Excel",
    "แจ้งเตือนเหตุการณ์สำคัญผ่านอีเมล/LINE",
  ],
  kpis: [
    { name: "เวลาที่ใช้ต่อกระบวนการหลัก", target: "ลดลง ≥ 40% เทียบวิธีเดิม" },
    { name: "อัตราการใช้งานจริง (adoption)", target: "≥ 80% ของผู้ใช้เป้าหมายภายใน 1 เดือน" },
    { name: "ข้อผิดพลาดของข้อมูล", target: "≤ 1% ของรายการ" },
  ],
  compliance: ["PDPA: แจ้งวัตถุประสงค์การเก็บข้อมูล ขอความยินยอม และรองรับสิทธิเจ้าของข้อมูล", "การเก็บ audit log สำหรับข้อมูลสำคัญ"],
  integrations: ["Email (Resend/SMTP)", "LINE Notify", "Google Sheets export", "Single Sign-On (Google/Microsoft)"],
  risks: [
    { risk: "ขอบเขตงานบานปลาย (Scope creep)", mitigation: "ตรึง MVP ด้วย acceptance criteria และจัดฟีเจอร์ที่เหลือเป็น backlog พร้อม RICE score" },
    { risk: "ผู้ใช้ไม่ยอมเปลี่ยนจากวิธีเดิม", mitigation: "ออกแบบ onboarding + นำเข้าข้อมูลเดิม + ทำ pilot กับผู้ใช้ตัวจริง 1-2 สัปดาห์" },
  ],
  nonFunctional: commonNfr,
  glossary: [
    { term: "RBAC", meaning: "Role-Based Access Control การจำกัดสิทธิ์ตามบทบาท" },
    { term: "MVP", meaning: "Minimum Viable Product เวอร์ชันเล็กที่สุดที่ใช้งานได้จริง" },
  ],
  dataSources: [
    { name: "ฐานข้อมูลหลักของระบบ", type: "structured", refresh: "เรียลไทม์", priority: 1 },
    { name: "เอกสารกระบวนการทำงาน (SOP)", type: "document", refresh: "รายไตรมาส", priority: 2 },
    { name: "ไฟล์ข้อมูลเดิม (Excel/CSV)", type: "import", refresh: "ครั้งเดียวตอน migrate", priority: 3 },
  ],
  tools: [
    { name: "search_records", purpose: "ค้นข้อมูลหลักตามเงื่อนไข", input: "{ query, filters }", output: "Record[]", danger: "low" },
    { name: "create_record", purpose: "สร้างข้อมูลใหม่", input: "{ payload, idempotencyKey }", output: "{ id }", danger: "medium" },
    { name: "export_report", purpose: "สร้างรายงานตามช่วงเวลา", input: "{ type, from, to, format }", output: "{ fileUrl }", danger: "low" },
  ],
  outOfScope: ["ฟีเจอร์ที่ยังไม่ผ่านการยืนยันความต้องการ", "การย้ายระบบเดิมทั้งหมดในเฟสแรก"],
  unknowns: ["ใครคือผู้ใช้จริงและมีกี่คน", "กระบวนการทำงานปัจจุบันเป็นอย่างไร", "มีระบบเดิมที่ต้องเชื่อมต่อหรือไม่", "งบประมาณและกรอบเวลาที่ต้องการ"],
  stackHints: [{ layer: "Foundation", picks: [{ name: "Next.js (App Router) + PostgreSQL + Drizzle ORM", why: "ทีมเล็กดูแลได้คนเดียว deploy ง่าย และขยายเป็น multi-tenant ได้ภายหลัง" }] }],
};

export function detectDomain(text: string): { pack: DomainPack; confidence: number; matched: string[] } {
  const lower = text.toLowerCase();
  let best: { pack: DomainPack; score: number; matched: string[] } = { pack: GENERIC_PACK, score: 0, matched: [] };

  for (const pack of DOMAIN_PACKS) {
    const matched = pack.keywords.filter((k) => lower.includes(k.toLowerCase()));
    const score = matched.reduce((acc, k) => acc + (k.length > 5 ? 2 : 1), 0);
    if (score > best.score) best = { pack, score, matched };
  }

  if (best.score === 0) return { pack: GENERIC_PACK, confidence: 0.42, matched: [] };
  const confidence = Math.min(0.98, 0.55 + best.score * 0.08);
  return { pack: best.pack, confidence, matched: best.matched };
}
