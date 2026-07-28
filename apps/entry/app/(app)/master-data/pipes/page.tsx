import { prisma } from "@pims/db";
import { isAdminRole } from "@pims/auth";
import { requireAuth } from "@/lib/require-auth";
import { requireSpread } from "@/lib/spread";
import { Field } from "@/components/FormFields";
import { createPipeAction } from "./actions";
import UploadPipesForm from "./UploadPipesForm";

const PAGE_SIZE = 25;

export default async function PipesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await requireAuth();
  const canCreate = isAdminRole(session.role);
  const spread = await requireSpread();
  const { q = "", page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  const where = {
    spreadId: spread.id,
    ...(q
      ? {
          OR: [
            { pipeNo: { contains: q, mode: "insensitive" as const } },
            { heatNo: { contains: q, mode: "insensitive" as const } },
            { coatingNo: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, pipes] = await Promise.all([
    prisma.pipe.count({ where }),
    prisma.pipe.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Pipe Master</h1>
        <p className="text-sm text-slate-500">
          {spread.lineLoop.name} / {spread.name} &middot; {total.toLocaleString()} pipe joints
        </p>
      </div>

      {canCreate ? (
        <>
          <details className="card">
            <summary className="section-title cursor-pointer select-none">Upload Pipe Details (Bulk)</summary>
            <UploadPipesForm />
          </details>

          <details className="card">
            <summary className="section-title cursor-pointer select-none">+ Add Single Pipe</summary>
            <form action={createPipeAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Field label="Pipe No" name="pipeNo" required />
              <Field label="Display Pipe No" name="displayPipeNo" />
              <Field label="Heat No" name="heatNo" />
              <Field label="Length" name="length" type="number" step="any" />
              <Field label="Diameter" name="diameter" type="number" step="any" />
              <Field label="Wall Thickness" name="wallThickness" type="number" step="any" />
              <Field label="Coating No" name="coatingNo" />
              <Field label="Coil No" name="coilNo" />
              <div className="lg:col-span-4">
                <button type="submit" className="btn-primary">
                  Save Pipe
                </button>
              </div>
            </form>
          </details>
        </>
      ) : (
        <p className="text-xs text-slate-500">Only Client and Contractor Admin users can add Master Data records.</p>
      )}

      <div className="card">
        <form className="section-title flex items-center justify-between gap-2" action="/master-data/pipes">
          <span>Loaded Pipes</span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search Pipe No / Heat No / Coating No"
            className="field-input w-64 bg-white"
          />
        </form>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pipe No</th>
                <th>Display Pipe No</th>
                <th>Heat No</th>
                <th>Length</th>
                <th>Diameter</th>
                <th>Wall Thickness</th>
                <th>Coating No</th>
                <th>Bend 1</th>
                <th>Bend 2</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pipes.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center text-slate-400 py-6">
                    No Records Found...
                  </td>
                </tr>
              )}
              {pipes.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium">{p.pipeNo}</td>
                  <td>{p.displayPipeNo}</td>
                  <td>{p.heatNo ?? "-"}</td>
                  <td>{p.length ?? "-"}</td>
                  <td>{p.diameter ?? "-"}</td>
                  <td>{p.wallThickness ?? "-"}</td>
                  <td>{p.coatingNo ?? "-"}</td>
                  <td>{p.bendDegree1 ?? "-"}</td>
                  <td>{p.bendDegree2 ?? "-"}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-3 py-2 text-sm text-slate-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <a className="btn-secondary" href={`?q=${encodeURIComponent(q)}&page=${page - 1}`}>
                Prev
              </a>
            )}
            {page < totalPages && (
              <a className="btn-secondary" href={`?q=${encodeURIComponent(q)}&page=${page + 1}`}>
                Next
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
