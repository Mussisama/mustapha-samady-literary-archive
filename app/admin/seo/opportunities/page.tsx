import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { topics } from "@/lib/data";
import { topicOpportunity } from "@/lib/topics";

export default async function SeoOpportunitiesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const opportunities = topics
    .map((topic) => topicOpportunity(topic.slug))
    .filter(Boolean)
    .sort((a: any, b: any) => b.score - a.score);

  return (
    <div className="admin-page">
      <div className="admin-heading-row">
        <div>
          <div className="admin-kicker">Topical Authority</div>
          <h1>SEO Opportunities</h1>
        </div>
        <Link className="admin-secondary" href="/admin/seo">SEO ←</Link>
      </div>

      <div className="opportunity-list">
        {opportunities.map((item: any) => (
          <article className="opportunity-row" key={item.topic.slug}>
            <div className="opportunity-score">
              <strong>{item.score}</strong>
              <span>{item.status}</span>
            </div>

            <div className="opportunity-content">
              <h2>{item.topic.title}</h2>
              <p>{item.topic.description}</p>
              <div>
                <span>{item.related.length} شعر</span>
                <span>{item.bookCount} کتاب</span>
              </div>
            </div>

            <div className="opportunity-action">
              {item.related.length < 5 ? (
                <p>شعرهای بیشتری به این موضوع نسبت بده.</p>
              ) : item.bookCount < 2 ? (
                <p>این موضوع را در کتاب‌های دیگر نیز تقویت کن.</p>
              ) : (
                <p>این خوشه موضوعی آماده رشد در گوگل است.</p>
              )}
              <Link href={`/topics/${item.topic.slug}`} target="_blank">مشاهده صفحه</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
