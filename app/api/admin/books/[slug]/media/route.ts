import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readBooks, writeBooks, writePublicFile } from "@/lib/admin-storage";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { slug } = await params;
    const form = await request.formData();
    const cover = form.get("cover");
    const pdf = form.get("pdf");

    const books = await readBooks();
    const index = books.findIndex((item: any) => item.slug === slug);
    if (index < 0) return NextResponse.json({ error: "Book not found" }, { status: 404 });

    if (cover instanceof File && cover.size > 0) {
      const ext = cover.type.includes("png") ? "png" : "jpg";
      const filename = `${slug}.${ext}`;
      const buffer = Buffer.from(await cover.arrayBuffer());
      await writePublicFile(`public/covers/${filename}`, buffer, `Admin: update cover for ${slug}`);
      books[index].cover = `/covers/${filename}`;
    }

    if (pdf instanceof File && pdf.size > 0) {
      const filename = `${slug}.pdf`;
      const buffer = Buffer.from(await pdf.arrayBuffer());
      await writePublicFile(`public/pdfs/${filename}`, buffer, `Admin: update PDF for ${slug}`);
      books[index].pdf = `/pdfs/${filename}`;
    }

    await writeBooks(books, `Admin: update media metadata for ${slug}`);
    return NextResponse.json({
      ok: true,
      book: books[index],
      deploymentPending: Boolean(process.env.GITHUB_TOKEN),
    });
  } catch (error) {
    console.error("Failed to upload book media", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
