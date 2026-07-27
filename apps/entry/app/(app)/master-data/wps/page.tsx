import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { Field, SelectField } from "@/components/FormFields";
import { createWpsAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function WpsPage() {
  await requireAuth();
  const spread = await requireSpread();

  const [wpsList, companies] = await Promise.all([
    prisma.wPS.findMany({
      where: { spreadId: spread.id },
      include: { company: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.company.findMany({ where: { type: "CONTRACTOR" }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Manage WPS</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <details className="card">
        <summary className="section-title cursor-pointer select-none">+ Add WPS</summary>
        <form action={createWpsAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Field label="WPS No" name="wpsNo" required />
          <SelectField label="Company" name="companyId" required options={companies.map((c) => ({ value: c.id, label: c.name }))} />
          <Field label="Welding Progression" name="weldingProgression" placeholder="Downhill / Uphill" />
          <Field label="Welding Process" name="weldingProcess" placeholder="SMAW" />
          <Field label="Joint Version Group" name="jointVersionGroup" />
          <Field label="Joint Type Group" name="jointTypeGroup" placeholder="Girth Weld" />
          <Field label="Diameter From" name="diameterFrom" type="number" step="any" />
          <Field label="Diameter To" name="diameterTo" type="number" step="any" />
          <Field label="Wall Thickness From" name="wallThicknessFrom" type="number" step="any" />
          <Field label="Wall Thickness To" name="wallThicknessTo" type="number" step="any" />
          <Field label="Material Grade From" name="materialGradeFrom" placeholder="API 5L X70" />
          <Field label="Material Grade To" name="materialGradeTo" placeholder="API 5L X70" />
          <Field label="Pipe Vendor From" name="pipeVendorFrom" />
          <Field label="Pipe Vendor To" name="pipeVendorTo" />
          <Field label="Steel Mill Vendor From" name="steelMillVendorFrom" />
          <Field label="Steel Mill Vendor To" name="steelMillVendorTo" />
          <Field label="No Of Welders" name="noOfWelders" type="number" />
          <div className="lg:col-span-4">
            <button type="submit" className="btn-primary">
              Save WPS
            </button>
          </div>
        </form>
      </details>

      <div className="card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>WPS No</th>
              <th>Company</th>
              <th>Process</th>
              <th>Progression</th>
              <th>Joint Type</th>
              <th>Dia. From-To</th>
              <th>WT From-To</th>
              <th>Material Grade</th>
              <th>No. of Welders</th>
            </tr>
          </thead>
          <tbody>
            {wpsList.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-slate-400 py-6">
                  No records found.
                </td>
              </tr>
            )}
            {wpsList.map((w) => (
              <tr key={w.id}>
                <td className="font-medium">{w.wpsNo}</td>
                <td>{w.company.name}</td>
                <td>{w.weldingProcess ?? "-"}</td>
                <td>{w.weldingProgression ?? "-"}</td>
                <td>{w.jointTypeGroup ?? "-"}</td>
                <td>
                  {w.diameterFrom ?? "-"}–{w.diameterTo ?? "-"}
                </td>
                <td>
                  {w.wallThicknessFrom ?? "-"}–{w.wallThicknessTo ?? "-"}
                </td>
                <td>
                  {w.materialGradeFrom ?? "-"}
                  {w.materialGradeTo && w.materialGradeTo !== w.materialGradeFrom ? `–${w.materialGradeTo}` : ""}
                </td>
                <td>{w.noOfWelders ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

