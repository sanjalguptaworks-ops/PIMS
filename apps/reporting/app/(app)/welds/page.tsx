import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";

const PAGE_SIZE = 25;

export default async function WeldsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requireAuth();
  const { q = "", page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  const where = q ? { jointNumber: { contains: q, mode: "insensitive" as const } } : {};

  const [total, welds] = await Promise.all([
    prisma.weld.count({ where }),
    prisma.weld.findMany({
      where,
      include: {
        spread: { include: { lineLoop: true } },
        welders: { include: { welder: true } },
        ndtResults: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h1 className="text-lg font-semibold">Welds</h1>

      <form className="card p-3 flex flex-wrap items-center gap-2" action="/welds">
        <input type="search" name="q" defaultValue={q} placeholder="Joint Number" className="field-input max-w-xs" />
        <button type="submit" className="btn-secondary">
          Search
        </button>
      </form>

      <div className="card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Joint No</th>
              <th>Spread</th>
              <th>Welders</th>
              <th>Visual</th>
              <th>NDT</th>
              <th>Report Date</th>
            </tr>
          </thead>
          <tbody>
            {welds.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-slate-400 py-6">
                  No records found.
                </td>
              </tr>
            )}
            {welds.map((w) => (
              <tr key={w.id}>
                <td className="font-medium">{w.jointNumber}</td>
                <td>{w.spread.lineLoop.name} / {w.spread.name}</td>
                <td>{w.welders.map((x) => x.welder.welderCode).join(", ") || "-"}</td>
                <td className={w.visualCheck === "OK" ? "text-emerald-600" : w.visualCheck === "NOT_OK" ? "text-red-600" : ""}>
                  {w.visualCheck ?? "-"}
                </td>
                <td>
                  {w.ndtResults.length === 0
                    ? "Pending"
                    : w.ndtResults.map((n) => `${n.method}:${n.overallResult ?? "-"}`).join(", ")}
                </td>
                <td>{w.reportDate?.toLocaleDateString() ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-3 py-2 text-sm text-slate-500">
          <span>
            Page {page} of {totalPages} &middot; {total.toLocaleString()} total
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <a className="btn-secondary" href={`?q=${q}&page=${page - 1}`}>
                Prev
              </a>
            )}
            {page < totalPages && (
              <a className="btn-secondary" href={`?q=${q}&page=${page + 1}`}>
                Next
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
