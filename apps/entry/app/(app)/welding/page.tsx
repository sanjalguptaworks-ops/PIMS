import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { Field, SelectField, RadioField, TextAreaField } from "@/components/FormFields";
import { createWeldAction } from "./actions";

export default async function WeldingPage() {
  await requireAuth();
  const spread = await requireSpread();

  const [wpsList, welders, electrodeBatches, welds] = await Promise.all([
    prisma.wPS.findMany({ where: { spreadId: spread.id }, orderBy: { wpsNo: "asc" } }),
    prisma.welder.findMany({ where: { active: true }, orderBy: { welderCode: "asc" } }),
    prisma.electrodeBatch.findMany({ include: { electrode: true }, orderBy: { batchNo: "asc" }, take: 100 }),
    prisma.weld.findMany({
      where: { spreadId: spread.id },
      include: { upstreamPipe: true, downstreamPipe: true, wps: true, welders: { include: { welder: true } }, ndtResults: true },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Welding</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <div className="card">
        <div className="section-title">General</div>
        <form action={createWeldAction} className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Report Number" name="reportNumber" required />
            <Field label="Report Date" name="reportDate" type="date" />
            <Field label="RFI Number" name="rfiNumber" />
            <Field label="Mile Post" name="milePost" />
            <Field label="Weather Condition" name="weatherCondition" />
          </div>

          <div className="section-title -mx-4">Weld Details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <SelectField label="WPS Number" name="wpsId" options={wpsList.map((w) => ({ value: w.id, label: w.wpsNo }))} />
            <Field label="Weld Number (Joint No)" name="jointNumber" required />
            <Field label="Weld Type" name="weldType" />
            <Field label="Weld Version" name="weldVersion" />
            <Field label="Upstream Item Number" name="upstreamItemNumber" placeholder="Pipe No" />
            <Field label="Downstream Item Number" name="downstreamItemNumber" placeholder="Pipe No" />
            <Field label="Station From" name="stationFrom" type="number" step="any" />
            <Field label="Chainage To" name="chainageTo" type="number" step="any" />
            <Field label="Weld Position" name="weldPosition" />
            <Field label="Weld Direction" name="weldDirection" />
            <Field label="Re Routing" name="reRouting" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <RadioField
              label="Visual Check"
              name="visualCheck"
              defaultValue="OK"
              options={[
                { value: "OK", label: "OK" },
                { value: "NOT_OK", label: "Not OK" },
              ]}
            />
            <RadioField
              label="Production Weld"
              name="productionWeld"
              defaultValue="Yes"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />
            <RadioField
              label="Gauging"
              name="gaugingDone"
              defaultValue="Done"
              options={[
                { value: "Done", label: "Done" },
                { value: "Not Done", label: "Not Done" },
              ]}
            />
            <RadioField
              label="Swabbing"
              name="swabbingDone"
              defaultValue="Done"
              options={[
                { value: "Done", label: "Done" },
                { value: "Not Done", label: "Not Done" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Coordinates X" name="coordX" type="number" step="any" />
            <Field label="Coordinates Y" name="coordY" type="number" step="any" />
            <Field label="Coordinates Z" name="coordZ" type="number" step="any" />
            <Field label="Pre-Heating" name="preHeating" />
            <Field label="Interpass Temp" name="interpassTemp" />
          </div>

          <div className="section-title -mx-4">Backweld</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <RadioField
              label="Backweld Done"
              name="backweldDone"
              defaultValue="No"
              options={[
                { value: "Yes", label: "Done" },
                { value: "No", label: "Not Done" },
              ]}
            />
            <Field label="Location (Clock Position)" name="backweldLocation" />
            <Field label="Length" name="backweldLength" type="number" step="any" />
          </div>

          <div className="section-title -mx-4">Welder &amp; Electrode Details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="field-label">Welders</label>
              <select name="welderIds" multiple className="field-input h-28">
                {welders.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.welderCode} — {w.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">Ctrl/Cmd-click to select multiple welders.</p>
            </div>
            <SelectField
              label="Electrode Batch"
              name="electrodeBatchId"
              options={electrodeBatches.map((b) => ({
                value: b.id,
                label: `${b.electrode.type} — ${b.batchNo}`,
              }))}
            />
          </div>

          <TextAreaField label="Remarks" name="remarks" />

          <button type="submit" className="btn-primary">
            Save Weld
          </button>
        </form>
      </div>

      <div className="card overflow-x-auto">
        <div className="section-title">Recent Welds</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Joint No</th>
              <th>WPS</th>
              <th>Upstream</th>
              <th>Downstream</th>
              <th>Welders</th>
              <th>Visual</th>
              <th>NDT</th>
            </tr>
          </thead>
          <tbody>
            {welds.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-slate-400 py-6">
                  No records found.
                </td>
              </tr>
            )}
            {welds.map((w) => (
              <tr key={w.id}>
                <td className="font-medium">{w.jointNumber}</td>
                <td>{w.wps?.wpsNo ?? "-"}</td>
                <td>{w.upstreamPipe?.pipeNo ?? "-"}</td>
                <td>{w.downstreamPipe?.pipeNo ?? "-"}</td>
                <td>{w.welders.map((x) => x.welder.welderCode).join(", ") || "-"}</td>
                <td>
                  <span
                    className={
                      w.visualCheck === "OK"
                        ? "text-emerald-600"
                        : w.visualCheck === "NOT_OK"
                          ? "text-red-600"
                          : "text-slate-400"
                    }
                  >
                    {w.visualCheck ?? "-"}
                  </span>
                </td>
                <td>{w.ndtResults.length > 0 ? w.ndtResults.map((n) => n.method).join(", ") : "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
