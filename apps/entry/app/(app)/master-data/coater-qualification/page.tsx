import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { Field, SelectField } from "@/components/FormFields";
import { createCoaterQualificationAction } from "./actions";

export default async function CoaterQualificationPage() {
  await requireAuth();

  const [records, companies] = await Promise.all([
    prisma.coaterQualification.findMany({ include: { company: true }, orderBy: { name: "asc" } }),
    prisma.company.findMany({ orderBy: { name: "asc" } }),
  ]);
  const companyOptions = companies.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-lg font-semibold">Coater Qualification</h1>

      <section className="space-y-2">
        <details className="card">
          <summary className="section-title cursor-pointer select-none">+ Add Coater Qualification</summary>
          <form action={createCoaterQualificationAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <SelectField label="Company" name="companyId" required options={companyOptions} />
            <Field label="Name" name="name" required />
            <Field label="Qualified Date" name="qualifiedDate" type="date" />
            <Field label="Expiry Date" name="expiryDate" type="date" />
            <div className="lg:col-span-4">
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </details>

        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Qualified Date</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={4} className="text-center text-slate-400 py-6">No records found.</td></tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.name}</td>
                  <td>{r.company.name}</td>
                  <td>{r.qualifiedDate?.toLocaleDateString() ?? "-"}</td>
                  <td>{r.expiryDate?.toLocaleDateString() ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
