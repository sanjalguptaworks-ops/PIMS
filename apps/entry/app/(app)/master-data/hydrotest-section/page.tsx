import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { Field } from "@/components/FormFields";
import { createHydrotestSectionAction } from "./actions";

export default async function HydrotestSectionPage() {
  await requireAuth();
  const spread = await requireSpread();

  const records = await prisma.hydrotestSection.findMany({
    where: { spreadId: spread.id },
    orderBy: { sectionNo: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Hydrotest Section</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <section className="space-y-2">
        <details className="card">
          <summary className="section-title cursor-pointer select-none">+ Add Hydrotest Section</summary>
          <form action={createHydrotestSectionAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Section No" name="sectionNo" required />
            <Field label="Station From (m)" name="stationFrom" type="number" step="any" />
            <Field label="Station To (m)" name="stationTo" type="number" step="any" />
            <Field label="Test Pressure" name="testPressure" type="number" step="any" />
            <div className="lg:col-span-4">
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </details>

        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Section No</th>
                <th>Station From</th>
                <th>Station To</th>
                <th>Test Pressure</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={4} className="text-center text-slate-400 py-6">No records found.</td></tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.sectionNo}</td>
                  <td>{r.stationFrom ?? "-"}</td>
                  <td>{r.stationTo ?? "-"}</td>
                  <td>{r.testPressure ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
