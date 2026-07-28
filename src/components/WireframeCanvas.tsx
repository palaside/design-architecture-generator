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
  { type: "header", label: "Header (Top Nav)", defaultWidth: 600, defaultHeight: 50 },
  { type: "sidebar", label: "Sidebar Menu", defaultWidth: 150, defaultHeight: 350 },
  { type: "button_primary", label: "Button (Primary)", defaultWidth: 140, defaultHeight: 40 },
  { type: "button_secondary", label: "Button (Secondary)", defaultWidth: 140, defaultHeight: 40 },
  { type: "input", label: "Text Input Field", defaultWidth: 200, defaultHeight: 40 },
  { type: "card", label: "Content Card", defaultWidth: 180, defaultHeight: 180 },
  { type: "text", label: "Text Headline", defaultWidth: 200, defaultHeight: 30 },
];

export function WireframeCanvas({ sections }: WireframeCanvasProps) {
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const addItem = (type: string, label: string, defaultWidth: number, defaultHeight: number) => {
    const newItem: CanvasItem = {
      id: `${type}-${Date.now()}`,
      type,
      label,
      x: 50 + (items.length * 10) % 200,
      y: 50 + (items.length * 10) % 200,
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
    
    // Calculate mouse click offset within the element
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
      <div className="glass w-full shrink-0 rounded-2xl p-5 lg:w-64">
        <h3 className="text-sm font-bold uppercase tracking-wide text-white">ชิ้นส่วน UI Components</h3>
        <p className="mt-1 text-[11.5px] leading-relaxed text-slate-400">
          คลิกเลือกชิ้นส่วนเพื่อเพิ่มลงบนกระดาน โดยสไตล์สีและขอบมนจะถูกดึงมาจากระบบดีไซน์ที่ AI แนะนำโดยตรง
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {ELEMENT_TYPES.map((el) => (
            <button
              key={el.type}
              onClick={() => addItem(el.type, el.label, el.defaultWidth, el.defaultHeight)}
              className="flex w-full items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-3.5 py-2.5 text-left text-[12.5px] text-slate-200 transition hover:border-violet-500/40 hover:bg-violet-500/10"
            >
              <span>{el.label}</span>
              <span className="text-[14px] text-violet-300">+</span>
            </button>
          ))}
        </div>

        <div className="mt-6 border-t border-white/8 pt-4">
          <h4 className="text-[12px] font-bold text-violet-200 uppercase tracking-wide">ข้อมูลธีมดีไซน์ที่กำลังใช้</h4>
          <div className="mt-2.5 space-y-2 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Primary Color:</span>
              <div className="flex items-center gap-1.5 font-mono text-slate-200">
                <span className="h-3.5 w-3.5 rounded" style={{ backgroundColor: theme.primaryColor }} />
                {theme.primaryColor}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Accent Color:</span>
              <div className="flex items-center gap-1.5 font-mono text-slate-200">
                <span className="h-3.5 w-3.5 rounded" style={{ backgroundColor: theme.accentColor }} />
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
            <p className="text-[11px] text-slate-400">คลิกที่ชิ้นส่วนเพื่อลากขยับตำแหน่ง | ระยะกริดยึดทีละ 8px</p>
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
          className="relative min-h-[480px] w-full overflow-hidden bg-slate-950 rounded-b-2xl border border-t-0 border-white/8"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {items.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 select-none">
              <span className="text-3xl mb-2">📐</span>
              <p className="text-[13px] text-slate-400 font-medium">กระดานว่างเปล่า</p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                เลือกชิ้นส่วนจากแถบด้านซ้ายเพื่อเพิ่มลงบนกระดานทดสอบ
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

            // Apply different dynamic designs based on type
            let componentMarkup = null;
            if (item.type === "header") {
              componentMarkup = (
                <div
                  className="flex h-full w-full items-center justify-between px-3 text-[11px] font-semibold text-white shadow-sm"
                  style={{
                    backgroundColor: theme.primaryColor,
                    borderRadius: theme.rounded,
                  }}
                >
                  <span>🍔 App Name</span>
                  <div className="flex gap-2 text-[9px] opacity-80">
                    <span>Menu 1</span>
                    <span>Menu 2</span>
                  </div>
                </div>
              );
            } else if (item.type === "sidebar") {
              componentMarkup = (
                <div
                  className="h-full w-full border-r border-white/10 p-3 text-[11px] text-slate-300 flex flex-col gap-2"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: theme.rounded,
                  }}
                >
                  <div className="h-6 w-full rounded opacity-40 bg-white/20" />
                  <div className="h-6 w-full rounded opacity-20 bg-white/20" />
                  <div className="h-6 w-full rounded opacity-20 bg-white/20" />
                </div>
              );
            } else if (item.type === "button_primary") {
              componentMarkup = (
                <button
                  className="h-full w-full font-bold text-[11.5px] text-white flex items-center justify-center shadow-md active:scale-95 transition"
                  style={{
                    backgroundColor: theme.primaryColor,
                    borderRadius: theme.rounded,
                  }}
                >
                  {item.label}
                </button>
              );
            } else if (item.type === "button_secondary") {
              componentMarkup = (
                <button
                  className="h-full w-full font-semibold text-[11.5px] border flex items-center justify-center transition"
                  style={{
                    color: theme.primaryColor,
                    borderColor: theme.primaryColor,
                    backgroundColor: "transparent",
                    borderRadius: theme.rounded,
                  }}
                >
                  {item.label}
                </button>
              );
            } else if (item.type === "input") {
              componentMarkup = (
                <div className="h-full w-full relative">
                  <input
                    disabled
                    type="text"
                    placeholder="กรอกข้อมูล..."
                    className="h-full w-full px-3 text-[11.5px] bg-slate-900 border border-white/15 text-slate-300"
                    style={{
                      borderRadius: theme.rounded,
                    }}
                  />
                </div>
              );
            } else if (item.type === "card") {
              componentMarkup = (
                <div
                  className="h-full w-full border border-white/8 p-3 shadow-lg flex flex-col justify-between"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    borderRadius: theme.rounded,
                  }}
                >
                  <div className="h-2/3 w-full rounded opacity-40" style={{ backgroundColor: theme.accentColor }} />
                  <div className="h-4 w-full rounded bg-white/10 mt-2" />
                </div>
              );
            } else if (item.type === "text") {
              componentMarkup = (
                <div className="h-full w-full flex items-center text-[13px] font-bold text-white tracking-tight">
                  <span style={{ color: theme.primaryColor }}>■</span>&nbsp;{item.label}
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
