import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Next.js middleware demo — interview: auth gate before protected routes */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (searchParams.get("auth") === "required" && pathname.startsWith("/products")) {
    const token = request.cookies.get("interview-auth-token")?.value;
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/playground";
      url.searchParams.set("tab", "auth");
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products"],
};
