import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";

export default async function WelderPerformancePage() {
  await requireAuth();

  const welders = await prisma.welder.findMany({
    include: {
      company: true,
      weldAssignments: { include: { weld: { include: { ndtResults: true } } } },
      ndtDefects: true,
    },
    orderBy: { welderCode: "asc" },
  });

  const rows = welders.map((w) => {
    const weldsCount = w.weldAssignments.length;
    const ndtResults = w.weldAssignments.flatMap((wa) => wa.weld.ndtResults);
    const accepted = ndtResults.filter((n) => n.overallResult === "ACCEPT").length;
    const rejected = ndtResults.filter((n) => n.overallResult === "NOT_ACCEPT").length;
    const total = accepted + rejected;
    const acceptRate = total > 0 ? Math.round((accepted / total) * 100) : null;
    return {
      id: w.id,
      code: w.welderCode,
      name: w.name,
      company: w.company.name,
      weldsCount,
      accepted,
      rejected,
      acceptRate,
      defects: w.ndtDefects.length,
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h1 className="text-lg font-semibold">Welder Performance</h1>

      <div className="card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Welder Code</th>
              <th>Name</th>
              <th>Company</th>
              <th>Welds</th>
              <th>NDT Accept</th>
              <th>NDT Reject</th>
              <th>Accept Rate</th>
              <th>Defects Attributed</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-slate-400 py-6">
                  No welders found.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="font-medium">{r.code}</td>
                <td>{r.name}</td>
                <td>{r.company}</td>
                <td>{r.weldsCount}</td>
                <td className="text-emerald-600">{r.accepted}</td>
                <td className={r.rejected > 0 ? "text-red-600" : ""}>{r.rejected}</td>
                <td>{r.acceptRate !== null ? `${r.acceptRate}%` : "-"}</td>
                <td>{r.defects}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
