import { notFound } from "next/navigation";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { getActivityConfig } from "@/lib/activityConfig";
import ActivityForm from "@/components/ActivityForm";

export default async function ActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  await requireAuth();
  const spread = await requireSpread();
  const { activity } = await params;
  const config = getActivityConfig(activity);
  if (!config || config.zone !== "post-welding") notFound();

  const records = await prisma.activityRecord.findMany({
    where: { spreadId: spread.id, activityType: config.activityType },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold">{config.title}</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <div className="card">
        <div className="section-title">General</div>
        <ActivityForm config={config} />
      </div>

      <div className="card overflow-x-auto">
        <div className="section-title">Recent Reports</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Report No</th>
              <th>Report Date</th>
              <th>Mile Post</th>
              <th>Key Details</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-slate-400 py-6">
                  No records found.
                </td>
              </tr>
            )}
            {records.map((r) => {
              const details = (r.details as Record<string, string> | null) ?? {};
              return (
                <tr key={r.id}>
                  <td className="font-medium">{r.reportNumber ?? "-"}</td>
                  <td>{r.reportDate?.toLocaleDateString() ?? "-"}</td>
                  <td>{r.milePost ?? "-"}</td>
                  <td className="text-xs text-slate-500">
                    {Object.entries(details)
                      .slice(0, 3)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ") || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
