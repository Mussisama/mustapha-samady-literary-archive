import type { Metadata } from "next";
import Link from "next/link";
import { topics } from "@/lib/data";
import { poemsForTopic } from "@/lib/topics";

export const metadata: Metadata = {
  title: "موضوع‌های شعر",
  description: "موضوع‌های اصلی شعرهای Mustapha Samady؛ مهاجرت، افغانستان، عشق، جنگ، هویت، زن، مرگ و تنهایی.",
  alternates: { canonical: "/topics" },
};

export default function TopicsPage() {
  return (
    <div className="page container">
      <div className="breadcrumbs"><Link href="/">خانه</Link> / موضوع‌ها</div>
      <h1>موضوع‌ها</h1>
      <p className="lead">شعرها را بر اساس موضوع و پیوندهای معنایی بخوانید.</p>

      <div className="topic-grid topic-grid-public">
        {topics.map((topic) => {
          const count = poemsForTopic(topic.slug).length;
          return (
            <Link className="topic-card" href={`/topics/${topic.slug}`} key={topic.slug}>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <span>{count} شعر</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
