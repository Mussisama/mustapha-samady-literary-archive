import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readCriticism, writeCriticism } from "@/lib/admin-storage";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params; const update = await request.json(); const items = await readCriticism(); const index = items.findIndex((item: any) => item.id === id);
    if (index < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    items[index] = { ...items[index], title: String(update.title ?? items[index].title), subtitle: String(update.subtitle ?? items[index].subtitle), author: String(update.author ?? items[index].author), publishedDate: String(update.publishedDate ?? ""), body: String(update.body ?? items[index].body), status: update.status === "draft" ? "draft" : "published", seoTitle: String(update.seoTitle ?? "").trim(), seoDescription: String(update.seoDescription ?? "").trim() };
    const result = await writeCriticism(items, `Admin: update criticism ${id}`);
    return NextResponse.json({ ok: true, item: items[index], deploymentPending: Boolean(process.env.GITHUB_TOKEN), commitUrl: "commit" in result ? result.commit?.html_url : undefined });
  } catch (error) { console.error("Failed to save criticism", error); return NextResponse.json({ error: error instanceof Error ? error.message : "Save failed" }, { status: 500 }); }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const items = await readCriticism();
    const next = items.filter((item: any) => item.id !== id);
    if (next.length === items.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await writeCriticism(next, `Admin: delete criticism ${id}`);
    return NextResponse.json({ ok: true, deploymentPending: Boolean(process.env.GITHUB_TOKEN) });
  } catch (error) {
    console.error("Failed to delete criticism", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Delete failed" }, { status: 500 });
  }
}
