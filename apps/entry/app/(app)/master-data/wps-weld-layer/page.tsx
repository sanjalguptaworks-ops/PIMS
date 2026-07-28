import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { Field, SelectField } from "@/components/FormFields";
import { createWpsWeldLayerAction } from "./actions";

export default async function WpsWeldLayerPage() {
  await requireAuth();

  const [records, wpsList] = await Promise.all([
    prisma.wPSWeldLayer.findMany({ include: { wps: true }, orderBy: [{ wpsId: "asc" }, { layerNumber: "asc" }] }),
    prisma.wPS.findMany({ orderBy: { wpsNo: "asc" } }),
  ]);
  const wpsOptions = wpsList.map((w) => ({ value: w.id, label: w.wpsNo }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-lg font-semibold">WPS Weld Layer</h1>

      <section className="space-y-2">
        <details className="card">
          <summary className="section-title cursor-pointer select-none">+ Add Weld Layer</summary>
          <form action={createWpsWeldLayerAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <SelectField label="WPS" name="wpsId" required options={wpsOptions} />
            <Field label="Layer Number" name="layerNumber" type="number" required />
            <Field label="Layer Name" name="layerName" />
            <Field label="Welding Process" name="weldingProcess" />
            <Field label="Filler Metal Class" name="fillerMetalClass" />
            <Field label="Filler Metal Diameter" name="fillerMetalDiameter" />
            <Field label="Current Type" name="currentType" />
            <Field label="Travel Speed" name="travelSpeed" />
            <Field label="Remarks" name="remarks" />
            <div className="lg:col-span-4">
              <button type="submit" className="btn-primary">Save Weld Layer</button>
            </div>
          </form>
        </details>

        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>WPS</th>
                <th>Layer #</th>
                <th>Layer Name</th>
                <th>Process</th>
                <th>Filler Class</th>
                <th>Current Type</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={6} className="text-center text-slate-400 py-6">No records found.</td></tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.wps.wpsNo}</td>
                  <td>{r.layerNumber}</td>
                  <td>{r.layerName ?? "-"}</td>
                  <td>{r.weldingProcess ?? "-"}</td>
                  <td>{r.fillerMetalClass ?? "-"}</td>
                  <td>{r.currentType ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
