"use client";
import Link from "next/link";
import { useState } from "react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      {/* Avatar / button */}
      <button
        type="button"
        className="flex items-center rounded-full bg-white/10 p-2 hover:bg-white/20 focus:outline-none"
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* Simple avatar placeholder */}
        <span className="inline-block h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-400 text-sm font-bold text-white flex items-center justify-center">👤</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-[#070912]/80 backdrop-blur-xl shadow-lg ring-1 ring-white/10"
          role="menu"
        >
          <div className="py-1" role="none">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
              role="menuitem"
            >
              โปรไฟล์ผู้ใช้
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
