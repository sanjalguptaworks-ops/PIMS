import { prisma } from "@pims/db";
import { isAdminRole } from "@pims/auth";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { Field } from "@/components/FormFields";
import { createAlignmentSheetAction } from "./actions";

export default async function AlignmentSheetPage() {
  const session = await requireAuth();
  const canCreate = isAdminRole(session.role);
  const spread = await requireSpread();

  const records = await prisma.alignmentSheet.findMany({
    where: { spreadId: spread.id },
    orderBy: { sheetNo: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Alignment Sheet</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <section className="space-y-2">
        {canCreate ? (
        <details className="card">
          <summary className="section-title cursor-pointer select-none">+ Add Alignment Sheet</summary>
          <form action={createAlignmentSheetAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Sheet No" name="sheetNo" required />
            <Field label="Description" name="description" />
            <div className="lg:col-span-4">
              <button type="submit" className="btn-primary">Save Alignment Sheet</button>
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
                <th>Sheet No</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={2} className="text-center text-slate-400 py-6">No records found.</td></tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.sheetNo}</td>
                  <td>{r.description ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
