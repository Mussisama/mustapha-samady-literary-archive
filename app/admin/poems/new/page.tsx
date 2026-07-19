import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { books } from "@/lib/data";
import { NewPoemForm } from "./NewPoemForm";

export default async function NewPoemPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return (
    <div className="admin-page">
      <div className="admin-kicker">مدیریت محتوا</div>
      <h1>افزودن شعر جدید</h1>
      <NewPoemForm books={books.map((book) => ({ slug: book.slug, title: book.title }))} />
    </div>
  );
}
