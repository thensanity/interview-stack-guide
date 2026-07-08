import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/** BFF Route Handler — interview: hide API URL, attach server-side headers */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = `${API_URL}/${path.join("/")}${request.nextUrl.search}`;

  const res = await fetch(target, {
    headers: {
      Authorization: request.headers.get("authorization") ?? "",
    },
    cache: "no-store",
  });

  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = `${API_URL}/${path.join("/")}`;
  const body = await request.text();

  const res = await fetch(target, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: request.headers.get("authorization") ?? "",
    },
    body,
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}
