import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { Field } from "@/components/FormFields";
import RepeatingItems from "@/components/RepeatingItems";
import { createDamageInspectionAction } from "./actions";

export default async function DamageInspectionPage() {
  await requireAuth();
  const spread = await requireSpread();

  const inspections = await prisma.materialDamageInspection.findMany({
    where: { spreadId: spread.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Damage Inspection</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <details className="card" open>
        <summary className="section-title cursor-pointer select-none">General</summary>
        <form action={createDamageInspectionAction} className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Receiving Location" name="receivingLocation" />
            <Field label="Material Report No" name="materialReportNo" />
            <Field label="Issue Date" name="issueDate" type="date" />
            <Field label="Inspector Name" name="inspectorName" />
          </div>

          <div>
            <div className="section-title -mx-4 -mt-0">Item Details</div>
            <div className="p-0 pt-2">
              <RepeatingItems
                fieldName="itemsJson"
                columns={[
                  { key: "itemNumber", label: "Item Number" },
                  { key: "heatNo", label: "Heat No" },
                  { key: "length", label: "Length", type: "number" },
                  { key: "wallThickness", label: "Wall Thickness", type: "number" },
                  { key: "diameter", label: "Diameter", type: "number" },
                  {
                    key: "coatingVisual",
                    label: "Coating Visual",
                    options: [
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                    ],
                  },
                  {
                    key: "bevelStatus",
                    label: "Bevel Status",
                    options: [
                      { value: "Yes", label: "OK" },
                      { value: "No", label: "Not OK" },
                    ],
                  },
                  {
                    key: "receivedStatus",
                    label: "Received Status",
                    options: [
                      { value: "Accepted", label: "Accepted" },
                      { value: "Rejected", label: "Rejected" },
                    ],
                  },
                  { key: "damagedBy", label: "Damaged By" },
                  { key: "remarks", label: "Remarks" },
                ]}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Save Report
          </button>
        </form>
      </details>

      <div className="card overflow-x-auto">
        <div className="section-title">Recent Damage Inspections</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Material Report No</th>
              <th>Receiving Location</th>
              <th>Issue Date</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {inspections.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-slate-400 py-6">
                  No records found.
                </td>
              </tr>
            )}
            {inspections.map((r) => (
              <tr key={r.id}>
                <td className="font-medium">{r.materialReportNo ?? "-"}</td>
                <td>{r.receivingLocation ?? "-"}</td>
                <td>{r.issueDate?.toLocaleDateString() ?? "-"}</td>
                <td>{r.items.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
