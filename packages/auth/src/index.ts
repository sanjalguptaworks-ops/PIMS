import { SignJWT, jwtVerify } from "jose";

export type UserRole = "CLIENT" | "CONTRACTOR_ADMIN" | "ENTRY_USER" | "REPORTING_USER";

export type AppName = "entry" | "reporting";

/** Which roles may sign in to which app. CLIENT and CONTRACTOR_ADMIN see both. */
const APP_ACCESS: Record<AppName, UserRole[]> = {
  entry: ["CLIENT", "CONTRACTOR_ADMIN", "ENTRY_USER"],
  reporting: ["CLIENT", "CONTRACTOR_ADMIN", "REPORTING_USER"],
};

export function canAccessApp(role: UserRole, app: AppName): boolean {
  return APP_ACCESS[app].includes(role);
}

export function isAdminRole(role: UserRole): boolean {
  return role === "CLIENT" || role === "CONTRACTOR_ADMIN";
}

// ---------------------------------------------------------------------------
// Sessions (JWT in an httpOnly cookie). This file must stay Edge-runtime safe
// (no bcrypt/Node APIs) since it's imported from Next.js middleware.
// Password hashing lives in "@pims/auth/password" instead.
// ---------------------------------------------------------------------------

export interface SessionPayload {
  userId: string;
  username: string;
  name: string;
  role: UserRole;
  companyId: string | null;
  [key: string]: unknown;
}

const alg = "HS256";

function getSecretKey(secret: string) {
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload, secret: string, expiresIn = "12h") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecretKey(secret));
}

export async function verifySession(token: string, secret: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(secret));
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function sessionCookieName(app: AppName) {
  return app === "entry" ? "pims_entry_session" : "pims_reporting_session";
}
