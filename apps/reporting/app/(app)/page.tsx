import { redirect } from "next/navigation";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { getSpreadOptions, resolveSpreadFilter } from "@/lib/filters";
import SpreadFilterBar from "@/components/SpreadFilterBar";
import StatTile from "@/components/StatTile";
import BarChart from "@/components/BarChart";

async function applySpreadFilter(formData: FormData) {
  "use server";
  const spreadId = String(formData.get("spreadId") ?? "");
  redirect(spreadId ? `/?spreadId=${spreadId}` : "/");
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ spreadId?: string }>;
}) {
  await requireAuth();
  const { spreadId } = await searchParams;
  const spreads = await getSpreadOptions();
  const where = resolveSpreadFilter(spreadId);

  const [
    pipeTotal,
    pipeByStatus,
    weldTotal,
    weldVisual,
    ndtByResult,
    ndtByMethod,
    defectLeaderboard,
    activityCount,
  ] = await Promise.all([
    prisma.pipe.count({ where }),
    prisma.pipe.groupBy({ by: ["status"], where, _count: true }),
    prisma.weld.count({ where }),
    prisma.weld.groupBy({ by: ["visualCheck"], where, _count: true }),
    prisma.nDTResult.groupBy({
      by: ["overallResult"],
      where: spreadId ? { weld: { spreadId } } : {},
      _count: true,
    }),
    prisma.nDTResult.groupBy({
      by: ["method"],
      where: spreadId ? { weld: { spreadId } } : {},
      _count: true,
    }),
    prisma.nDTDefect.groupBy({
      by: ["defectWelderId"],
      where: {
        defectWelderId: { not: null },
        ...(spreadId ? { ndtResult: { weld: { spreadId } } } : {}),
      },
      _count: true,
      orderBy: { _count: { defectWelderId: "desc" } },
      take: 5,
    }),
    prisma.activityRecord.count({ where }),
  ]);

  const welderIds = defectLeaderboard.map((d) => d.defectWelderId).filter((id): id is string => !!id);
  const welders = welderIds.length
    ? await prisma.welder.findMany({ where: { id: { in: welderIds } } })
    : [];
  const welderName = (id: string | null) => welders.find((w) => w.id === id)?.welderCode ?? "Unknown";

  const strungCount = pipeByStatus.find((p) => p.status === "STRUNG")?._count ?? 0;
  const weldedCount = pipeByStatus.find((p) => p.status === "WELDED")?._count ?? 0;
  const ndtAccept = ndtByResult.find((n) => n.overallResult === "ACCEPT")?._count ?? 0;
  const ndtReject = ndtByResult.find((n) => n.overallResult === "NOT_ACCEPT")?._count ?? 0;
  const visualOk = weldVisual.find((w) => w.visualCheck === "OK")?._count ?? 0;
  const visualNotOk = weldVisual.find((w) => w.visualCheck === "NOT_OK")?._count ?? 0;

  const pipeStatusData = pipeByStatus.map((p) => ({ name: p.status, value: p._count }));
  const ndtMethodData = ndtByMethod.map((n) => ({ name: n.method, value: n._count }));

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Progress Dashboard</h1>
        <p className="text-sm text-slate-500">Pipeline construction progress across the project.</p>
      </div>

      <SpreadFilterBar spreads={spreads} selectedSpreadId={spreadId} action={applySpreadFilter} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatTile label="Pipe Joints" value={pipeTotal.toLocaleString()} />
        <StatTile
          label="Strung"
          value={strungCount.toLocaleString()}
          sub={pipeTotal ? `${Math.round((strungCount / pipeTotal) * 100)}%` : undefined}
        />
        <StatTile
          label="Welded"
          value={weldedCount.toLocaleString()}
          sub={pipeTotal ? `${Math.round((weldedCount / pipeTotal) * 100)}%` : undefined}
        />
        <StatTile label="Total Welds" value={weldTotal.toLocaleString()} />
        <StatTile label="Field Reports" value={activityCount.toLocaleString()} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatTile label="Visual OK" value={visualOk} tone="good" />
        <StatTile label="Visual Not OK" value={visualNotOk} tone={visualNotOk > 0 ? "bad" : "default"} />
        <StatTile label="NDT Accept" value={ndtAccept} tone="good" />
        <StatTile label="NDT Not Accept" value={ndtReject} tone={ndtReject > 0 ? "bad" : "default"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="text-sm font-semibold text-slate-600 mb-2">Pipe Inventory by Status</h2>
          {pipeStatusData.length > 0 ? (
            <BarChart data={pipeStatusData} />
          ) : (
            <p className="text-sm text-slate-400">No pipe data yet.</p>
          )}
        </div>
        <div className="card p-4">
          <h2 className="text-sm font-semibold text-slate-600 mb-2">NDT Results by Method</h2>
          {ndtMethodData.length > 0 ? (
            <BarChart data={ndtMethodData} />
          ) : (
            <p className="text-sm text-slate-400">No NDT data yet.</p>
          )}
        </div>
      </div>

      <div className="card overflow-x-auto">
        <div className="section-title">Welder Defect Leaderboard (Top 5)</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Welder</th>
              <th>Defects Attributed</th>
            </tr>
          </thead>
          <tbody>
            {defectLeaderboard.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center text-slate-400 py-6">
                  No defects recorded.
                </td>
              </tr>
            )}
            {defectLeaderboard.map((d) => (
              <tr key={d.defectWelderId}>
                <td className="font-medium">{welderName(d.defectWelderId)}</td>
                <td>{d._count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
