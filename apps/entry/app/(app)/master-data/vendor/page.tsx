import { prisma } from "@pims/db";
import { isAdminRole } from "@pims/auth";
import { requireAuth } from "@/lib/require-auth";
import { Field } from "@/components/FormFields";
import { createVendorAction } from "./actions";

export default async function VendorPage() {
  const session = await requireAuth();
  const canCreate = isAdminRole(session.role);

  const vendors = await prisma.vendor.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-lg font-semibold">Manage Vendor</h1>

      <section className="space-y-2">
        {canCreate ? (
          <details className="card">
            <summary className="section-title cursor-pointer select-none">+ Add Vendor</summary>
            <form action={createVendorAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Vendor Name" name="name" required />
              <Field label="Vendor Code" name="code" />
              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary">Save Vendor</button>
              </div>
            </form>
          </details>
        ) : (
          <p className="text-xs text-slate-500">
            Only Client and Contractor Admin users can create new vendors.
          </p>
        )}

        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 && (
                <tr><td colSpan={3} className="text-center text-slate-400 py-6">No records found.</td></tr>
              )}
              {vendors.map((v) => (
                <tr key={v.id}>
                  <td className="font-medium">{v.name}</td>
                  <td>{v.code ?? "-"}</td>
                  <td>{v.active ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
