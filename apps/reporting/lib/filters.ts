import "server-only";
import { prisma } from "@pims/db";

export async function getSpreadOptions() {
  return prisma.spread.findMany({
    include: { lineLoop: { include: { project: true } } },
    orderBy: [{ lineLoop: { project: { name: "asc" } } }, { name: "asc" }],
  });
}

/** Resolves the spread filter from a searchParams object; undefined means "all spreads". */
export function resolveSpreadFilter(spreadId?: string) {
  return spreadId ? { spreadId } : {};
}
