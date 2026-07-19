"use client";

import { FormEvent, useState } from "react";

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function NewPoemForm({ books }: { books: Array<{ slug: string; title: string }> }) {
  const [form, setForm] = useState({
    bookSlug: books[0]?.slug || "",
    title: "",
    webTitle: "",
    body: "",
    startPage: 1,
    endPage: 1,
    topicsText: "",
    keywordsText: "",
    status: "published",
    seoTitle: "",
    seoDescription: "",
  });
  const [message, setMessage] = useState("");

  function change(key: string, value: string | number) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("در حال ذخیره...");
    const response = await fetch("/api/admin/poems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        topics: splitList(form.topicsText),
        keywords: splitList(form.keywordsText),
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (response.ok) {
      setMessage("شعر در گیت‌هاب ذخیره شد؛ انتشار نسخه تازه در حال انجام است.");
    } else {
      setMessage(`خطا در ذخیره: ${result.error || response.status}`);
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <label>کتاب
        <select value={form.bookSlug} onChange={(e) => change("bookSlug", e.target.value)} required>
          {books.map((book) => <option value={book.slug} key={book.slug}>{book.title}</option>)}
        </select>
      </label>
      <label>عنوان چاپی
        <input value={form.title} onChange={(e) => change("title", e.target.value)} placeholder="برای شعر بی‌عنوان می‌توانی شماره را خالی بگذاری" />
      </label>
      <label>عنوان وب — اختیاری
        <input value={form.webTitle} onChange={(e) => change("webTitle", e.target.value)} />
      </label>
      <div className="admin-form-grid">
        <label>صفحه آغاز<input type="number" min="1" value={form.startPage} onChange={(e) => change("startPage", Number(e.target.value))} /></label>
        <label>صفحه پایان<input type="number" min="1" value={form.endPage} onChange={(e) => change("endPage", Number(e.target.value))} /></label>
        <label>وضعیت<select value={form.status} onChange={(e) => change("status", e.target.value)}><option value="published">منتشرشده</option><option value="draft">پیش‌نویس</option></select></label>
      </div>
      <label>متن شعر<textarea className="admin-poem-textarea" rows={24} required value={form.body} onChange={(e) => change("body", e.target.value)} spellCheck={false} /></label>
      <label>موضوع‌ها — با ویرگول جدا کن<input value={form.topicsText} onChange={(e) => change("topicsText", e.target.value)} /></label>
      <label>کلیدواژه‌ها — با ویرگول جدا کن<textarea rows={3} value={form.keywordsText} onChange={(e) => change("keywordsText", e.target.value)} /></label>
      <details className="seo-override"><summary>تنظیمات SEO — اختیاری</summary>
        <label>SEO Title<input value={form.seoTitle} onChange={(e) => change("seoTitle", e.target.value)} /></label>
        <label>SEO Description<textarea rows={3} value={form.seoDescription} onChange={(e) => change("seoDescription", e.target.value)} /></label>
      </details>
      <button className="admin-primary" type="submit">افزودن شعر</button>
      {message && <p className="admin-message">{message}</p>}
    </form>
  );
}
