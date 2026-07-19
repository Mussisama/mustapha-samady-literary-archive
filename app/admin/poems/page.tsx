import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { poems } from "@/lib/data";
import { calculateSeoScore } from "@/lib/seo-score";
import { poemDisplayLabel } from "@/lib/labels";
import { getBook } from "@/lib/data";

export default async function AdminPoemsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const entries = [...poems].sort((a, b) => {
    const bookCompare = a.bookTitle.localeCompare(b.bookTitle, "fa");
    return bookCompare || a.order - b.order;
  });

  return (
    <div className="admin-page">
      <div className="admin-heading-row">
        <div>
          <div className="admin-kicker">مدیریت محتوا</div>
          <h1>شعرها</h1>
        </div>
        <div className="admin-heading-actions"><Link className="admin-primary" href="/admin/poems/new">افزودن شعر جدید</Link><span className="admin-count">{entries.length} عنوان</span></div>
      </div>

      <div className="admin-table">
        <div className="admin-table-head">
          <span>عنوان</span>
          <span>کتاب</span>
          <span>وضعیت</span>
          <span>SEO</span>
        </div>

        {entries.map((poem) => {
          const score = calculateSeoScore(poem).score;
          return (
            <Link className="admin-table-row" href={`/admin/poems/${poem.id}`} key={poem.id}>
              <span>{poemDisplayLabel(poem, getBook(poem.bookSlug)?.titleMode)}</span>
              <span>{poem.bookTitle}</span>
              <span>{poem.status === "published" ? "منتشرشده" : "پیش‌نویس"}</span>
              <span className={score >= 80 ? "score-good" : "score-needs-work"}>{score}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
