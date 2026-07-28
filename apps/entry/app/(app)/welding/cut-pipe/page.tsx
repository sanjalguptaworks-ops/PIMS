import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { Field, SelectField, TextAreaField } from "@/components/FormFields";
import RepeatingItems from "@/components/RepeatingItems";
import { createCutItemAction } from "./actions";

export default async function CutPipePage() {
  await requireAuth();
  const spread = await requireSpread();

  const [cutItems, pipes] = await Promise.all([
    prisma.cutItem.findMany({
      where: { spreadId: spread.id },
      include: { parentPipe: true, childItems: true },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    prisma.pipe.findMany({ where: { spreadId: spread.id }, orderBy: { pipeNo: "asc" } }),
  ]);

  const pipeOptions = pipes.map((p) => ({ value: p.id, label: p.pipeNo }));

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Cut Pipe</h1>
        <p className="text-sm text-slate-500">{spread.lineLoop.name} / {spread.name}</p>
      </div>

      <details className="card" open>
        <summary className="section-title cursor-pointer select-none">General</summary>
        <form action={createCutItemAction} className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <SelectField label="Parent Pipe (Item Number)" name="parentPipeId" required options={pipeOptions} />
            <Field label="Parent Item Length" name="parentItemLength" type="number" step="any" />
            <Field label="Diameter" name="diameter" type="number" step="any" />
            <Field label="Wall Thickness" name="wallThickness" type="number" step="any" />
            <Field label="Heat No" name="heatNo" />
            <Field label="Report Number" name="reportNumber" />
            <Field label="Report Date" name="reportDate" type="date" />
          </div>

          <div>
            <div className="section-title -mx-4 -mt-0">Child Items</div>
            <div className="p-0 pt-2">
              <RepeatingItems
                fieldName="childItemsJson"
                columns={[
                  { key: "childItemNumber", label: "Child Item Number" },
                  { key: "length", label: "Length", type: "number" },
                  { key: "originalBevel", label: "Original Bevel", options: [{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }] },
                  { key: "isBend", label: "Is Bend", options: [{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }] },
                  { key: "isScrap", label: "Is Scrap", options: [{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }] },
                ]}
              />
            </div>
          </div>

          <TextAreaField label="Remarks" name="remarks" />

          <button type="submit" className="btn-primary">
            Save Cut Item
          </button>
        </form>
      </details>

      <div className="card overflow-x-auto">
        <div className="section-title">Recent Cut Items</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Parent Pipe</th>
              <th>Heat No</th>
              <th>Report No</th>
              <th>Report Date</th>
              <th>Child Items</th>
            </tr>
          </thead>
          <tbody>
            {cutItems.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-slate-400 py-6">
                  No records found.
                </td>
              </tr>
            )}
            {cutItems.map((c) => (
              <tr key={c.id}>
                <td className="font-medium">{c.parentPipe.pipeNo}</td>
                <td>{c.heatNo ?? "-"}</td>
                <td>{c.reportNumber ?? "-"}</td>
                <td>{c.reportDate?.toLocaleDateString() ?? "-"}</td>
                <td>{c.childItems.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
