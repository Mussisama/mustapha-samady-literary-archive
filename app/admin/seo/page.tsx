import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { poems } from "@/lib/data";
import { calculateSeoScore } from "@/lib/seo-score";
import { site } from "@/lib/site";

export default async function AdminSeoPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const scores = poems.map((poem) => ({
    poem,
    result: calculateSeoScore(poem),
  }));
  const ready = scores.filter(({ result }) => result.score >= 80);
  const needsWork = scores.filter(({ result }) => result.score < 80);
  const average = scores.length
    ? Math.round(scores.reduce((sum, item) => sum + item.result.score, 0) / scores.length)
    : 0;

  const technicalChecks = [
    { label: "robots.txt", value: "/robots.txt", ok: true },
    { label: "XML Sitemap", value: "/sitemap.xml", ok: true },
    { label: "Canonical URLs", value: "فعال", ok: true },
    { label: "Structured Data", value: "Book · CreativeWork · Person", ok: true },
    { label: "Open Graph", value: "فعال", ok: true },
    { label: "دامنه نهایی", value: site.url, ok: !site.url.includes("localhost") },
  ];

  return (
    <div className="admin-page">
      <div className="admin-heading-row">
        <div>
          <div className="admin-kicker">Search Visibility</div>
          <h1>SEO</h1>
        </div>
        <Link className="admin-secondary" href="/admin/seo/opportunities">SEO Opportunities</Link>
      </div>

      <div className="seo-overview">
        <div className="seo-overview-score">
          <strong>{average}</strong>
          <span>میانگین SEO</span>
        </div>
        <div><strong>{ready.length}</strong><span>آماده انتشار</span></div>
        <div><strong>{needsWork.length}</strong><span>نیازمند تکمیل</span></div>
      </div>

      <section className="admin-panel">
        <h2>وضعیت فنی</h2>
        <div className="technical-checks">
          {technicalChecks.map((check) => (
            <div key={check.label}>
              <span className={check.ok ? "technical-ok" : "technical-warning"}>
                {check.ok ? "✓" : "!"}
              </span>
              <strong>{check.label}</strong>
              <small>{check.value}</small>
            </div>
          ))}
        </div>
      </section>

      {needsWork.length > 0 && (
        <section className="admin-panel">
          <h2>شعرهای نیازمند بهینه‌سازی</h2>
          <div className="admin-poem-list">
            {needsWork.slice(0, 20).map(({ poem, result }) => (
              <Link href={`/admin/poems/${poem.id}`} key={poem.id}>
                <span>{poem.title} — {poem.bookTitle}</span>
                <small>{result.score}/100</small>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
