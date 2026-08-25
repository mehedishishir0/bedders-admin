import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Paths that don't require authentication
  const publicPaths = ["/login", "/forgot-password", "/reset-password", "/register"];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If trying to access public path while logged in as admin, redirect to dashboard
  if (isPublicPath && token?.role === "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If trying to access protected paths while not logged in, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If trying to access protected paths but not an admin, deny access or redirect
  if (!isPublicPath && token && token.role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Config matching all paths except api, static assets, etc.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ],
};
