import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import {
  books,
  poems,
  getBook,
  getBookPoem,
  getAdjacentPoems,
} from "@/lib/data";
import { site } from "@/lib/site";
import { isPreviewEnabled } from "@/lib/preview";
import { resolvedSeoDescription, resolvedSeoTitle } from "@/lib/seo";
import { poemDisplayLabel } from "@/lib/labels";

export function generateStaticParams() {
  return poems.map((poem) => ({
    slug: poem.bookSlug,
    poem: poem.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; poem: string }>;
}): Promise<Metadata> {
  const { slug, poem: poemSlug } = await params;
  const poem = getBookPoem(slug, poemSlug);
  const book = getBook(slug);
  if (!poem || !book) return {};

  const firstLine = poem.body.split("\n").find(Boolean) || poem.title;
  const title = resolvedSeoTitle(poem, book);
  const description = resolvedSeoDescription(poem, book);

  return {
    title,
    description,
    keywords: [
      firstLine,
      book.title,
      "Mustapha Samady",
      "مصطفی صمدی",
      book.contentModel === "prose" ? "نثر فارسی افغانستان" : "شعر سپید افغانستان",
      book.contentModel === "prose" ? "نثر معاصر افغانستان" : "شعر معاصر افغانستان",
    ],
    alternates: {
      canonical: `/books/${book.slug}/${poem.slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/books/${book.slug}/${poem.slug}`,
      images: [{ url: book.cover, alt: `کاور ${book.title}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [book.cover] },
  };
}

export default async function BookPoemPage({
  params,
}: {
  params: Promise<{ slug: string; poem: string }>;
}) {
  const { slug, poem: poemSlug } = await params;
  const preview = await isPreviewEnabled();
  const book = getBook(slug);
  const poem = getBookPoem(slug, poemSlug, preview);
  if (!book || !poem) notFound();

  const adjacent = getAdjacentPoems(book.slug, poem.order, preview);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": book.contentModel === "prose" ? "Article" : "CreativeWork",
    name: poem.title,
    headline: poem.body.split("\n").find(Boolean) || poemDisplayLabel(poem, book.titleMode),
    text: poem.body,
    inLanguage: "fa",
    isAccessibleForFree: true,
    author: {
      "@type": "Person",
      name: "Mustapha Samady",
      alternateName: "مصطفی صمدی",
      url: site.url,
    },
    isPartOf: {
      "@type": "Book",
      name: book.title,
      url: `${site.url}/books/${book.slug}`,
    },
    pagination:
      poem.startPage === poem.endPage
        ? `${poem.startPage}`
        : `${poem.startPage}-${poem.endPage}`,
    datePublished: book.datePublished || undefined,
    image: `${site.url}${book.cover}`,
    url: `${site.url}/books/${book.slug}/${poem.slug}`,
  };

  return (
    <article className="poem-page container">
      <JsonLd data={jsonLd} />

      {preview && <div className="preview-banner">حالت پیش‌نمایش فعال است</div>}
      <div className="breadcrumbs">
        <Link href="/">خانه</Link> /{" "}
        <Link href="/books">کتاب‌ها</Link> /{" "}
        <Link href={`/books/${book.slug}`}>{book.title}</Link> /{" "}
        {poem.displayNumber}
      </div>

      <div className="poem-book-title">{book.title}</div>
      <h1>{poemDisplayLabel(poem, book.titleMode)}</h1>

      <div className="poem-body">{poem.body}</div>

      <div className="poem-source">
        {book.contentModel === "prose" ? "از کتاب" : "از مجموعه"} «{book.title}» ·{" "}
        {poem.startPage === poem.endPage
          ? `صفحه ${poem.startPage}`
          : `صفحات ${poem.startPage} تا ${poem.endPage}`}
      </div>

      <nav className="poem-nav" aria-label={book.contentModel === "prose" ? "حرکت میان نوشته‌های کتاب" : "حرکت میان شعرهای کتاب"}>
        <div>
          {adjacent.previous && (
            <Link href={`/books/${book.slug}/${adjacent.previous.slug}`}>
              {book.contentModel === "prose" ? "نوشته قبلی" : "شعر قبلی"}
            </Link>
          )}
        </div>
        <Link href={`/books/${book.slug}`}>فهرست کتاب</Link>
        <div>
          {adjacent.next && (
            <Link href={`/books/${book.slug}/${adjacent.next.slug}`}>
              {book.contentModel === "prose" ? "نوشته بعدی" : "شعر بعدی"}
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
