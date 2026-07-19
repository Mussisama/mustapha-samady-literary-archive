import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { NewBookForm } from "./NewBookForm";

export default async function NewBookPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return <div className="admin-page"><div className="admin-kicker">مدیریت محتوا</div><h1>افزودن کتاب جدید</h1><NewBookForm /></div>;
}
