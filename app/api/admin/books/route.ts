import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readBooks, writeBooks, writePublicFile } from "@/lib/admin-storage";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const form = await request.formData(); const books = await readBooks();
    const title = String(form.get("title") || "").trim(); const slug = String(form.get("slug") || "").trim().toLowerCase();
    if (!title || !/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: "عنوان و نامک انگلیسی معتبر لازم است" }, { status: 400 });
    if (books.some((item: any) => item.slug === slug)) return NextResponse.json({ error: "این نامک قبلاً استفاده شده است" }, { status: 409 });
    const cover = form.get("cover"); const pdf = form.get("pdf");
    if (!(cover instanceof File) || cover.size === 0 || !(pdf instanceof File) || pdf.size === 0) return NextResponse.json({ error: "کاور و PDF لازم است" }, { status: 400 });
    const coverExt = cover.type.includes("png") ? "png" : "jpg";
    await writePublicFile(`public/covers/${slug}.${coverExt}`, Buffer.from(await cover.arrayBuffer()), `Admin: add cover for ${slug}`);
    await writePublicFile(`public/pdfs/${slug}.pdf`, Buffer.from(await pdf.arrayBuffer()), `Admin: add PDF for ${slug}`);
    const nextOrder = Math.max(0, ...books.map((item: any) => Number(item.order || 0))) + 1;
    const archiveId = String(form.get("archiveId") || "").trim() || `MS-B${String(nextOrder).padStart(3, "0")}`;
    const book = { slug, title, kind: String(form.get("kind") || "مجموعه شعر"), year: String(form.get("year") || ""), cover: `/covers/${slug}.${coverExt}`, pdf: `/pdfs/${slug}.pdf`, pageCount: Number(form.get("pageCount") || 0), description: String(form.get("description") || ""), poemCount: 0, poems: [], contentStatus: "reviewed", isPublished: true, publisher: String(form.get("publisher") || ""), editor: String(form.get("editor") || ""), coverDesigner: String(form.get("coverDesigner") || ""), firstEdition: String(form.get("firstEdition") || ""), isbn: String(form.get("isbn") || ""), titleMode: String(form.get("titleMode") || "numbered"), archiveId, order: nextOrder, publicationLabel: String(form.get("firstEdition") || form.get("year") || "") };
    books.push(book); await writeBooks(books, `Admin: add book ${slug}`);
    return NextResponse.json({ ok: true, book, deploymentPending: Boolean(process.env.GITHUB_TOKEN) });
  } catch (error) { console.error("Failed to add book", error); return NextResponse.json({ error: error instanceof Error ? error.message : "Create failed" }, { status: 500 }); }
}
