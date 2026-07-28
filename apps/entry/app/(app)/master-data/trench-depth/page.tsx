import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { Field } from "@/components/FormFields";
import { createTrenchDepthAction } from "./actions";

export default async function TrenchDepthPage() {
  await requireAuth();
  const spread = await requireSpread();

  const records = await prisma.trenchDepth.findMany({
    where: { spreadId: spread.id },
    orderBy: { stationFrom: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Trench Depth</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <section className="space-y-2">
        <details className="card">
          <summary className="section-title cursor-pointer select-none">+ Add Trench Depth</summary>
          <form action={createTrenchDepthAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Station From (m)" name="stationFrom" type="number" step="any" required />
            <Field label="Station To (m)" name="stationTo" type="number" step="any" required />
            <Field label="Required Depth (m)" name="requiredDepth" type="number" step="any" required />
            <div className="lg:col-span-4">
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </details>

        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Station From</th>
                <th>Station To</th>
                <th>Required Depth</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={3} className="text-center text-slate-400 py-6">No records found.</td></tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.stationFrom}</td>
                  <td>{r.stationTo}</td>
                  <td>{r.requiredDepth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
