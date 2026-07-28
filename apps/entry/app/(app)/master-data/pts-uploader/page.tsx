import { prisma } from "@pims/db";
import { isAdminRole } from "@pims/auth";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import PtsUploadForm from "./UploadForm";

export default async function PtsUploaderPage() {
  const session = await requireAuth();
  const canUpload = isAdminRole(session.role);
  const spread = await requireSpread();

  const [vendors, purchaseOrders] = await Promise.all([
    prisma.vendor.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.purchaseOrder.findMany({ include: { vendor: true }, orderBy: { poNumber: "asc" } }),
  ]);
  const vendorOptions = vendors.map((v) => ({ value: v.id, label: v.name }));
  const poOptions = purchaseOrders.map((p) => ({ value: p.id, label: `${p.poNumber} (${p.vendor.name})` }));

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold">PTS Uploader</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>
      <div className="card">
        {canUpload ? (
          <PtsUploadForm vendorOptions={vendorOptions} poOptions={poOptions} />
        ) : (
          <p className="p-4 text-xs text-slate-500">
            Only Client and Contractor Admin users can upload PTS sheets.
          </p>
        )}
      </div>
    </div>
  );
}
