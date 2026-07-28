"use client";

import { useActionState } from "react";
import { SelectField } from "@/components/FormFields";
import { uploadPtsSheetAction, type UploadResult } from "./actions";

const initial: UploadResult = { inserted: 0, skipped: 0, errors: [] };

const ITEM_CATEGORIES = ["Line Pipe", "Fitting", "Flange", "Valve", "Bend", "Coating Material", "Others"];

export default function PtsUploadForm({
  vendorOptions,
  poOptions,
}: {
  vendorOptions: { value: string; label: string }[];
  poOptions: { value: string; label: string }[];
}) {
  const [state, formAction, pending] = useActionState(uploadPtsSheetAction, initial);

  return (
    <form action={formAction} className="p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SelectField label="Vendor" name="vendorId" options={vendorOptions} />
        <SelectField label="Purchase Order" name="purchaseOrderId" options={poOptions} />
        <SelectField
          label="Item Category"
          name="itemCategory"
          options={ITEM_CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
      </div>
      <p className="text-sm text-slate-500">
        Upload the PTS sheet (.xlsx) using the standard template. Expected columns: Item No., Heat No., Length[m],
        ASL No, External/Internal Coating No. &amp; Date, Steel Grade, Nominal Diameter[inch], Nominal Wall
        Thickness[mm], Weight[Tonnes], Vendor, Plate/Coil No., Hot Bend Radius/Angle, Code of Manufacture, External
        Coating Type, Shipment Invoice/Date/Packing List details, Contract Line Item No., S.O. Line Item,
        Transportation Type, Inspection Release Certificate No., Item Code, Item Type.
      </p>
      <input type="file" name="file" accept=".xlsx,.xls,.csv" required className="text-sm" />
      <div>
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Uploading..." : "Upload File"}
        </button>
      </div>
      {(state.inserted > 0 || state.skipped > 0) && (
        <p className="text-sm text-slate-700">
          Inserted <strong>{state.inserted}</strong>, skipped <strong>{state.skipped}</strong> (duplicates or errors).
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
