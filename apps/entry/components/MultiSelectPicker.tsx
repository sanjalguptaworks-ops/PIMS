"use client";

import { useState } from "react";

export interface PickerOption {
  value: string;
  label: string;
  sublabel?: string;
}

/** Reusable "pick from a master list, build a repeating list of references"
 * editor — e.g. attaching one or more Signatories to a voucher. Submits the
 * chosen ids as a JSON array alongside the rest of the form. */
export default function MultiSelectPicker({
  fieldName,
  label,
  options,
}: {
  fieldName: string;
  label: string;
  options: PickerOption[];
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  function add() {
    if (!draft || selected.includes(draft)) return;
    setSelected((s) => [...s, draft]);
    setDraft("");
  }

  function remove(id: string) {
    setSelected((s) => s.filter((v) => v !== id));
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={fieldName} value={JSON.stringify(selected)} />
      <label className="field-label">{label}</label>
      <div className="flex gap-2">
        <select className="field-input" value={draft} onChange={(e) => setDraft(e.target.value)}>
          <option value="">-Select-</option>
          {options
            .filter((o) => !selected.includes(o.value))
            .map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
                {o.sublabel ? ` (${o.sublabel})` : ""}
              </option>
            ))}
        </select>
        <button type="button" onClick={add} className="btn-secondary">
          Add
        </button>
      </div>
      {selected.length > 0 && (
        <ul className="text-sm space-y-1">
          {selected.map((id) => {
            const opt = options.find((o) => o.value === id);
            return (
              <li key={id} className="flex items-center justify-between border border-slate-200 rounded px-2 py-1">
                <span>
                  {opt?.label}
                  {opt?.sublabel ? ` (${opt.sublabel})` : ""}
                </span>
                <button type="button" onClick={() => remove(id)} className="text-red-600 text-xs hover:underline">
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
