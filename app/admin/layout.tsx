import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { LogoutButton } from "./LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAdminAuthenticated();

  return (
    <div className="admin-shell">
      {authenticated && (
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <strong>مدیریت آرشیو</strong>
            <span>Mustapha Samady</span>
          </div>

          <nav>
            <Link href="/admin">داشبورد</Link>
            <Link href="/admin/books">کتاب‌ها</Link>
            <Link href="/admin/poems">شعرها</Link>
            <Link href="/admin/topics">موضوع‌ها</Link>
            <Link href="/admin/seo">SEO</Link>
            <Link href="/admin/seo/opportunities">SEO Opportunities</Link>
            <Link href="/admin/settings">تنظیمات</Link>

            <div className="admin-nav-divider" />

            <Link href="/" target="_blank">مشاهده سایت</Link>
            <LogoutButton />
          </nav>
        </aside>
      )}

      <div className={authenticated ? "admin-content" : "admin-content-full"}>
        {children}
      </div>
    </div>
  );
}
