"use client";
import { FormEvent, useState } from "react";

export function NewCriticismForm({ books }: { books: Array<{ slug: string; title: string }> }) {
  const [form, setForm] = useState({ title: "", subtitle: "", author: "", publishedDate: "", body: "", relatedBook: "", status: "published", seoTitle: "", seoDescription: "" });
  const [message, setMessage] = useState("");
  function change(key: string, value: string) { setForm((current) => ({ ...current, [key]: value })); }
  async function submit(event: FormEvent) {
    event.preventDefault(); setMessage("در حال ذخیره...");
    const response = await fetch("/api/admin/criticism", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const result = await response.json().catch(() => ({}));
    if (response.ok) { setMessage("نقد در گیت‌هاب ذخیره شد؛ انتشار نسخه تازه در حال انجام است."); }
    else setMessage(`خطا در ذخیره: ${result.error || response.status}`);
  }
  return <form className="admin-form criticism-editor" onSubmit={submit}>
    <label>عنوان<input required value={form.title} onChange={(e) => change("title", e.target.value)} /></label>
    <label>زیرعنوان<input value={form.subtitle} onChange={(e) => change("subtitle", e.target.value)} /></label>
    <div className="admin-form-grid">
      <label>نام منتقد<input required value={form.author} onChange={(e) => change("author", e.target.value)} /></label>
      <label>تاریخ انتشار<input value={form.publishedDate} placeholder="اختیاری" onChange={(e) => change("publishedDate", e.target.value)} /></label>
      <label>کتاب مرتبط — اختیاری<select value={form.relatedBook} onChange={(e) => change("relatedBook", e.target.value)}><option value="">بدون اتصال</option>{books.map((book) => <option value={book.slug} key={book.slug}>{book.title}</option>)}</select></label>
      <label>وضعیت<select value={form.status} onChange={(e) => change("status", e.target.value)}><option value="published">منتشرشده</option><option value="draft">پیش‌نویس</option></select></label>
    </div>
    <label>متن نقد<textarea className="admin-poem-textarea" rows={36} required value={form.body} onChange={(e) => change("body", e.target.value)} spellCheck={false} /></label>
    <details className="seo-override"><summary>تنظیمات SEO — اختیاری</summary><label>SEO Title<input value={form.seoTitle} onChange={(e) => change("seoTitle", e.target.value)} /></label><label>SEO Description<textarea rows={3} value={form.seoDescription} onChange={(e) => change("seoDescription", e.target.value)} /></label></details>
    <button className="admin-primary" type="submit">افزودن نقد</button>{message && <p className="admin-message">{message}</p>}
  </form>;
}
