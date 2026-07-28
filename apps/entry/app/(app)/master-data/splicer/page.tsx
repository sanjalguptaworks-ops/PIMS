import { prisma } from "@pims/db";
import { isAdminRole } from "@pims/auth";
import { requireAuth } from "@/lib/require-auth";
import { Field, SelectField } from "@/components/FormFields";
import { createSplicerAction } from "./actions";

export default async function SplicerPage() {
  const session = await requireAuth();
  const canCreate = isAdminRole(session.role);

  const [records, companies] = await Promise.all([
    prisma.splicer.findMany({ include: { company: true }, orderBy: { name: "asc" } }),
    prisma.company.findMany({ orderBy: { name: "asc" } }),
  ]);
  const companyOptions = companies.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-lg font-semibold">Splicer</h1>

      <section className="space-y-2">
        {canCreate ? (
        <details className="card">
          <summary className="section-title cursor-pointer select-none">+ Add Splicer</summary>
          <form action={createSplicerAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <SelectField label="Company" name="companyId" required options={companyOptions} />
            <Field label="Name" name="name" required />
            <div className="lg:col-span-4">
              <button type="submit" className="btn-primary">Save Splicer</button>
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
                <th>Name</th>
                <th>Company</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={2} className="text-center text-slate-400 py-6">No records found.</td></tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.name}</td>
                  <td>{r.company.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
