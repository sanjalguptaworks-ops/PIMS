import { prisma } from "@pims/db";
import { requireAuth } from "@/lib/require-auth";
import SpreadPicker from "./SpreadPicker";

export default async function SelectSpreadPage() {
  await requireAuth();

  const projects = await prisma.project.findMany({
    include: {
      lineLoops: {
        include: { spreads: true },
        orderBy: { name: "asc" },
      },
      clientCompany: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="card p-6">
        <h1 className="text-lg font-semibold mb-1">Select Line Loop / Spread</h1>
        <p className="text-sm text-slate-500 mb-6">
          All data entry is scoped to a project spread. Choose one to continue.
        </p>
        <SpreadPicker projects={projects} />
      </div>
    </div>
  );
}
