import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { Field, TextAreaField } from "@/components/FormFields";
import RepeatingItems from "@/components/RepeatingItems";
import { createReceiptRegisterAction } from "./actions";

export default async function ReceiptRegisterPage() {
  await requireAuth();
  const spread = await requireSpread();

  const registers = await prisma.materialReceiptRegister.findMany({
    where: { spreadId: spread.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Material Receipt Register</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <details className="card" open>
        <summary className="section-title cursor-pointer select-none">General</summary>
        <form action={createReceiptRegisterAction} className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Material Receipt Voucher Number" name="voucherNumber" required />
            <Field label="Receive Date" name="receiveDate" type="date" />
            <Field label="Element" name="element" />
            <Field label="Inspector Name" name="inspectorName" />
            <Field label="Vehicle Number" name="vehicleNumber" />
            <Field label="Inbound Conformance" name="inboundConformance" />
            <Field label="Station From" name="stationFrom" />
            <Field label="Station To" name="stationTo" />
            <Field label="Item Category" name="itemCategory" />
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
                  { key: "goodsReceiptNumber", label: "Goods Receipt No" },
                  {
                    key: "receivedStatus",
                    label: "Received Status",
                    options: [
                      { value: "Accepted", label: "Accepted" },
                      { value: "Rejected", label: "Rejected" },
                    ],
                  },
                  { key: "damageType", label: "Damage Type" },
                  { key: "damageSize", label: "Damage Size" },
                  { key: "locationNumber", label: "Location No" },
                  { key: "damagedBy", label: "Damaged By" },
                  { key: "detailRemarks", label: "Detail Remarks" },
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
        <div className="section-title">Recent Receipt Vouchers</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Voucher No</th>
              <th>Receive Date</th>
              <th>Vehicle No</th>
              <th>Station From-To</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {registers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-slate-400 py-6">
                  No records found.
                </td>
              </tr>
            )}
            {registers.map((r) => (
              <tr key={r.id}>
                <td className="font-medium">{r.voucherNumber}</td>
                <td>{r.receiveDate?.toLocaleDateString() ?? "-"}</td>
                <td>{r.vehicleNumber ?? "-"}</td>
                <td>
                  {r.stationFrom ?? "-"} &rarr; {r.stationTo ?? "-"}
                </td>
                <td>{r.items.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
