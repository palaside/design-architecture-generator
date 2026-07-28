"use client";

import React, { useState, useMemo } from "react";
import type { CompiledSection } from "@/lib/types";

interface WireframeCanvasProps {
  sections: CompiledSection[];
}

interface CanvasItem {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const ELEMENT_TYPES = [
  // Top featured from image
  { type: "attachment", label: "Attachment", defaultWidth: 150, defaultHeight: 45, icon: "📎" },
  { type: "bubble", label: "Bubble", defaultWidth: 120, defaultHeight: 50, icon: "💬" },
  { type: "marker", label: "Marker", defaultWidth: 100, defaultHeight: 35, icon: "📍" },
  { type: "message", label: "Message", defaultWidth: 200, defaultHeight: 60, icon: "✉️" },
  { type: "message_scroller", label: "Message Scroller", defaultWidth: 220, defaultHeight: 180, icon: "📜" },
  { type: "toast", label: "Toast Alert", defaultWidth: 180, defaultHeight: 50, icon: "🔔" },

  // All Components (Alphabetical)
  { type: "accordion", label: "Accordion", defaultWidth: 200, defaultHeight: 100, icon: "📂" },
  { type: "alert", label: "Alert", defaultWidth: 220, defaultHeight: 65, icon: "⚠️" },
  { type: "alert_dialog", label: "Alert Dialog", defaultWidth: 260, defaultHeight: 140, icon: "🚨" },
  { type: "aspect_ratio", label: "Aspect Ratio Frame", defaultWidth: 160, defaultHeight: 100, icon: "🖼️" },
  { type: "avatar", label: "Avatar Group", defaultWidth: 100, defaultHeight: 40, icon: "👥" },
  { type: "badge", label: "Badge / Tag", defaultWidth: 90, defaultHeight: 30, icon: "🏷️" },
  { type: "breadcrumb", label: "Breadcrumb", defaultWidth: 200, defaultHeight: 30, icon: "🍞" },
  { type: "button", label: "Button (Primary)", defaultWidth: 140, defaultHeight: 40, icon: "🟩" },
  { type: "button_group", label: "Button Group", defaultWidth: 240, defaultHeight: 40, icon: "🗂️" },
  { type: "calendar", label: "Calendar Selector", defaultWidth: 200, defaultHeight: 200, icon: "📅" },
  { type: "card", label: "Content Card", defaultWidth: 180, defaultHeight: 180, icon: "🎴" },
  { type: "carousel", label: "Carousel Slider", defaultWidth: 240, defaultHeight: 140, icon: "🎠" },
  { type: "chart", label: "Chart / Graph", defaultWidth: 220, defaultHeight: 140, icon: "📊" },
  { type: "checkbox", label: "Checkbox", defaultWidth: 120, defaultHeight: 30, icon: "☑️" },
  { type: "collapsible", label: "Collapsible Area", defaultWidth: 200, defaultHeight: 80, icon: "↔️" },
  { type: "combobox", label: "Combobox / Dropdown", defaultWidth: 180, defaultHeight: 40, icon: "🔍" },
  { type: "command", label: "Command Menu", defaultWidth: 220, defaultHeight: 150, icon: "⌨️" },
  { type: "context_menu", label: "Context Menu", defaultWidth: 150, defaultHeight: 120, icon: "🖱️" },
  { type: "data_table", label: "Data Table", defaultWidth: 260, defaultHeight: 160, icon: "📅" },
  { type: "date_picker", label: "Date Picker", defaultWidth: 180, defaultHeight: 40, icon: "📆" },
  { type: "dialog", label: "Dialog Modal", defaultWidth: 280, defaultHeight: 160, icon: "💬" },
  { type: "direction", label: "Direction Guide", defaultWidth: 120, defaultHeight: 50, icon: "🧭" },
  { type: "drawer", label: "Drawer Panel", defaultWidth: 200, defaultHeight: 250, icon: "📥" },
  { type: "dropdown_menu", label: "Dropdown Menu", defaultWidth: 150, defaultHeight: 120, icon: "☰" },
  { type: "empty", label: "Empty State Placeholder", defaultWidth: 200, defaultHeight: 120, icon: "📭" },
  { type: "field", label: "Form Field Wrapper", defaultWidth: 200, defaultHeight: 65, icon: "📝" },
  { type: "hover_card", label: "Hover Card Info", defaultWidth: 180, defaultHeight: 100, icon: "👁️" },
  { type: "input", label: "Text Input", defaultWidth: 180, defaultHeight: 40, icon: "📥" },
  { type: "input_group", label: "Input Group", defaultWidth: 220, defaultHeight: 40, icon: "🔗" },
  { type: "input_otp", label: "OTP Input Field", defaultWidth: 160, defaultHeight: 45, icon: "🔒" },
  { type: "item", label: "List Item", defaultWidth: 180, defaultHeight: 40, icon: "🔹" },
  { type: "kbd", label: "Keyboard Key", defaultWidth: 60, defaultHeight: 30, icon: "⌨️" },
  { type: "label", label: "Form Label", defaultWidth: 100, defaultHeight: 25, icon: "🏷️" },
  { type: "menubar", label: "Menubar Header", defaultWidth: 320, defaultHeight: 40, icon: "💈" },
  { type: "native_select", label: "Native Select Option", defaultWidth: 160, defaultHeight: 40, icon: "🎛️" },
  { type: "navigation_menu", label: "Navigation Menu", defaultWidth: 280, defaultHeight: 45, icon: "🧭" },
  { type: "pagination", label: "Pagination Controls", defaultWidth: 220, defaultHeight: 40, icon: "🔢" },
  { type: "popover", label: "Popover Card", defaultWidth: 160, defaultHeight: 90, icon: "💬" },
  { type: "progress", label: "Progress Bar", defaultWidth: 180, defaultHeight: 25, icon: "⏳" },
  { type: "radio_group", label: "Radio Group Selector", defaultWidth: 140, defaultHeight: 80, icon: "🔘" },
  { type: "resizable", label: "Resizable Frame", defaultWidth: 200, defaultHeight: 120, icon: "↔️" },
  { type: "scroll_area", label: "Scroll Area Container", defaultWidth: 180, defaultHeight: 120, icon: "📜" },
  { type: "select", label: "Dropdown Select", defaultWidth: 180, defaultHeight: 40, icon: "🎛️" },
  { type: "separator", label: "Separator Line", defaultWidth: 200, defaultHeight: 15, icon: "➖" },
  { type: "sheet", label: "Slide Out Sheet", defaultWidth: 220, defaultHeight: 300, icon: "📑" },
  { type: "sidebar", label: "Sidebar Navigation", defaultWidth: 150, defaultHeight: 350, icon: "🗂️" },
  { type: "skeleton", label: "Skeleton Loading", defaultWidth: 180, defaultHeight: 25, icon: "💀" },
  { type: "slider", label: "Slider Control", defaultWidth: 160, defaultHeight: 30, icon: "🎚️" },
  { type: "spinner", label: "Loading Spinner", defaultWidth: 40, defaultHeight: 40, icon: "🌀" },
  { type: "switch", label: "Toggle Switch", defaultWidth: 80, defaultHeight: 35, icon: "🎚️" },
  { type: "table", label: "Data Table Grid", defaultWidth: 250, defaultHeight: 150, icon: "📊" },
  { type: "tabs", label: "Tabs Navigation", defaultWidth: 220, defaultHeight: 45, icon: "📁" },
  { type: "textarea", label: "Text Area Input", defaultWidth: 200, defaultHeight: 80, icon: "📝" },
  { type: "toggle", label: "Toggle Button", defaultWidth: 60, defaultHeight: 40, icon: "🔘" },
  { type: "toggle_group", label: "Toggle Group", defaultWidth: 180, defaultHeight: 40, icon: "🔘" },
  { type: "tooltip", label: "Tooltip Info", defaultWidth: 120, defaultHeight: 35, icon: "💬" },
  { type: "typography", label: "Typography Text", defaultWidth: 180, defaultHeight: 35, icon: "🔤" },
];

export function WireframeCanvas({ sections }: WireframeCanvasProps) {
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Extract color theme tokens dynamically from generated sections
  const theme = useMemo(() => {
    // Look for color definitions in sections
    const primarySection = sections.find(s => s.sectionKey === "color_primary");
    const secondarySection = sections.find(s => s.sectionKey === "color_secondary");
    const effectsSection = sections.find(s => s.sectionKey === "effects_shadows");

    let primaryColor = "#6366f1"; // Indigo default
    let accentColor = "#a855f7"; // Purple default
    let rounded = "8px"; // Rounded MD default

    if (primarySection) {
      const hexMatches = primarySection.body.match(/#[0-9A-Fa-f]{6}/g);
      if (hexMatches && hexMatches[0]) primaryColor = hexMatches[0];
      if (hexMatches && hexMatches[1]) accentColor = hexMatches[1];
    }

    if (effectsSection) {
      const radiusMatch = effectsSection.body.match(/(\d+)px/);
      if (radiusMatch && radiusMatch[1]) rounded = `${radiusMatch[1]}px`;
    }

    return { primaryColor, accentColor, rounded };
  }, [sections]);

  const filteredElements = useMemo(() => {
    if (!searchTerm) return ELEMENT_TYPES;
    return ELEMENT_TYPES.filter(el => 
      el.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
      el.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const addItem = (type: string, label: string, defaultWidth: number, defaultHeight: number) => {
    const newItem: CanvasItem = {
      id: `${type}-${Date.now()}`,
      type,
      label,
      x: 40 + (items.length * 16) % 240,
      y: 40 + (items.length * 16) % 240,
      width: defaultWidth,
      height: defaultHeight,
    };
    setItems((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  // Dragging item logic
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, item: CanvasItem) => {
    e.stopPropagation();
    setSelectedId(item.id);
    setDraggingId(item.id);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    const canvas = document.getElementById("sandbox-canvas");
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const newX = Math.max(0, Math.min(canvasRect.width, e.clientX - canvasRect.left - dragOffset.x));
    const newY = Math.max(0, Math.min(canvasRect.height, e.clientY - canvasRect.top - dragOffset.y));

    // Align to 8px spacing grid
    const gridAlignedX = Math.round(newX / 8) * 8;
    const gridAlignedY = Math.round(newY / 8) * 8;

    setItems((prev) =>
      prev.map((item) =>
        item.id === draggingId ? { ...item, x: gridAlignedX, y: gridAlignedY } : item
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div className="fade-up flex flex-col gap-5 lg:flex-row">
      {/* Toolbox Panel */}
      <div className="glass w-full shrink-0 rounded-2xl p-5 lg:w-72 flex flex-col max-h-[600px] overflow-hidden">
        <h3 className="text-sm font-bold uppercase tracking-wide text-white">ชิ้นส่วน UI Components ({ELEMENT_TYPES.length})</h3>
        <p className="mt-1 text-[11.5px] leading-relaxed text-slate-400">
          ค้นหาและเลือกชิ้นส่วนเพื่อเพิ่มลงบนกระดาน โดยสไตล์สีและขอบมนจะผูกกับระบบดีไซน์อัตโนมัติ
        </p>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="ค้นหา UI Component..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2 text-[12px] text-slate-200 placeholder-slate-500 focus:border-violet-500/50 focus:outline-none"
          />
        </div>

        {/* Scrollable list */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredElements.map((el) => (
            <button
              key={el.type}
              onClick={() => addItem(el.type, el.label, el.defaultWidth, el.defaultHeight)}
              className="flex w-full items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-3.5 py-2 text-left text-[12.5px] text-slate-200 transition hover:border-violet-500/40 hover:bg-violet-500/10"
            >
              <div className="flex items-center gap-2">
                <span className="text-[14px]">{el.icon}</span>
                <span>{el.label}</span>
              </div>
              <span className="text-[13px] text-violet-300 font-bold">+</span>
            </button>
          ))}
          {filteredElements.length === 0 && (
            <p className="text-center text-[12px] text-slate-500 py-6">ไม่พบส่วนประกอบที่ค้นหา</p>
          )}
        </div>

        <div className="mt-4 border-t border-white/8 pt-3 text-[11.5px]">
          <h4 className="text-[11px] font-bold text-violet-200 uppercase tracking-wide">สไตล์ธีมดีไซน์ที่ดึงมาใช้งาน</h4>
          <div className="mt-2 space-y-1 text-[11.5px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Primary Color:</span>
              <div className="flex items-center gap-1.5 font-mono text-slate-200">
                <span className="h-3 w-3 rounded" style={{ backgroundColor: theme.primaryColor }} />
                {theme.primaryColor}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Accent Color:</span>
              <div className="flex items-center gap-1.5 font-mono text-slate-200">
                <span className="h-3 w-3 rounded" style={{ backgroundColor: theme.accentColor }} />
                {theme.accentColor}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Border Radius:</span>
              <span className="font-mono text-slate-200">{theme.rounded}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Canvas Panel */}
      <div className="flex-1">
        <div className="glass flex items-center justify-between rounded-t-2xl px-5 py-3 border-b border-white/8">
          <div>
            <h3 className="text-sm font-bold text-white">Wireframe Sandbox Canvas</h3>
            <p className="text-[11px] text-slate-400 font-medium">คลิกเลือกชิ้นส่วนเพื่อลากปรับตำแหน่งแอนิเมชัน | ระยะกริดยึดทีละ 8px</p>
          </div>
          {selectedId && (
            <button
              onClick={() => deleteItem(selectedId)}
              className="rounded-lg bg-rose-500/15 border border-rose-500/30 px-2.5 py-1 text-[11px] text-rose-200 hover:bg-rose-500/30 transition"
            >
              🗑️ ลบชิ้นที่เลือก
            </button>
          )}
        </div>

        <div
          id="sandbox-canvas"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={() => setSelectedId(null)}
          className="relative min-h-[520px] w-full overflow-hidden bg-slate-950 rounded-b-2xl border border-t-0 border-white/8"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {items.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 select-none">
              <span className="text-3xl mb-2">📐</span>
              <p className="text-[13px] text-slate-400 font-medium">กระดานห้องทดลองว่างเปล่า</p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                เลือกชิ้นส่วนสกินจากแถบเครื่องมือด้านซ้าย เพื่อลากมาทดสอบสร้างเลเอาท์หน้าต่าง ๆ
              </p>
            </div>
          )}

          {items.map((item) => {
            const isSelected = selectedId === item.id;
            let elementStyle: React.CSSProperties = {
              position: "absolute",
              left: `${item.x}px`,
              top: `${item.y}px`,
              width: `${item.width}px`,
              height: `${item.height}px`,
              borderRadius: theme.rounded,
              userSelect: "none",
            };

            // Intelligent custom render based on component type
            let componentMarkup = null;
            
            if (item.type === "button") {
              componentMarkup = (
                <button
                  className="h-full w-full font-bold text-[11px] text-white flex items-center justify-center shadow-md active:scale-95 transition"
                  style={{
                    backgroundColor: theme.primaryColor,
                    borderRadius: theme.rounded,
                  }}
                >
                  {item.label}
                </button>
              );
            } else if (item.type === "badge") {
              componentMarkup = (
                <div
                  className="h-full w-full font-semibold text-[10px] flex items-center justify-center border"
                  style={{
                    color: theme.accentColor,
                    borderColor: theme.accentColor,
                    backgroundColor: `${theme.accentColor}10`,
                    borderRadius: theme.rounded,
                  }}
                >
                  ✨ {item.label}
                </div>
              );
            } else if (item.type === "avatar") {
              componentMarkup = (
                <div className="h-full w-full flex items-center gap-1.5 px-2">
                  <div className="h-6 w-6 rounded-full bg-slate-700 border border-white/20" />
                  <div className="h-6 w-6 rounded-full bg-slate-600 border border-white/20 -ml-3" />
                  <div className="h-6 w-6 rounded-full bg-slate-500 border border-white/20 -ml-3 flex items-center justify-center text-[8px] text-white font-bold">
                    +3
                  </div>
                </div>
              );
            } else if (item.type === "toast") {
              componentMarkup = (
                <div
                  className="h-full w-full border border-white/10 shadow-lg p-2 flex items-center gap-2 text-[10px] text-slate-200"
                  style={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderRadius: theme.rounded,
                  }}
                >
                  <span style={{ color: theme.primaryColor }}>🔔</span>
                  <span>Notification Success!</span>
                </div>
              );
            } else if (item.type === "switch") {
              componentMarkup = (
                <div className="h-full w-full flex items-center justify-center p-1.5">
                  <div
                    className="w-12 h-6 rounded-full p-0.5 transition duration-200 flex items-center"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md transform translate-x-6" />
                  </div>
                </div>
              );
            } else if (item.type === "slider") {
              componentMarkup = (
                <div className="h-full w-full flex items-center px-3 gap-2">
                  <div className="h-1.5 flex-1 bg-slate-800 rounded relative">
                    <div className="absolute left-0 top-0 h-full w-2/3 rounded" style={{ backgroundColor: theme.primaryColor }} />
                    <div
                      className="absolute left-2/3 -top-1.5 h-4.5 w-4.5 rounded-full bg-white border shadow"
                      style={{ transform: "translateX(-50%)" }}
                    />
                  </div>
                </div>
              );
            } else if (item.type === "spinner") {
              componentMarkup = (
                <div className="h-full w-full flex items-center justify-center">
                  <div
                    className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: `${theme.primaryColor}30`, borderTopColor: theme.primaryColor }}
                  />
                </div>
              );
            } else if (item.type === "checkbox") {
              componentMarkup = (
                <div className="h-full w-full flex items-center px-2 gap-2 text-[11px] text-slate-300">
                  <div
                    className="h-4 w-4 rounded flex items-center justify-center text-[9px] text-white"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    ✓
                  </div>
                  <span>Checkbox Label</span>
                </div>
              );
            } else if (item.type === "progress") {
              componentMarkup = (
                <div className="h-full w-full flex flex-col justify-center px-3 gap-1">
                  <div className="h-2 w-full bg-slate-900 border border-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                  </div>
                </div>
              );
            } else {
              // Fallback default generic mockup layout style for other elements
              componentMarkup = (
                <div
                  className="h-full w-full border border-dashed flex flex-col items-center justify-center p-2 text-center text-slate-300 transition duration-150 hover:bg-white/[0.02]"
                  style={{
                    borderColor: `${theme.primaryColor}40`,
                    borderRadius: theme.rounded,
                    backgroundColor: "rgba(255, 255, 255, 0.01)",
                  }}
                >
                  <span className="text-[15px] filter drop-shadow">{ELEMENT_TYPES.find(el => el.type === item.type)?.icon ?? "🧱"}</span>
                  <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-full text-slate-300">
                    {item.label}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                style={elementStyle}
                onMouseDown={(e) => handleMouseDown(e, item)}
                className={`group cursor-move transition-transform active:scale-[0.98] ${
                  isSelected ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-slate-950" : ""
                }`}
              >
                {componentMarkup}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
