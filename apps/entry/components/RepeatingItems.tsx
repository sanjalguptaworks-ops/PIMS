"use client";

import { useState } from "react";

export interface ItemColumn {
  key: string;
  label: string;
  type?: "text" | "number";
  options?: { value: string; label: string }[];
}

/**
 * Reusable "voucher header + repeating item lines" editor, matching the
 * pattern used across the Materials registers (Dispatch/Receipt/Damage/Return):
 * add rows client-side, then submit everything as one JSON blob alongside the
 * header fields so the server action can create the header + items together.
 */
export default function RepeatingItems({
  fieldName,
  columns,
}: {
  fieldName: string;
  columns: ItemColumn[];
}) {
  const emptyDraft = Object.fromEntries(columns.map((c) => [c.key, ""]));
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [draft, setDraft] = useState<Record<string, string>>(emptyDraft);

  function addRow() {
    if (!draft[columns[0].key]) return;
    setRows((r) => [...r, draft]);
    setDraft(emptyDraft);
  }

  function removeRow(idx: number) {
    setRows((r) => r.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={fieldName} value={JSON.stringify(rows)} />

      <div className="overflow-x-auto border border-slate-200 rounded">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="text-center text-slate-400 py-3">
                  No items added yet.
                </td>
              </tr>
            )}
            {rows.map((row, idx) => (
              <tr key={idx}>
                {columns.map((c) => (
                  <td key={c.key}>{row[c.key]}</td>
                ))}
                <td>
                  <button type="button" onClick={() => removeRow(idx)} className="text-red-600 text-xs hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-slate-50">
              {columns.map((c) => (
                <td key={c.key}>
                  {c.options ? (
                    <select
                      className="field-input"
                      value={draft[c.key]}
                      onChange={(e) => setDraft((d) => ({ ...d, [c.key]: e.target.value }))}
                    >
                      <option value="">-Select-</option>
                      {c.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="field-input"
                      type={c.type ?? "text"}
                      value={draft[c.key]}
                      onChange={(e) => setDraft((d) => ({ ...d, [c.key]: e.target.value }))}
                    />
                  )}
                </td>
              ))}
              <td>
                <button type="button" onClick={addRow} className="btn-secondary">
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
