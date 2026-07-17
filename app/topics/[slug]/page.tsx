import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { topics } from "@/lib/data";
import { poemsForTopic, topicOpportunity } from "@/lib/topics";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = topics.find((item) => item.slug === slug);
  if (!topic) return {};

  return {
    title: topic.title,
    description: topic.description,
    keywords: topic.keywords,
    alternates: { canonical: `/topics/${topic.slug}` },
    openGraph: {
      type: "website",
      title: `${topic.title} | Mustapha Samady`,
      description: topic.description,
      url: `/topics/${topic.slug}`,
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = topics.find((item) => item.slug === slug);
  if (!topic) notFound();

  const related = poemsForTopic(slug);
  const opportunity = topicOpportunity(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: topic.title,
    description: topic.description,
    inLanguage: "fa",
    url: `${site.url}/topics/${topic.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: related.length,
      itemListElement: related.map((poem, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${site.url}/books/${poem.bookSlug}/${poem.slug}`,
        name: poem.title,
      })),
    },
  };

  return (
    <div className="page container topic-page">
      <JsonLd data={jsonLd} />

      <div className="breadcrumbs">
        <Link href="/">خانه</Link> / <Link href="/topics">موضوع‌ها</Link> / {topic.title}
      </div>

      <header className="topic-hero">
        <div className="eyebrow">مجموعه موضوعی</div>
        <h1>{topic.title}</h1>
        <p>{topic.description}</p>
        <div className="topic-stats">
          <span>{related.length} شعر</span>
          <span>{opportunity?.bookCount || 0} کتاب</span>
        </div>
      </header>

      {related.length > 0 ? (
        <div className="topic-poems">
          {related.map((poem) => (
            <Link href={`/books/${poem.bookSlug}/${poem.slug}`} key={poem.id}>
              <div>
                <strong>{poem.title}</strong>
                <span>{poem.bookTitle}</span>
              </div>
              <small>{poem.startPage === poem.endPage ? `صفحه ${poem.startPage}` : `صفحات ${poem.startPage}–${poem.endPage}`}</small>
            </Link>
          ))}
        </div>
      ) : (
        <div className="context-box">
          هنوز شعری به این موضوع پیوند داده نشده است.
        </div>
      )}
    </div>
  );
}
