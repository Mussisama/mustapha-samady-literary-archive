"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function BookEditor({ book }: { book: any }) {
  const [form, setForm] = useState(book);
  const [message, setMessage] = useState("");
  const router = useRouter();

  function change(key: string, value: string) {
    setForm((current: any) => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setMessage("در حال ذخیره...");
    const response = await fetch(`/api/admin/books/${book.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setMessage(response.ok ? "ذخیره شد." : "خطا در ذخیره.");
    router.refresh();
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("در حال بارگذاری...");
    const data = new FormData(event.currentTarget);
    const response = await fetch(`/api/admin/books/${book.slug}/media`, {
      method: "POST",
      body: data,
    });
    setMessage(response.ok ? "فایل‌ها ذخیره شدند." : "بارگذاری ناموفق بود.");
    router.refresh();
  }

  return (
    <>
      <form className="admin-form" onSubmit={save}>
        <h2>اطلاعات کتاب</h2>
        <label>شناسه آرشیو
          <input value={form.archiveId || ""} readOnly aria-readonly="true" />
        </label>
        <label>عنوان<input value={form.title || ""} onChange={e => change("title", e.target.value)} /></label>
        <label>توضیح<textarea rows={4} value={form.description || ""} onChange={e => change("description", e.target.value)} /></label>
        <div className="admin-form-grid">
          <label>سال انتشار<input value={form.year || ""} onChange={e => change("year", e.target.value)} /></label>
          <label>ناشر<input value={form.publisher || ""} onChange={e => change("publisher", e.target.value)} /></label>
          <label>چاپ اول<input value={form.firstEdition || ""} onChange={e => change("firstEdition", e.target.value)} /></label>
          <label>ISBN<input value={form.isbn || ""} onChange={e => change("isbn", e.target.value)} /></label>
          <label>ویراستار<input value={form.editor || ""} onChange={e => change("editor", e.target.value)} /></label>
          <label>طراح جلد<input value={form.coverDesigner || ""} onChange={e => change("coverDesigner", e.target.value)} /></label>
        </div>
        <button className="admin-primary" type="submit">ذخیره اطلاعات</button>
      </form>

      <form className="admin-form" onSubmit={upload}>
        <h2>کاور و PDF</h2>
        <label>کاور جدید<input type="file" name="cover" accept="image/png,image/jpeg" /></label>
        <label>PDF جدید<input type="file" name="pdf" accept="application/pdf" /></label>
        <button className="admin-secondary" type="submit">بارگذاری فایل‌ها</button>
      </form>
      {message && <p className="admin-message">{message}</p>}
    </>
  );
}
