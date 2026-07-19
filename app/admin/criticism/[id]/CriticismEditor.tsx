"use client";
import { FormEvent, useState } from "react";

export function CriticismEditor({ item }: { item: any }) {
  const [form, setForm] = useState(item);
  const [message, setMessage] = useState("");
  function change(key: string, value: string) { setForm((current: any) => ({ ...current, [key]: value })); }
  async function save(event: FormEvent) {
    event.preventDefault(); setMessage("در حال ذخیره...");
    const response = await fetch(`/api/admin/criticism/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const result = await response.json().catch(() => ({}));
    setMessage(response.ok ? (result.deploymentPending ? "تغییرات در گیت‌هاب ذخیره شد؛ انتشار نسخه تازه در حال انجام است (حدود ۱ تا ۳ دقیقه)." : "تغییرات ذخیره شد.") : `خطا در ذخیره: ${result.error || response.status}`);
  }
  return (
    <form className="admin-form criticism-editor" onSubmit={save}>
      <label>عنوان<input value={form.title || ""} onChange={(e) => change("title", e.target.value)} /></label>
      <label>زیرعنوان<input value={form.subtitle || ""} onChange={(e) => change("subtitle", e.target.value)} /></label>
      <div className="admin-form-grid">
        <label>نام منتقد<input value={form.author || ""} onChange={(e) => change("author", e.target.value)} /></label>
        <label>تاریخ انتشار<input value={form.publishedDate || ""} placeholder="اختیاری" onChange={(e) => change("publishedDate", e.target.value)} /></label>
        <label>وضعیت<select value={form.status} onChange={(e) => change("status", e.target.value)}><option value="published">منتشرشده</option><option value="draft">پیش‌نویس</option></select></label>
      </div>
      <label>متن نقد<textarea className="admin-poem-textarea" rows={36} value={form.body || ""} onChange={(e) => change("body", e.target.value)} spellCheck={false} /></label>
      <details className="seo-override"><summary>تنظیمات SEO — اختیاری</summary><label>SEO Title<input value={form.seoTitle || ""} onChange={(e) => change("seoTitle", e.target.value)} /></label><label>SEO Description<textarea rows={3} value={form.seoDescription || ""} onChange={(e) => change("seoDescription", e.target.value)} /></label></details>
      <div className="admin-actions"><button className="admin-primary" type="submit">ذخیره تغییرات</button><a className="admin-secondary" href={`/criticism/${item.slug}`} target="_blank">مشاهده</a></div>
      {message && <p className="admin-message">{message}</p>}
    </form>
  );
}
