import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { Field, SelectField } from "@/components/FormFields";
import { createWelderAction, createInspectorAction } from "./actions";

export default async function WeldersPage() {
  await requireAuth();

  const [welders, inspectors, companies] = await Promise.all([
    prisma.welder.findMany({ include: { company: true }, orderBy: { welderCode: "asc" } }),
    prisma.inspector.findMany({ include: { company: true }, orderBy: { name: "asc" } }),
    prisma.company.findMany({ orderBy: { name: "asc" } }),
  ]);

  const companyOptions = companies.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-lg font-semibold">Manage Welders</h1>

      <section className="space-y-2">
        <details className="card">
          <summary className="section-title cursor-pointer select-none">+ Add Welder</summary>
          <form action={createWelderAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <SelectField label="Company" name="companyId" required options={companyOptions} />
            <Field label="Welder Code" name="welderCode" required />
            <Field label="Name" name="name" required />
            <Field label="Stamp No" name="stampNo" />
            <div className="lg:col-span-4">
              <button type="submit" className="btn-primary">
                Save Welder
              </button>
            </div>
          </form>
        </details>

        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Welder Code</th>
                <th>Name</th>
                <th>Stamp No</th>
                <th>Company</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {welders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-slate-400 py-6">
                    No records found.
                  </td>
                </tr>
              )}
              {welders.map((w) => (
                <tr key={w.id}>
                  <td className="font-medium">{w.welderCode}</td>
                  <td>{w.name}</td>
                  <td>{w.stampNo ?? "-"}</td>
                  <td>{w.company.name}</td>
                  <td>{w.active ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <details className="card">
          <summary className="section-title cursor-pointer select-none">+ Add Inspector</summary>
          <form action={createInspectorAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <SelectField label="Company" name="companyId" required options={companyOptions} />
            <Field label="Name" name="name" required />
            <Field label="Certification No" name="certificationNo" />
            <div className="lg:col-span-4">
              <button type="submit" className="btn-primary">
                Save Inspector
              </button>
            </div>
          </form>
        </details>

        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Certification No</th>
                <th>Company</th>
              </tr>
            </thead>
            <tbody>
              {inspectors.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-slate-400 py-6">
                    No records found.
                  </td>
                </tr>
              )}
              {inspectors.map((i) => (
                <tr key={i.id}>
                  <td className="font-medium">{i.name}</td>
                  <td>{i.certificationNo ?? "-"}</td>
                  <td>{i.company.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
