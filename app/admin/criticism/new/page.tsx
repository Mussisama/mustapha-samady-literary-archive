import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { books } from "@/lib/data";
import { NewCriticismForm } from "./NewCriticismForm";

export default async function NewCriticismPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return <div className="admin-page"><div className="admin-kicker">مدیریت محتوا</div><h1>افزودن نقد جدید</h1><NewCriticismForm books={books.map((book) => ({ slug: book.slug, title: book.title }))} /></div>;
}
