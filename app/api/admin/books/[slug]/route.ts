import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readBooks, readPoems, writeBooks } from "@/lib/admin-storage";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { slug } = await params;
    const update = await request.json();
    const books = await readBooks();
    const index = books.findIndex((item: any) => item.slug === slug);
    if (index < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const allowed = [
      "title", "description", "year", "publisher", "editor", "layoutDesigner",
      "coverDesigner", "firstEdition", "isbn", "titleMode"
    ];
    for (const key of allowed) {
      if (key in update) books[index][key] = update[key];
    }

    const result = await writeBooks(books, `Admin: update book ${slug}`);
    return NextResponse.json({
      ok: true,
      book: books[index],
      deploymentPending: Boolean(process.env.GITHUB_TOKEN),
      commitUrl: "commit" in result ? result.commit?.html_url : undefined,
    });
  } catch (error) {
    console.error("Failed to save book", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Save failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { slug } = await params;
    const poems = await readPoems();
    const poemCount = poems.filter((item: any) => item.bookSlug === slug).length;
    if (poemCount > 0) {
      return NextResponse.json({ error: `این کتاب هنوز ${poemCount} شعر دارد. ابتدا شعرهای آن را حذف کن.` }, { status: 409 });
    }
    const books = await readBooks();
    const next = books.filter((item: any) => item.slug !== slug);
    if (next.length === books.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await writeBooks(next, `Admin: delete book ${slug}`);
    return NextResponse.json({ ok: true, deploymentPending: Boolean(process.env.GITHUB_TOKEN) });
  } catch (error) {
    console.error("Failed to delete book", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Delete failed" }, { status: 500 });
  }
}
