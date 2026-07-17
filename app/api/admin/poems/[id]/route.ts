import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readPoems, writePoems } from "@/lib/admin-storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const poems = await readPoems();
  const poem = poems.find((item: any) => item.id === id);
  if (!poem) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(poem);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const update = await request.json();
  const poems = await readPoems();
  const index = poems.findIndex((item: any) => item.id === id);
  if (index < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const safe = {
    title: String(update.title ?? poems[index].title),
    webTitle: String(update.webTitle ?? poems[index].webTitle ?? "").trim(),
    displayTitle: String(update.displayTitle ?? update.title ?? poems[index].displayTitle),
    body: String(update.body ?? poems[index].body),
    startPage: Number(update.startPage ?? poems[index].startPage),
    endPage: Number(update.endPage ?? poems[index].endPage),
    topics: Array.isArray(update.topics) ? update.topics : poems[index].topics,
    keywords: Array.isArray(update.keywords) ? update.keywords : poems[index].keywords,
    seoTitle: String(update.seoTitle ?? "").trim(),
    seoDescription: String(update.seoDescription ?? "").trim(),
    status: update.status === "draft" ? "draft" : "published",
  };

  poems[index] = {
    ...poems[index],
    ...safe,
    excerpt: safe.body.replace(/\s+/g, " ").slice(0, 180),
  };
  await writePoems(poems);
  return NextResponse.json({ ok: true, poem: poems[index] });
}
