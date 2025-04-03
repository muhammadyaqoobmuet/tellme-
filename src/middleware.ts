import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Get auth token
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SEC,
  });

  const { pathname } = request.nextUrl;
  const isAuthRoute =
    pathname === "/" ||
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/verify");

  const isDashboardRoute = pathname.startsWith("/dashboard");

  // Added console logs for debugging
  console.log(`Path: ${pathname}, Token exists: ${!!token}`);

  // If user is authenticated and visits public pages, redirect to dashboard
  if (token && isAuthRoute) {
    console.log(
      "Authenticated user trying to access public route, redirecting to dashboard"
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not authenticated and visits dashboard, redirect to signin
  if (!token && isDashboardRoute) {
    console.log(
      "Unauthenticated user trying to access dashboard, redirecting to signin"
    );
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Otherwise, allow the request to proceed
  return NextResponse.next();
}

// Ensure we're matching all the routes we need to protect or redirect
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
