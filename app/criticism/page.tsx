import type { Metadata } from "next";
import Link from "next/link";
import { criticism } from "@/lib/data";

export const metadata: Metadata = {
  title: "نقد و نظر درباره آثار مصطفی صمدی",
  description: "آرشیو نقدها و خوانش‌های ادبی منتشرشده درباره شعرها و کتاب‌های مصطفی صمدی.",
  alternates: { canonical: "/criticism" },
};

export default function CriticismPage() {
  const entries = criticism.filter((item) => item.status === "published");
  return (
    <main className="page container criticism-index">
      <div className="breadcrumbs"><Link href="/">خانه</Link> / نقد و نظر</div>
      <header className="criticism-header">
        <h1>نقد و نظر</h1>
        <p className="lead">نقدها و خوانش‌های منتشرشده درباره آثار مصطفی صمدی</p>
      </header>
      <div className="criticism-list">
        {entries.map((item) => (
          <article key={item.id}>
            <Link href={`/criticism/${item.slug}`}>
              <h2>{item.title}</h2>
              <p>{item.subtitle}</p>
              <div>نقد از: {item.author}{item.publishedDate ? ` · ${item.publishedDate}` : ""}</div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
