import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { criticism } from "@/lib/data";

export default async function AdminCriticismPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return (
    <div className="admin-page">
      <div className="admin-heading-row"><div><div className="admin-kicker">مدیریت محتوا</div><h1>نقد و نظر</h1></div><div className="admin-heading-actions"><Link className="admin-primary" href="/admin/criticism/new">افزودن نقد جدید</Link><span className="admin-count">{criticism.length} نقد</span></div></div>
      <div className="admin-table">
        <div className="admin-table-head"><span>عنوان</span><span>منتقد</span><span>تاریخ</span><span>وضعیت</span></div>
        {criticism.map((item) => (
          <Link className="admin-table-row" href={`/admin/criticism/${item.id}`} key={item.id}>
            <span>{item.title}</span><span>{item.author}</span><span>{item.publishedDate || "—"}</span><span>{item.status === "published" ? "منتشرشده" : "پیش‌نویس"}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
