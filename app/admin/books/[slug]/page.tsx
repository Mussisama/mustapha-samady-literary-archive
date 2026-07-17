import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getBook, poems } from "@/lib/data";
import { BookEditor } from "./BookEditor";
import { poemDisplayLabel } from "@/lib/labels";

export default async function AdminBookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const entries = poems
    .filter(poem => poem.bookSlug === slug)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="admin-page">
      <div className="admin-heading-row">
        <div>
          <Link href="/admin/books">کتاب‌ها ←</Link>
          <h1>{book.title}</h1>
        </div>
        <Link className="admin-secondary" href={`/books/${book.slug}`} target="_blank">پیش‌نمایش کتاب</Link>
      </div>

      <BookEditor book={book} />

      <div className="admin-panel">
        <h2>شعرها و نوشته‌ها</h2>
        <div className="admin-poem-list">
          {entries.map((poem) => (
            <Link href={`/admin/poems/${poem.id}`} key={poem.id}>
              <span>{poemDisplayLabel(poem, book.titleMode)}</span>
              <small>{poem.status === "published" ? "منتشرشده" : "پیش‌نویس"}</small>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
