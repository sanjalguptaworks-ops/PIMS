import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";

const PAGE_SIZE = 25;

export default async function PipesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireAuth();
  const { q = "", status = "", page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  const where = {
    ...(q
      ? {
          OR: [
            { pipeNo: { contains: q, mode: "insensitive" as const } },
            { heatNo: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status ? { status: status as "IN_STOCK" | "STRUNG" | "WELDED" | "CUT" | "SCRAPPED" } : {}),
  };

  const [total, pipes] = await Promise.all([
    prisma.pipe.count({ where }),
    prisma.pipe.findMany({
      where,
      include: { spread: { include: { lineLoop: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h1 className="text-lg font-semibold">Pipes</h1>

      <form className="card p-3 flex flex-wrap items-center gap-2" action="/pipes">
        <input type="search" name="q" defaultValue={q} placeholder="Pipe No / Heat No" className="field-input max-w-xs" />
        <select name="status" defaultValue={status} className="field-input max-w-xs">
          <option value="">All Statuses</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="STRUNG">Strung</option>
          <option value="WELDED">Welded</option>
          <option value="CUT">Cut</option>
          <option value="SCRAPPED">Scrapped</option>
        </select>
        <button type="submit" className="btn-secondary">
          Filter
        </button>
      </form>

      <div className="card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pipe No</th>
              <th>Spread</th>
              <th>Heat No</th>
              <th>Diameter</th>
              <th>Wall Thickness</th>
              <th>Status</th>
              <th>Chainage</th>
            </tr>
          </thead>
          <tbody>
            {pipes.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-slate-400 py-6">
                  No records found.
                </td>
              </tr>
            )}
            {pipes.map((p) => (
              <tr key={p.id}>
                <td className="font-medium">{p.pipeNo}</td>
                <td>{p.spread.lineLoop.name} / {p.spread.name}</td>
                <td>{p.heatNo ?? "-"}</td>
                <td>{p.diameter ?? "-"}</td>
                <td>{p.wallThickness ?? "-"}</td>
                <td>{p.status}</td>
                <td>{p.stationChainage ?? "-"}</td>
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
              <a className="btn-secondary" href={`?q=${q}&status=${status}&page=${page - 1}`}>
                Prev
              </a>
            )}
            {page < totalPages && (
              <a className="btn-secondary" href={`?q=${q}&status=${status}&page=${page + 1}`}>
                Next
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
