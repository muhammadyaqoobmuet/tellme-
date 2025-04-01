import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SEC,
  });
  const { pathname } = request.nextUrl;

  // If user is authenticated and visits public pages, redirect to dashboard
  if (
    token &&
    (pathname === "/" ||
      pathname.startsWith("/signin") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not authenticated and visits /verify or /dashboard, redirect to signin
  if (
    !token &&
    (pathname.startsWith("/dashboard"))
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Otherwise, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signin", "/signup", "/verify/:path*", "/dashboard/:path*"],
};
