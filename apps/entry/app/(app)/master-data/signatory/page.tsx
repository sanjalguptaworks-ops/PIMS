import { prisma } from "@pims/db";
import { isAdminRole } from "@pims/auth";
import { requireAuth } from "@/lib/require-auth";
import { Field, SelectField } from "@/components/FormFields";
import { createSignatoryAction } from "./actions";

export default async function SignatoryPage() {
  const session = await requireAuth();
  const canCreate = isAdminRole(session.role);

  const [signatories, companies] = await Promise.all([
    prisma.signatory.findMany({ include: { company: true }, orderBy: { name: "asc" } }),
    prisma.company.findMany({ orderBy: { name: "asc" } }),
  ]);
  const companyOptions = companies.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-lg font-semibold">Manage Signatory</h1>

      <section className="space-y-2">
        {canCreate ? (
          <details className="card">
            <summary className="section-title cursor-pointer select-none">+ Add Signatory</summary>
            <form action={createSignatoryAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectField label="Company" name="companyId" required options={companyOptions} />
              <Field label="Name" name="name" required />
              <Field label="Designation" name="designation" />
              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary">Save Signatory</button>
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
                <th>Designation</th>
                <th>Company</th>
              </tr>
            </thead>
            <tbody>
              {signatories.length === 0 && (
                <tr><td colSpan={3} className="text-center text-slate-400 py-6">No records found.</td></tr>
              )}
              {signatories.map((s) => (
                <tr key={s.id}>
                  <td className="font-medium">{s.name}</td>
                  <td>{s.designation ?? "-"}</td>
                  <td>{s.company.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
