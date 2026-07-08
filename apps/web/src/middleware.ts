import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Next.js Middleware — interview: auth gate, security headers, redirects at the edge */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:4000 ws://localhost:4000"
  );

  const protectedPaths = ["/admin"];
  const token = request.cookies.get("auth_token")?.value;

  if (protectedPaths.some((p) => request.nextUrl.pathname.startsWith(p)) && !token) {
    const login = new URL("/", request.url);
    login.searchParams.set("auth", "required");
    return NextResponse.redirect(login);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
