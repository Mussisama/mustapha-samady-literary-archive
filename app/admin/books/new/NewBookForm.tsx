"use client";
import { FormEvent, useState } from "react";

export function NewBookForm() {
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("در حال ذخیره و بارگذاری...");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/books", { method: "POST", body: data });
    const result = await response.json().catch(() => ({}));
    if (response.ok) { setMessage("کتاب و فایل‌ها در گیت‌هاب ذخیره شدند؛ انتشار نسخه تازه در حال انجام است."); }
    else setMessage(`خطا در ذخیره: ${result.error || response.status}`);
  }
  return <form className="admin-form" onSubmit={submit}>
    <label>عنوان کتاب<input name="title" required /></label>
    <label>نامک انگلیسی (Slug)<input name="slug" required pattern="[a-z0-9-]+" placeholder="new-book-title" dir="ltr" /></label>
    <label>توضیح<textarea name="description" rows={4} required /></label>
    <div className="admin-form-grid">
      <label>نوع اثر<select name="kind"><option value="مجموعه شعر">مجموعه شعر</option><option value="کتاب">کتاب</option><option value="نثر">نثر</option></select></label>
      <label>سال انتشار<input name="year" /></label>
      <label>ناشر<input name="publisher" /></label>
      <label>چاپ اول<input name="firstEdition" /></label>
      <label>تعداد صفحه<input name="pageCount" type="number" min="1" /></label>
      <label>شناسه آرشیو<input name="archiveId" placeholder="MS-B007" /></label>
      <label>ISBN<input name="isbn" /></label>
      <label>ویراستار<input name="editor" /></label>
      <label>طراح جلد<input name="coverDesigner" /></label>
      <label>شیوه عنوان شعرها<select name="titleMode"><option value="numbered">شماره‌ای</option><option value="titled">عنوان‌دار</option></select></label>
    </div>
    <label>کاور کتاب (JPG یا PNG)<input type="file" name="cover" accept="image/png,image/jpeg" required /></label>
    <label>فایل PDF<input type="file" name="pdf" accept="application/pdf" required /></label>
    <button className="admin-primary" type="submit">افزودن کتاب</button>{message && <p className="admin-message">{message}</p>}
  </form>;
}
