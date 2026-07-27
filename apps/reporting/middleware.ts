import { NextResponse, type NextRequest } from "next/server";
import { verifySession, sessionCookieName, canAccessApp } from "@pims/auth";

const PUBLIC_PATHS = ["/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(sessionCookieName("reporting"))?.value;
  const secret = process.env.SESSION_SECRET;
  const session = token && secret ? await verifySession(token, secret) : null;

  if (!session || !canAccessApp(session.role, "reporting")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/public|_next/static|_next/image|favicon.ico).*)"],
};
