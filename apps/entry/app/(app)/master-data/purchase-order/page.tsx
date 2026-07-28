import { prisma } from "@pims/db";
import { isAdminRole } from "@pims/auth";
import { requireAuth } from "@/lib/require-auth";
import { Field, SelectField } from "@/components/FormFields";
import { createPurchaseOrderAction } from "./actions";

export default async function PurchaseOrderPage() {
  const session = await requireAuth();
  const canCreate = isAdminRole(session.role);

  const [orders, vendors] = await Promise.all([
    prisma.purchaseOrder.findMany({ include: { vendor: true }, orderBy: { poNumber: "asc" } }),
    prisma.vendor.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);
  const vendorOptions = vendors.map((v) => ({ value: v.id, label: v.name }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-lg font-semibold">Manage Purchase Order</h1>

      <section className="space-y-2">
        {canCreate ? (
          <details className="card">
            <summary className="section-title cursor-pointer select-none">+ Add Purchase Order</summary>
            <form action={createPurchaseOrderAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectField label="Vendor" name="vendorId" required options={vendorOptions} />
              <Field label="PO Number" name="poNumber" required />
              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary">Save Purchase Order</button>
              </div>
            </form>
          </details>
        ) : (
          <p className="text-xs text-slate-500">
            Only Client and Contractor Admin users can create new purchase orders.
          </p>
        )}

        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Vendor</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={2} className="text-center text-slate-400 py-6">No records found.</td></tr>
              )}
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="font-medium">{o.poNumber}</td>
                  <td>{o.vendor.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
