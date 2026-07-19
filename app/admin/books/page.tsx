import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { books, poems } from "@/lib/data";

export default async function AdminBooksPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div className="admin-page">
      <div className="admin-heading-row"><h1>کتاب‌ها</h1><Link className="admin-primary" href="/admin/books/new">افزودن کتاب جدید</Link></div>
      <div className="admin-book-grid">
        {books.map((book) => (
          <Link className="admin-book-card" href={`/admin/books/${book.slug}`} key={book.slug}>
            <Image src={book.cover} alt={book.title} width={120} height={170} />
            <div>
              <h2>{book.title}</h2>
              <p>{book.contentModel === "silent-book" ? `${book.silentPageCount || 100} صفحه سکوت` : `${poems.filter(p => p.bookSlug === book.slug).length} عنوان`}</p>
              <small>{book.archiveId}</small>
              <span>{book.contentStatus === "reviewed" ? "بازبینی‌شده" : "نیازمند بازبینی"}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
