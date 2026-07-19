"use client";

import { FormEvent, useMemo, useState } from "react";
import { calculateSeoScore } from "@/lib/seo-score";
import { automaticSeoDescription, automaticSeoTitle } from "@/lib/seo";

function splitList(value: string) {
  return value.split(",").map(item => item.trim()).filter(Boolean);
}

export function PoemEditor({ poem }: { poem: any }) {
  const [form, setForm] = useState({
    ...poem,
    topicsText: (poem.topics || []).join(", "),
    keywordsText: (poem.keywords || []).join(", "),
  });
  const [message, setMessage] = useState("");

  function change(key: string, value: string | number) {
    setForm((current: any) => ({ ...current, [key]: value }));
  }

  const seo = useMemo(() => calculateSeoScore({
    ...form,
    topics: splitList(form.topicsText),
    keywords: splitList(form.keywordsText),
  }), [form]);

  const autoSeoTitle = automaticSeoTitle(form);
  const autoSeoDescription = automaticSeoDescription(form);

  async function save(event: FormEvent) {
    event.preventDefault();
    setMessage("در حال ذخیره...");
    const response = await fetch(`/api/admin/poems/${poem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        topics: splitList(form.topicsText),
        keywords: splitList(form.keywordsText),
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (response.ok) {
      setMessage(result.deploymentPending
        ? "تغییرات در گیت‌هاب ذخیره شد؛ انتشار نسخه تازه در حال انجام است (حدود ۱ تا ۳ دقیقه)."
        : "تغییرات ذخیره شد.");
    } else {
      setMessage(`خطا در ذخیره: ${result.error || response.status}`);
    }
  }

  async function remove() {
    if (!window.confirm("این شعر برای همیشه حذف شود؟")) return;
    setMessage("در حال حذف...");
    const response = await fetch(`/api/admin/poems/${poem.id}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    if (response.ok) window.location.href = "/admin/poems";
    else setMessage(`خطا در حذف: ${result.error || response.status}`);
  }

  async function preview() {
    await fetch("/api/admin/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: `/books/${poem.bookSlug}/${poem.slug}` }),
    });
    window.open(`/books/${poem.bookSlug}/${poem.slug}`, "_blank");
  }

  return (
    <div className="admin-editor-layout">
      <form className="admin-form admin-poem-editor" onSubmit={save}>
        <label>عنوان چاپی
          <input value={form.title || ""} onChange={e => change("title", e.target.value)} />
        </label>
        <label>عنوان وب — اختیاری
          <input
            value={form.webTitle || ""}
            placeholder="برای شعرهای بدون عنوان خالی بگذار"
            onChange={e => change("webTitle", e.target.value)}
          />
        </label>
        <div className="admin-form-grid">
          <label>صفحه آغاز
            <input type="number" value={form.startPage} onChange={e => change("startPage", Number(e.target.value))} />
          </label>
          <label>صفحه پایان
            <input type="number" value={form.endPage} onChange={e => change("endPage", Number(e.target.value))} />
          </label>
          <label>وضعیت
            <select value={form.status} onChange={e => change("status", e.target.value)}>
              <option value="published">منتشرشده</option>
              <option value="draft">پیش‌نویس</option>
            </select>
          </label>
        </div>
        <label>متن شعر
          <textarea className="admin-poem-textarea" rows={24} value={form.body || ""} onChange={e => change("body", e.target.value)} spellCheck={false} />
        </label>
        <label>موضوع‌ها — با ویرگول جدا کن
          <input value={form.topicsText} onChange={e => change("topicsText", e.target.value)} />
        </label>
        <label>کلیدواژه‌ها — با ویرگول جدا کن
          <textarea rows={3} value={form.keywordsText} onChange={e => change("keywordsText", e.target.value)} />
        </label>
        <details className="seo-override">
          <summary>تنظیمات پیشرفته SEO — اختیاری</summary>
          <p>
            عنوان و توضیح SEO به‌صورت خودکار ساخته می‌شوند. فقط زمانی این فیلدها را پر کن
            که بخواهی نسخه خودکار را تغییر بدهی.
          </p>
          <label>SEO Title — اختیاری
            <input
              value={form.seoTitle || ""}
              placeholder={autoSeoTitle}
              onChange={e => change("seoTitle", e.target.value)}
            />
          </label>
          <label>SEO Description — اختیاری
            <textarea
              rows={3}
              value={form.seoDescription || ""}
              placeholder={autoSeoDescription}
              onChange={e => change("seoDescription", e.target.value)}
            />
          </label>
        </details>
        <div className="admin-actions">
          <button className="admin-primary" type="submit">ذخیره تغییرات</button>
          <button className="admin-secondary" type="button" onClick={preview}>پیش‌نمایش</button>
          <button className="admin-danger" type="button" onClick={remove}>حذف شعر</button>
        </div>
        {message && <p className="admin-message">{message}</p>}
      </form>
      <aside className="admin-editor-sidebar">
        <div className="seo-score-card">
          <div className="seo-score-number">{seo.score}</div>
          <div className="seo-score-label">SEO Score</div>
          <div className="seo-score-bar"><span style={{ width: `${seo.score}%` }} /></div>
          <ul>
            {seo.checks.map((check) => (
              <li key={check.label} className={check.ok ? "ok" : "missing"}>
                <span>{check.ok ? "✓" : "○"}</span>{check.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="google-preview-card">
          <div className="google-preview-label">Google Preview</div>
          <div className="google-preview-url">
            mustaphasamady.com › books › {poem.bookSlug} › {poem.slug}
          </div>
          <div className="google-preview-title">
            {form.seoTitle?.trim() || autoSeoTitle}
          </div>
          <div className="google-preview-description">
            {form.seoDescription?.trim() || autoSeoDescription}
          </div>
        </div>
      </aside>
    </div>
  );
}
