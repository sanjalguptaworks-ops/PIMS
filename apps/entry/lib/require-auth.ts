import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import { isAdminRole, type SessionPayload } from "@pims/auth";

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/** Master Data is a shared, foundational dataset — creation is restricted to
 * Client and Contractor Admin users so entry users can't introduce duplicate
 * or misspelled records that propagate into every downstream report. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (!isAdminRole(session.role)) {
    throw new Error("Only Client and Contractor Admin users can create Master Data records.");
  }
  return session;
}
