import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readCriticism, writeCriticism } from "@/lib/admin-storage";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06ff]+/g, "-").replace(/^-+|-+$/g, "") || `criticism-${Date.now()}`;
}
export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const input = await request.json(); const items = await readCriticism();
    const title = String(input.title || "").trim(); const body = String(input.body || ""); const author = String(input.author || "").trim();
    if (!title || !body.trim() || !author) return NextResponse.json({ error: "عنوان، نام منتقد و متن نقد لازم است" }, { status: 400 });
    const baseSlug = slugify(title); let slug = baseSlug; let counter = 2;
    while (items.some((item: any) => item.slug === slug)) slug = `${baseSlug}-${counter++}`;
    const nextNumber = Math.max(0, ...items.map((item: any) => Number(String(item.id || "").match(/\d+$/)?.[0] || 0))) + 1;
    const item = { id: `criticism-${String(nextNumber).padStart(3, "0")}`, slug, title, subtitle: String(input.subtitle || ""), author, publishedDate: String(input.publishedDate || ""), body, excerpt: String(input.subtitle || body.replace(/\s+/g, " ").slice(0, 180)), relatedBook: String(input.relatedBook || ""), relatedPoem: "", status: input.status === "draft" ? "draft" : "published", seoTitle: String(input.seoTitle || "").trim(), seoDescription: String(input.seoDescription || "").trim() };
    items.push(item); await writeCriticism(items, `Admin: add criticism ${item.id}`);
    return NextResponse.json({ ok: true, item, deploymentPending: Boolean(process.env.GITHUB_TOKEN) });
  } catch (error) { console.error("Failed to add criticism", error); return NextResponse.json({ error: error instanceof Error ? error.message : "Create failed" }, { status: 500 }); }
}
