import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@pims/db";

const COOKIE = "pims_entry_spread";

export async function getSelectedSpreadId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE)?.value ?? null;
}

export async function setSelectedSpreadId(spreadId: string) {
  const store = await cookies();
  store.set(COOKIE, spreadId, { path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function getSelectedSpread() {
  const id = await getSelectedSpreadId();
  if (!id) return null;
  return prisma.spread.findUnique({
    where: { id },
    include: { lineLoop: { include: { project: true } } },
  });
}

/** Redirects the caller to pick a spread if one isn't already selected. */
export async function requireSpread() {
  const spread = await getSelectedSpread();
  if (!spread) redirect("/select-spread");
  return spread;
}
