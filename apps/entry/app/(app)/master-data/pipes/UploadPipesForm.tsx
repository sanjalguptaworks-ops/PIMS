"use client";

import { useActionState } from "react";
import { uploadPipesAction, type UploadResult } from "./actions";

const initial: UploadResult = { inserted: 0, skipped: 0, errors: [] };

export default function UploadPipesForm() {
  const [state, formAction, pending] = useActionState(uploadPipesAction, initial);

  return (
    <form action={formAction} className="p-4 space-y-3">
      <p className="text-sm text-slate-500">
        Upload pipe details in bulk using Excel (.xlsx). Expected columns: PipeNo, DisplayPipeNo, HeatNo, Length,
        Diameter, WallThickness, CoatingNo, BendDegree1, BendDegree2, BendTypeName1, BendTypeName2, CoilNo. In case
        of any pipe detail mismatch, the row is skipped and logged below.
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
