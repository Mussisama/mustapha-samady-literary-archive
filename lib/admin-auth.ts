import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "mustapha_admin_session";

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "development-only-secret";
}

export function createSessionToken() {
  return crypto.createHmac("sha256", secret()).update("mustapha-admin").digest("hex");
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  const expected = createSessionToken();
  if (!token || token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export async function requireAdmin() {
  return isAdminAuthenticated();
}

export const adminCookieName = COOKIE_NAME;
