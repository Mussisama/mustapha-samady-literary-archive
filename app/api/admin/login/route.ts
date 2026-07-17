import { NextResponse } from "next/server";
import { adminCookieName, createSessionToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const configured = process.env.ADMIN_PASSWORD;

  if (!configured) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD در فایل .env.local تنظیم نشده است." },
      { status: 500 }
    );
  }

  if (body.password !== configured) {
    return NextResponse.json({ error: "رمز عبور نادرست است." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, createSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
