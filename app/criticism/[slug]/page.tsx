import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { criticism, getBook, getCriticism } from "@/lib/data";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return criticism.filter((item) => item.status === "published").map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getCriticism(slug);
  if (!item) return {};
  return {
    title: item.seoTitle || `${item.title} | نقد و نظر`,
    description: item.seoDescription || item.excerpt,
    alternates: { canonical: `/criticism/${item.slug}` },
    openGraph: { type: "article", title: item.title, description: item.seoDescription || item.excerpt },
  };
}

export default async function CriticismDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getCriticism(slug);
  if (!item || item.status !== "published") notFound();
  const book = item.relatedBook ? getBook(item.relatedBook) : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: item.title,
    headline: item.title,
    reviewBody: item.body,
    author: { "@type": "Person", name: item.author },
    itemReviewed: book ? { "@type": "Book", name: book.title, url: `${site.url}/books/${book.slug}` } : undefined,
    datePublished: item.publishedDate || undefined,
    inLanguage: "fa",
    url: `${site.url}/criticism/${item.slug}`,
  };
  return (
    <main className="criticism-page container">
      <JsonLd data={jsonLd} />
      <div className="breadcrumbs"><Link href="/">خانه</Link> / <Link href="/criticism">نقد و نظر</Link> / {item.title}</div>
      <article>
        <header className="criticism-article-header">
          <h1>{item.title}</h1>
          <p>{item.subtitle}</p>
          <div>نقد از: {item.author}</div>
          {item.publishedDate && <time>{item.publishedDate}</time>}
        </header>
        <div className="criticism-body">{item.body}</div>
        <p className="criticism-note">متن این نقد بدون هرگونه ویرایش و تغییر، مطابق نسخه منتقد منتشر شده است</p>
      </article>
    </main>
  );
}
