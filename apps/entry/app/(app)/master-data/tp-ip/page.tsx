import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { Field } from "@/components/FormFields";
import { createTPIPAction } from "./actions";

export default async function TPIPPage() {
  await requireAuth();
  const spread = await requireSpread();

  const records = await prisma.tPIP.findMany({
    where: { spreadId: spread.id },
    orderBy: { id: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold">TP / IP</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <section className="space-y-2">
        <details className="card">
          <summary className="section-title cursor-pointer select-none">+ Add TP / IP</summary>
          <form action={createTPIPAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="TP No" name="tpNo" />
            <Field label="IP No" name="ipNo" />
            <Field label="Description" name="description" />
            <div className="lg:col-span-4">
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </details>

        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>TP No</th>
                <th>IP No</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={3} className="text-center text-slate-400 py-6">No records found.</td></tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.tpNo ?? "-"}</td>
                  <td>{r.ipNo ?? "-"}</td>
                  <td>{r.description ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
