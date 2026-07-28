import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";
import UserMenu from "@/components/UserMenu";

export const metadata: Metadata = {
  title: "Prompt Architect 360° — โรงงานผลิต Prompt ระดับ Production",
  description:
    "แปลงความต้องการสั้นๆ ให้เป็นพิมพ์เขียว Prompt 360 องศา ครบ 5 เสา 30 หัวข้อ พร้อม Reverse Prompt, Master Prompt และ Meta-Prompt",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen text-slate-200 antialiased">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070912]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
            <Link href="/" className="group flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-400 text-base font-bold text-white shadow-lg shadow-violet-500/30">
                ◎
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-bold tracking-tight text-white">Prompt Architect 360°</span>
                <span className="block text-[11px] text-slate-400">Prompt · Context · Harness · Loop · Graph</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link href="/" className="rounded-lg px-3 py-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white">
                สร้างใหม่
              </Link>
              <Link href="/library" className="rounded-lg px-3 py-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white">
                คลังพิมพ์เขียว
              </Link>
              <Link
                href="/method"
                className="rounded-lg px-3 py-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                วิธีการ
              </Link>
            </nav>
              <UserMenu />
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-20 border-t border-white/10 py-8 text-center text-xs text-slate-500">
          สร้างด้วย Next.js · PostgreSQL · Drizzle ORM — เครื่องมือวิศวกรรมพรอมต์สำหรับทีมที่ต้องส่งงานจริง
        </footer>
      </body>
    </html>
  );
}
