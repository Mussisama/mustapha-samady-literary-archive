import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { url } = await request.json();
  const response = NextResponse.json({ ok: true, url });
  response.cookies.set("mustapha_preview", "1", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 30,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("mustapha_preview", "", { path: "/", maxAge: 0 });
  return response;
}
