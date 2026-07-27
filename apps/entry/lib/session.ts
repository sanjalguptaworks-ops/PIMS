import "server-only";
import { cookies } from "next/headers";
import { signSession, verifySession, sessionCookieName, type SessionPayload } from "@pims/auth";

const APP = "entry" as const;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

export async function createSession(payload: SessionPayload) {
  const token = await signSession(payload, getSecret());
  const store = await cookies();
  store.set(sessionCookieName(APP), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(sessionCookieName(APP));
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(sessionCookieName(APP))?.value;
  if (!token) return null;
  return verifySession(token, getSecret());
}
