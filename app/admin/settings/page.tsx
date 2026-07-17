import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { site } from "@/lib/site";

export default async function AdminSettingsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div className="admin-page">
      <div className="admin-kicker">پیکربندی</div>
      <h1>تنظیمات</h1>

      <div className="admin-panel settings-list">
        <div><strong>نام آرشیو</strong><span>Mustapha Samady Literary Archive</span></div>
        <div><strong>آدرس سایت</strong><span>{site.url}</span></div>
        <div><strong>زبان اصلی</strong><span>فارسی</span></div>
        <div><strong>محل</strong><span>Berlin</span></div>
        <div><strong>دسترسی آثار</strong><span>رایگان</span></div>
      </div>

      <div className="admin-note">
        دامنه و اطلاعات امنیتی از فایل <code>.env.local</code> خوانده می‌شوند.
        انتقال ذخیره‌سازی به Supabase پیش از انتشار عمومی انجام خواهد شد.
      </div>
    </div>
  );
}
