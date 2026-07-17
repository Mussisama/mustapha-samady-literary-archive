import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { topics } from "@/lib/data";
import { topicOpportunity } from "@/lib/topics";

export default async function AdminTopicsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const opportunities = topics
    .map((topic) => topicOpportunity(topic.slug))
    .filter(Boolean);

  return (
    <div className="admin-page">
      <div className="admin-heading-row">
        <div>
          <div className="admin-kicker">ساختار معنایی</div>
          <h1>موضوع‌ها</h1>
        </div>
        <Link className="admin-secondary" href="/admin/seo/opportunities">
          SEO Opportunities
        </Link>
      </div>

      <div className="admin-topic-grid">
        {opportunities.map((item: any) => (
          <article className="admin-topic-card" key={item.topic.slug}>
            <div className="topic-card-top">
              <h2>{item.topic.title}</h2>
              <span className={`opportunity-badge opportunity-${item.status}`}>
                {item.score}
              </span>
            </div>
            <p>{item.topic.description}</p>
            <div className="topic-admin-stats">
              <span>{item.related.length} شعر</span>
              <span>{item.bookCount} کتاب</span>
              <span>{item.status}</span>
            </div>
            <Link href={`/topics/${item.topic.slug}`} target="_blank">مشاهده صفحه</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
