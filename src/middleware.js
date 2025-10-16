import { NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt"; // adjust the path

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ["/dashboard", "/settings", "/profile"];
  const guestRoutes = ["/login", "/signup", "/"];

  // Verify token (only if it exists)
  const validUser = token ? verifyToken(token) : null;

  // Redirect unauthenticated users from protected routes
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !validUser) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from guest routes
  if (guestRoutes.includes(pathname) && validUser) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
    "/",
  ],
};
