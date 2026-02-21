import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { getRoleFromEmail } from "@/lib/utils";

const PROTECTED_PREFIXES = ["/student", "/alumni", "/admin"] as const;

function getRoleFromPath(pathname: string): "student" | "alumni" | "admin" | null {
  if (pathname.startsWith("/student")) return "student";
  if (pathname.startsWith("/alumni")) return "alumni";
  if (pathname.startsWith("/admin")) return "admin";
  return null;
}

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const { response, claims } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  if (!isProtected(pathname)) {
    return response;
  }

  const email = (claims?.email as string | undefined) ?? "";
  if (!email) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = getRoleFromEmail(email);
  const pathRole = getRoleFromPath(pathname);

  if (!userRole || !pathRole) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (userRole !== pathRole) {
    const dashboard =
      userRole === "student" ? "/student" : userRole === "alumni" ? "/alumni" : "/admin";
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  return response;
}

// Match all routes that may use Supabase so session is refreshed (per docs)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
