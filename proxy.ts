import { NextResponse, type NextRequest } from "next/server";
import { unsealData } from "iron-session";
import { getSessionOptions, SESSION_COOKIE_NAME, type SessionData } from "@/lib/session-config";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!cookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const { password } = getSessionOptions();
    const session = await unsealData<SessionData>(cookie, { password });
    if (!session.isAdmin || !session.userId) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
