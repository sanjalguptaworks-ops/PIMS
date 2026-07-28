import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { Field, SelectField } from "@/components/FormFields";
import { createLineCrossingAction } from "./actions";

export default async function LineCrossingPage() {
  await requireAuth();
  const spread = await requireSpread();

  const records = await prisma.lineCrossing.findMany({
    where: { spreadId: spread.id },
    orderBy: { crossingNo: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Line Crossing</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <section className="space-y-2">
        <details className="card">
          <summary className="section-title cursor-pointer select-none">+ Add Line Crossing</summary>
          <form action={createLineCrossingAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Crossing No" name="crossingNo" required />
            <SelectField label="Type" name="type" options={[
              { value: "Road", label: "Road" },
              { value: "River", label: "River" },
              { value: "Railway", label: "Railway" },
              { value: "Canal", label: "Canal" },
            ]} />
            <Field label="Station From (m)" name="stationFrom" type="number" step="any" />
            <Field label="Station To (m)" name="stationTo" type="number" step="any" />
            <div className="lg:col-span-4">
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </details>

        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Crossing No</th>
                <th>Type</th>
                <th>Station From</th>
                <th>Station To</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={4} className="text-center text-slate-400 py-6">No records found.</td></tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.crossingNo}</td>
                  <td>{r.type ?? "-"}</td>
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
