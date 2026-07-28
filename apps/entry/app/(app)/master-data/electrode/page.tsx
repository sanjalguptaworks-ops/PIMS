import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { Field, SelectField } from "@/components/FormFields";
import { createElectrodeAction } from "./actions";

export default async function ElectrodePage() {
  await requireAuth();

  const [records, companies] = await Promise.all([
    prisma.electrode.findMany({ include: { company: true }, orderBy: { type: "asc" } }),
    prisma.company.findMany({ orderBy: { name: "asc" } }),
  ]);
  const companyOptions = companies.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-lg font-semibold">Electrode</h1>

      <section className="space-y-2">
        <details className="card">
          <summary className="section-title cursor-pointer select-none">+ Add Electrode</summary>
          <form action={createElectrodeAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <SelectField label="Company" name="companyId" required options={companyOptions} />
            <Field label="Type" name="type" required />
            <Field label="Size" name="size" />
            <Field label="Classification" name="classification" />
            <div className="lg:col-span-4">
              <button type="submit" className="btn-primary">Save Electrode</button>
            </div>
          </form>
        </details>

        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Size</th>
                <th>Classification</th>
                <th>Company</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={4} className="text-center text-slate-400 py-6">No records found.</td></tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.type}</td>
                  <td>{r.size ?? "-"}</td>
                  <td>{r.classification ?? "-"}</td>
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
