import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { Field, SelectField, TextAreaField } from "@/components/FormFields";
import RepeatingItems from "@/components/RepeatingItems";
import MultiSelectPicker from "@/components/MultiSelectPicker";
import { createDispatchRegisterAction } from "./actions";

const OUTBOUND_CONFORMANCE_OPTIONS = [
  { value: "Conforming", label: "Conforming" },
  { value: "Non-Conforming", label: "Non-Conforming" },
  { value: "N/A", label: "N/A" },
];

export default async function DispatchRegisterPage() {
  await requireAuth();
  const spread = await requireSpread();

  const [registers, inspectors, alignmentSheets, signatories] = await Promise.all([
    prisma.materialDispatchRegister.findMany({
      where: { spreadId: spread.id },
      include: { items: true, inspector: true, signatories: { include: { signatory: true } } },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    prisma.inspector.findMany({ orderBy: { name: "asc" } }),
    prisma.alignmentSheet.findMany({ where: { spreadId: spread.id }, orderBy: { sheetNo: "asc" } }),
    prisma.signatory.findMany({ where: { active: true }, include: { company: true }, orderBy: { name: "asc" } }),
  ]);

  const inspectorOptions = inspectors.map((i) => ({ value: i.id, label: i.name }));
  const stationOptions = alignmentSheets.map((a) => ({ value: a.sheetNo, label: a.sheetNo }));
  const signatoryOptions = signatories.map((s) => ({
    value: s.id,
    label: s.name,
    sublabel: s.designation ?? s.company.name,
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Material Dispatch Register</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <details className="card" open>
        <summary className="section-title cursor-pointer select-none">General</summary>
        <form action={createDispatchRegisterAction} className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Material Issue Voucher Number" name="voucherNumber" required />
            <Field label="Issue Date" name="issueDate" type="date" />
            <Field label="Element" name="element" />
            <SelectField label="Inspector Name" name="inspectorId" options={inspectorOptions} />
            <Field label="Vehicle Number" name="vehicleNumber" />
            <SelectField
              label="Outbound Conformance"
              name="outboundConformance"
              options={OUTBOUND_CONFORMANCE_OPTIONS}
              defaultValue="N/A"
            />
            <SelectField label="Station From" name="stationFrom" options={stationOptions} />
            <SelectField label="Station To" name="stationTo" options={stationOptions} />
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

          <div>
            <div className="section-title -mx-4 -mt-0">Signatory Details</div>
            <div className="p-0 pt-2">
              <MultiSelectPicker fieldName="signatoryIdsJson" label="Signatories" options={signatoryOptions} />
            </div>
          </div>

          <TextAreaField label="Remarks" name="remarks" />

          <button type="submit" className="btn-primary">
            Save Report
          </button>
        </form>
      </details>

      <div className="card overflow-x-auto">
        <div className="section-title">Recent Dispatch Vouchers</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Voucher No</th>
              <th>Issue Date</th>
              <th>Inspector</th>
              <th>Vehicle No</th>
              <th>Station From-To</th>
              <th>Items</th>
              <th>Signatories</th>
            </tr>
          </thead>
          <tbody>
            {registers.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-slate-400 py-6">
                  No records found.
                </td>
              </tr>
            )}
            {registers.map((r) => (
              <tr key={r.id}>
                <td className="font-medium">{r.voucherNumber}</td>
                <td>{r.issueDate?.toLocaleDateString() ?? "-"}</td>
                <td>{r.inspector?.name ?? "-"}</td>
                <td>{r.vehicleNumber ?? "-"}</td>
                <td>
                  {r.stationFrom ?? "-"} &rarr; {r.stationTo ?? "-"}
                </td>
                <td>{r.items.length}</td>
                <td>{r.signatories.map((s) => s.signatory.name).join(", ") || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
