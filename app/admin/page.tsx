import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { books, poems, topics, criticism } from "@/lib/data";
import { calculateSeoScore } from "@/lib/seo-score";

export default async function AdminDashboard() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const published = poems.filter((poem) => poem.status === "published");
  const drafts = poems.filter((poem) => poem.status === "draft");
  const scores = poems.map((poem) => calculateSeoScore(poem).score);
  const average = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;
  const seoReady = scores.filter((score) => score >= 80).length;

  return (
    <div className="admin-page">
      <div className="admin-kicker">Content Management System</div>
      <h1>داشبورد</h1>

      <div className="admin-stats admin-stats-five">
        <div><strong>{books.length}</strong><span>کتاب</span></div>
        <div><strong>{published.length}</strong><span>منتشرشده</span></div>
        <div><strong>{drafts.length}</strong><span>پیش‌نویس</span></div>
        <div><strong>{topics.length}</strong><span>موضوع</span></div>
        <div><strong>{average}</strong><span>میانگین SEO</span></div>
      </div>

      <div className="admin-dashboard-grid">
        <Link className="admin-dashboard-card" href="/admin/books">
          <span>کتاب‌ها</span>
          <strong>مدیریت اطلاعات، کاور، PDF و فهرست آثار</strong>
        </Link>

        <Link className="admin-dashboard-card" href="/admin/poems">
          <span>شعرها</span>
          <strong>ویرایش متن، وضعیت انتشار و متادیتا</strong>
        </Link>

        <Link className="admin-dashboard-card" href="/admin/criticism">
          <span>نقد و نظر</span>
          <strong>{criticism.length} نقد ثبت‌شده</strong>
        </Link>

        <Link className="admin-dashboard-card" href="/admin/seo">
          <span>SEO</span>
          <strong>{seoReady} صفحه از نظر SEO آماده‌اند</strong>
        </Link>

        <Link className="admin-dashboard-card" href="/" target="_blank">
          <span>وب‌سایت</span>
          <strong>مشاهده نسخه عمومی آرشیو</strong>
        </Link>
      </div>
    </div>
  );
}
