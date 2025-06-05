import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/products");

  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    if (request.nextUrl.pathname !== "/products") {
      url.searchParams.set("redirectTo", request.nextUrl.pathname);
    }
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/products", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/login"],
};
