import { prisma } from "@pims/db";
import { isAdminRole } from "@pims/auth";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { Field } from "@/components/FormFields";
import { createReRoutingAction } from "./actions";

export default async function ReRoutingPage() {
  const session = await requireAuth();
  const canCreate = isAdminRole(session.role);
  const spread = await requireSpread();

  const records = await prisma.reRouting.findMany({
    where: { spreadId: spread.id },
    orderBy: { id: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Re-Routing</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <section className="space-y-2">
        {canCreate ? (
        <details className="card">
          <summary className="section-title cursor-pointer select-none">+ Add Re-Routing</summary>
          <form action={createReRoutingAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Description" name="description" />
            <Field label="Station From (m)" name="stationFrom" type="number" step="any" />
            <Field label="Station To (m)" name="stationTo" type="number" step="any" />
            <div className="lg:col-span-4">
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </details>
        ) : (
          <p className="text-xs text-slate-500">Only Client and Contractor Admin users can add Master Data records.</p>
        )}

        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Station From</th>
                <th>Station To</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={3} className="text-center text-slate-400 py-6">No records found.</td></tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.description ?? "-"}</td>
                  <td>{r.stationFrom ?? "-"}</td>
                  <td>{r.stationTo ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
