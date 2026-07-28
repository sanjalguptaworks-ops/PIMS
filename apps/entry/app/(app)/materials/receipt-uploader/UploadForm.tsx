"use client";

import { useActionState } from "react";
import { uploadReceiptRegisterAction, type UploadResult } from "./actions";

const initial: UploadResult = { inserted: 0, skipped: 0, errors: [] };

export default function ReceiptUploadForm() {
  const [state, formAction, pending] = useActionState(uploadReceiptRegisterAction, initial);

  return (
    <form action={formAction} className="p-4 space-y-3">
      <p className="text-sm text-slate-500">
        Upload receipt vouchers in bulk using Excel (.xlsx). Expected columns: VoucherNumber, ReceiveDate, Element,
        InspectorName, VehicleNumber, InboundConformance, StationFrom, StationTo, ItemCategory, ItemNumber, HeatNo,
        Length, WallThickness, Diameter, GoodsReceiptNumber, ReceivedStatus. Rows sharing the same VoucherNumber
        become one voucher with multiple items.
      </p>
      <input type="file" name="file" accept=".xlsx,.xls,.csv" required className="text-sm" />
      <div>
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Uploading..." : "Upload File"}
        </button>
      </div>
      {(state.inserted > 0 || state.skipped > 0) && (
        <p className="text-sm text-slate-700">
          Inserted <strong>{state.inserted}</strong> vouchers, skipped <strong>{state.skipped}</strong>.
        </p>
      )}
      {state.errors.length > 0 && (
        <ul className="text-xs text-red-600 list-disc pl-5 max-h-32 overflow-y-auto">
          {state.errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
