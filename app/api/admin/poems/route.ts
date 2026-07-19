import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readBooks, readPoems, writeBooks, writePoems } from "@/lib/admin-storage";

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const input = await request.json();
    const books = await readBooks();
    const poems = await readPoems();
    const book = books.find((item: any) => item.slug === String(input.bookSlug || ""));
    if (!book) return NextResponse.json({ error: "کتاب انتخاب‌شده پیدا نشد" }, { status: 400 });
    const bookPoems = poems.filter((item: any) => item.bookSlug === book.slug);
    const nextOrder = Math.max(0, ...bookPoems.map((item: any) => Number(item.order || 0))) + 1;
    const width = Math.max(2, String(Math.max(nextOrder, Number(book.poemCount || 0))).length);
    const displayNumber = String(nextOrder).padStart(width, "0");
    const slug = displayNumber;
    const id = `${book.slug}-${slug}`;
    if (poems.some((item: any) => item.id === id)) return NextResponse.json({ error: "شناسه شعر تکراری است" }, { status: 409 });
    const body = String(input.body || "");
    if (!body.trim()) return NextResponse.json({ error: "متن شعر خالی است" }, { status: 400 });
    const title = String(input.title || displayNumber);
    const poem = {
      id, slug, number: nextOrder, displayNumber, title,
      body,
      excerpt: body.replace(/\s+/g, " ").slice(0, 180),
      startPage: Number(input.startPage || 1),
      endPage: Number(input.endPage || input.startPage || 1),
      page: Number(input.startPage || 1),
      bookSlug: book.slug,
      bookTitle: book.title,
      kind: book.kind || "مجموعه شعر",
      topics: Array.isArray(input.topics) ? input.topics : [],
      keywords: Array.isArray(input.keywords) ? input.keywords : ["Mustapha Samady", "مصطفی صمدی", book.title],
      status: input.status === "draft" ? "draft" : "published",
      language: "fa",
      genre: "شعر سپید",
      order: nextOrder,
      displayTitle: title,
      seoTitle: String(input.seoTitle || "").trim(),
      seoDescription: String(input.seoDescription || "").trim(),
      webTitle: String(input.webTitle || "").trim(),
    };
    poems.push(poem);
    await writePoems(poems, `Admin: add poem ${id}`);
    const bookIndex = books.findIndex((item: any) => item.slug === book.slug);
    books[bookIndex].poemCount = bookPoems.length + 1;
    books[bookIndex].poems = [...(Array.isArray(books[bookIndex].poems) ? books[bookIndex].poems : []), slug];
    await writeBooks(books, `Admin: update book count after adding ${id}`);
    return NextResponse.json({ ok: true, poem, deploymentPending: Boolean(process.env.GITHUB_TOKEN) });
  } catch (error) {
    console.error("Failed to add poem", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Create failed" }, { status: 500 });
  }
}
