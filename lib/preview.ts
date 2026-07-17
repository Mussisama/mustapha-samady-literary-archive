import { cookies } from "next/headers";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function isPreviewEnabled() {
  const store = await cookies();
  return store.get("mustapha_preview")?.value === "1" && (await isAdminAuthenticated());
}
