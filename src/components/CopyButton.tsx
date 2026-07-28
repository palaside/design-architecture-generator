"use client";

import { useState } from "react";

export function CopyButton({
  text,
  label = "คัดลอก",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${
        copied
          ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
          : "border-white/15 bg-white/5 text-slate-300 hover:border-violet-400/50 hover:bg-violet-500/15 hover:text-white"
      } ${className}`}
    >
      {copied ? "✓ คัดลอกแล้ว" : `⧉ ${label}`}
    </button>
  );
}
