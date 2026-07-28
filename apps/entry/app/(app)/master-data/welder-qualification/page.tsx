import { prisma } from "@pims/db";
import { isAdminRole } from "@pims/auth";
import { requireAuth } from "@/lib/require-auth";
import { Field, SelectField } from "@/components/FormFields";
import { createWelderQualificationAction } from "./actions";

export default async function WelderQualificationPage() {
  const session = await requireAuth();
  const canCreate = isAdminRole(session.role);

  const [records, welders, wpsList] = await Promise.all([
    prisma.welderQualification.findMany({
      include: { welder: true, wps: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.welder.findMany({ orderBy: { welderCode: "asc" } }),
    prisma.wPS.findMany({ orderBy: { wpsNo: "asc" } }),
  ]);

  const welderOptions = welders.map((w) => ({ value: w.id, label: `${w.welderCode} - ${w.name}` }));
  const wpsOptions = wpsList.map((w) => ({ value: w.id, label: w.wpsNo }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-lg font-semibold">Welder Qualification</h1>

      <section className="space-y-2">
        {canCreate ? (
          <details className="card">
            <summary className="section-title cursor-pointer select-none">+ Add Qualification</summary>
            <form action={createWelderQualificationAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <SelectField label="Welder" name="welderId" required options={welderOptions} />
              <SelectField label="WPS" name="wpsId" options={wpsOptions} />
              <Field label="Qualified Date" name="qualifiedDate" type="date" />
              <Field label="Expiry Date" name="expiryDate" type="date" />
              <SelectField label="Result" name="result" options={[{ value: "Pass", label: "Pass" }, { value: "Fail", label: "Fail" }]} />
              <div className="lg:col-span-4">
                <button type="submit" className="btn-primary">Save Qualification</button>
              </div>
            </form>
          </details>
        ) : (
          <p className="text-xs text-slate-500">Only Client and Contractor Admin users can add Master Data records.</p>
        )}

        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Welder</th>
                <th>WPS</th>
                <th>Qualified Date</th>
                <th>Expiry Date</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-slate-400 py-6">No records found.</td>
                </tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.welder.welderCode} - {r.welder.name}</td>
                  <td>{r.wps?.wpsNo ?? "-"}</td>
                  <td>{r.qualifiedDate?.toLocaleDateString() ?? "-"}</td>
                  <td>{r.expiryDate?.toLocaleDateString() ?? "-"}</td>
                  <td>{r.result ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
