import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { Field, TextAreaField } from "@/components/FormFields";
import RepeatingItems from "@/components/RepeatingItems";
import { createReturnRegisterAction } from "./actions";

export default async function ReturnRegisterPage() {
  await requireAuth();
  const spread = await requireSpread();

  const registers = await prisma.materialReturnRegister.findMany({
    where: { spreadId: spread.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Material Return Register</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <details className="card" open>
        <summary className="section-title cursor-pointer select-none">General</summary>
        <form action={createReturnRegisterAction} className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Material Return Voucher Number" name="voucherNumber" required />
            <Field label="Return Date" name="returnDate" type="date" />
            <Field label="Element" name="element" />
            <Field label="Inspector Name" name="inspectorName" />
            <Field label="Vehicle Number" name="vehicleNumber" />
            <Field label="Outbound Conformance" name="outboundConformance" />
            <Field label="Station From" name="stationFrom" />
            <Field label="Station To" name="stationTo" />
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
                  { key: "remarks", label: "Remarks" },
                ]}
              />
            </div>
          </div>

          <TextAreaField label="Remarks" name="remarks" />

          <button type="submit" className="btn-primary">
            Save Report
          </button>
        </form>
      </details>

      <div className="card overflow-x-auto">
        <div className="section-title">Recent Return Vouchers</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Voucher No</th>
              <th>Return Date</th>
              <th>Vehicle No</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {registers.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-slate-400 py-6">
                  No records found.
                </td>
              </tr>
            )}
            {registers.map((r) => (
              <tr key={r.id}>
                <td className="font-medium">{r.voucherNumber}</td>
                <td>{r.returnDate?.toLocaleDateString() ?? "-"}</td>
                <td>{r.vehicleNumber ?? "-"}</td>
                <td>{r.items.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
