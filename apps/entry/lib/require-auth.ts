import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import type { SessionPayload } from "@pims/auth";

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
