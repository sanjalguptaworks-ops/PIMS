import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";

const PAGE_SIZE = 25;

export default async function NdtPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAuth();
  const { page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  const [total, defects] = await Promise.all([
    prisma.nDTDefect.count(),
    prisma.nDTDefect.findMany({
      include: {
        ndtResult: { include: { weld: true } },
        defectWelder: true,
      },
      orderBy: { id: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h1 className="text-lg font-semibold">NDT Defects</h1>

      <div className="card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Joint No</th>
              <th>Method</th>
              <th>Defect Type</th>
              <th>Length</th>
              <th>Depth</th>
              <th>Result</th>
              <th>Welder</th>
            </tr>
          </thead>
          <tbody>
            {defects.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-slate-400 py-6">
                  No defects found.
                </td>
              </tr>
            )}
            {defects.map((d) => (
              <tr key={d.id}>
                <td className="font-medium">{d.ndtResult.weld.jointNumber}</td>
                <td>{d.ndtResult.method}</td>
                <td>{d.defectType ?? "-"}</td>
                <td>{d.defectLength ?? "-"}</td>
                <td>{d.depth ?? "-"}</td>
                <td className="text-red-600">{d.result ?? "-"}</td>
                <td>{d.defectWelder?.welderCode ?? "-"}</td>
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
              <a className="btn-secondary" href={`?page=${page - 1}`}>
                Prev
              </a>
            )}
            {page < totalPages && (
              <a className="btn-secondary" href={`?page=${page + 1}`}>
                Next
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
