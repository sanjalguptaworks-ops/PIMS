import { notFound } from "next/navigation";
import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { getNdtConfig, NDT_QUADRANTS } from "@/lib/ndtConfig";
import { Field, SelectField } from "@/components/FormFields";
import RepeatingItems from "@/components/RepeatingItems";
import { createNdtResultAction } from "../actions";

export default async function NdtMethodPage({ params }: { params: Promise<{ method: string }> }) {
  await requireAuth();
  const spread = await requireSpread();
  const { method } = await params;
  const config = getNdtConfig(method);
  if (!config) notFound();

  const [welders, results] = await Promise.all([
    prisma.welder.findMany({ where: { active: true }, orderBy: { welderCode: "asc" } }),
    prisma.nDTResult.findMany({
      where: { method: config.method, weld: { spreadId: spread.id } },
      include: { weld: true, defects: true },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
  ]);

  const action = createNdtResultAction.bind(null, config.slug);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold">{config.title}</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <div className="card">
        <div className="section-title">General</div>
        <form action={action} className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Report Number" name="reportNumber" />
            <Field label="Report Date" name="reportDate" type="date" />
          </div>

          <div className="section-title -mx-4">{config.title} Details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
            <Field label="Weld Number" name="weldNumber" required placeholder="Joint No" />
            <SelectField
              label="Result"
              name="overallResult"
              options={[
                { value: "ACCEPT", label: "Accept" },
                { value: "NOT_ACCEPT", label: "Not Accept" },
              ]}
            />
            <Field label="Location Taken" name="locationTaken" />
            <Field label="Location Result" name="locationResult" />
          </div>

          <div>
            <label className="field-label mb-1">Coverage (auto-generated per weld circumference)</label>
            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Degree</th>
                  </tr>
                </thead>
                <tbody>
                  {NDT_QUADRANTS.map((q) => (
                    <tr key={q.srNo}>
                      <td>{q.srNo}</td>
                      <td>
                        {q.degreeFrom.toFixed(4)}-{q.degreeTo.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="section-title -mx-4">Defects</div>
            <div className="p-0 pt-2">
              <RepeatingItems
                fieldName="defectsJson"
                columns={[
                  { key: "defLocationFrom", label: "Def. Location From", type: "number" },
                  { key: "defLocationTo", label: "Def. Location To", type: "number" },
                  { key: "defectLength", label: "Defect Length", type: "number" },
                  {
                    key: "result",
                    label: "Result",
                    options: [
                      { value: "Accept", label: "Accept" },
                      { value: "Reject", label: "Reject" },
                    ],
                  },
                  { key: "defectType", label: "Defect Type" },
                  {
                    key: "defectWelderId",
                    label: "Defect Welder",
                    options: welders.map((w) => ({ value: w.id, label: w.welderCode })),
                  },
                  { key: "depth", label: "Depth", type: "number" },
                  { key: "defectLayer", label: "Defect Layer" },
                  { key: "defectHeight", label: "Defect Height", type: "number" },
                  { key: "remarks", label: "Remarks" },
                ]}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Save Report
          </button>
        </form>
      </div>

      <div className="card overflow-x-auto">
        <div className="section-title">Recent Results</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Weld</th>
              <th>Result</th>
              <th>Defects</th>
              <th>Report Date</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-slate-400 py-6">
                  No records found.
                </td>
              </tr>
            )}
            {results.map((r) => (
              <tr key={r.id}>
                <td className="font-medium">{r.weld.jointNumber}</td>
                <td className={r.overallResult === "ACCEPT" ? "text-emerald-600" : "text-red-600"}>
                  {r.overallResult ?? "-"}
                </td>
                <td>{r.defects.length}</td>
                <td>{r.reportDate?.toLocaleDateString() ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
