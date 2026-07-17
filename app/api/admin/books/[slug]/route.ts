import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readBooks, writeBooks } from "@/lib/admin-storage";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  await writeBooks(books);
  return NextResponse.json({ ok: true, book: books[index] });
}
