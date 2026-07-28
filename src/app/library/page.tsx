import Link from "next/link";
import { DeleteBlueprintButton } from "@/components/DeleteBlueprintButton";
import { listBlueprints, statsOverview } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const [items, stats] = await Promise.all([listBlueprints(60), statsOverview()]);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">คลังพิมพ์เขียว</h1>
          <p className="mt-1 text-[13.5px] text-slate-400">
            พิมพ์เขียวทั้งหมด {stats.total.toLocaleString("th-TH")} ชุด · {stats.sections.toLocaleString("th-TH")} หัวข้อ ·
            ~{stats.tokens.toLocaleString("th-TH")} tokens
          </p>
        </div>
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-110"
        >
          + สร้างพิมพ์เขียวใหม่
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="glass mt-8 rounded-3xl p-12 text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-3 text-[15px] font-semibold text-white">ยังไม่มีพิมพ์เขียว</p>
          <p className="mt-1 text-[13px] text-slate-400">ลองพิมพ์ความต้องการสั้นๆ เช่น &ldquo;อยากทำระบบ POS ร้านอาหารเล็กๆ&rdquo;</p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            เริ่มสร้างเลย
          </Link>
        </div>
      ) : (
        <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((b) => (
            <div key={b.id} className="glass group relative rounded-2xl p-4 transition hover:border-violet-400/40">
              <Link href={`/blueprint/${b.id}`} className="block">
                <p className="text-[11px] font-medium uppercase tracking-wide text-violet-300">{b.domainLabel}</p>
                <p className="mt-1 line-clamp-1 text-[15px] font-semibold text-white">{b.title}</p>
                <p className="mt-1 line-clamp-2 text-[12.5px] text-slate-400">&ldquo;{b.requirement}&rdquo;</p>
                <p className="mt-1 text-[11.5px] text-slate-500">{b.subtitle}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[10.5px]">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-slate-300">
                    {b.sectionCount} หัวข้อ
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-slate-300">
                    ~{b.tokenEstimate.toLocaleString("th-TH")} tokens
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-slate-300">v{b.version}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-slate-500">
                    {new Date(b.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })}
                  </span>
                </div>
              </Link>
              <div className="mt-3 flex gap-2 border-t border-white/8 pt-3">
                <a
                  href={`/api/blueprints/${b.id}/export?format=md`}
                  className="rounded-lg border border-white/12 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-sky-400/50"
                >
                  ⬇ .md
                </a>
                <a
                  href={`/api/blueprints/${b.id}/export?format=master`}
                  className="rounded-lg border border-white/12 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-violet-400/50"
                >
                  ⬇ master prompt
                </a>
                <DeleteBlueprintButton id={b.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
