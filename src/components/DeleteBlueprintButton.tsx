"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteBlueprintButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    await fetch(`/api/blueprints/${id}`, { method: "DELETE" });
    setBusy(false);
    setConfirming(false);
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="ml-auto rounded-lg border border-white/12 bg-white/5 px-2.5 py-1 text-[11px] text-slate-400 transition hover:border-rose-400/50 hover:text-rose-300"
      >
        ลบ
      </button>
    );
  }

  return (
    <span className="ml-auto flex gap-1.5">
      <button
        onClick={remove}
        disabled={busy}
        className="rounded-lg border border-rose-400/40 bg-rose-500/20 px-2.5 py-1 text-[11px] font-medium text-rose-200 disabled:opacity-60"
      >
        {busy ? "…" : "ยืนยันลบ"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="rounded-lg border border-white/12 bg-white/5 px-2.5 py-1 text-[11px] text-slate-400"
      >
        ยกเลิก
      </button>
    </span>
  );
}
