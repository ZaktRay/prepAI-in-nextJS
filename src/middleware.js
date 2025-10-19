import { NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function middleware(request) {

  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;
  
  const protectedRoutes = ["/dashboard", "/upload", "/test"];
  const guestRoutes = ["/login", "/signup",];

  const validUser = token ? verifyToken(token) : null;

  if (protectedRoutes.some(route => pathname.startsWith(route)) && !validUser) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }

  if (guestRoutes.some(route => pathname.startsWith(route)) && validUser) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/upload", "/test", "/login", "/signup", "/"],
  runtime: "nodejs"
};
