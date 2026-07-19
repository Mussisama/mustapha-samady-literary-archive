import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { books, getBook, getBookPoems, getBookCriticism } from "@/lib/data";
import { site } from "@/lib/site";
import { isPreviewEnabled } from "@/lib/preview";
import { topics } from "@/lib/data";
import { poemMatchesTopic } from "@/lib/topics";

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return {};

  return {
    title: `${book.title} | ${book.kind}`,
    description: `متن کامل ${book.kind} «${book.title}» اثر Mustapha Samady، فهرست شعرها و دانلود رایگان PDF.`,
    keywords: [
      book.title,
      "Mustapha Samady",
      "مصطفی صمدی",
      "شعر افغانستان",
      "شعر سپید افغانستان",
      book.kind,
    ],
    alternates: { canonical: `/books/${book.slug}` },
    openGraph: {
      type: "book",
      title: `${book.title} اثر Mustapha Samady`,
      description: book.description,
      images: [{ url: book.cover, alt: `کاور ${book.title}` }],
    },
    twitter: { card: "summary_large_image", title: `${book.title} | مصطفی صمدی`, description: book.description, images: [book.cover] },
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const preview = await isPreviewEnabled();
  const entries = getBookPoems(book.slug, preview);
  const bookCriticism = getBookCriticism(book.slug);
  const bookTopics = topics
    .map((topic) => ({
      topic,
      count: entries.filter((poem) => poemMatchesTopic(poem, topic)).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    inLanguage: "fa",
    author: {
      "@type": "Person",
      name: "Mustapha Samady",
      alternateName: "مصطفی صمدی",
      url: site.url,
    },
    publisher: book.publisher
      ? { "@type": "Organization", name: book.publisher }
      : undefined,
    datePublished: book.datePublished || book.year || undefined,
    editor: book.editor
      ? { "@type": "Person", name: book.editor }
      : undefined,
    image: `${site.url}${book.cover}`,
    url: `${site.url}/books/${book.slug}`,
    genre: book.kind,
    identifier: book.archiveId || undefined,
    numberOfPages: book.pageCount,
    isAccessibleForFree: true,
  };

  return (
    <div className="page container">
      <JsonLd data={jsonLd} />

      <div className="breadcrumbs">
        <Link href="/">خانه</Link> / <Link href="/books">کتاب‌ها</Link> /{" "}
        {book.title}
      </div>

      {preview && <div className="preview-banner">حالت پیش‌نمایش فعال است</div>}
      <h1>{book.title}</h1>
      <p className="lead">{book.description}</p>
      <div className="book-summary">
        {book.contentModel === "silent-book" ? (
          <span>{book.silentPageCount || 100} صفحه سکوت</span>
        ) : (
          <span>
            {book.contentModel === "prose"
              ? `${entries.length} نوشته`
              : `${entries.length} شعر`}
          </span>
        )}
        {book.pageCount && <span>{book.pageCount} صفحه</span>}
        <span>{bookTopics.length} موضوع اصلی</span>
      </div>

      <div className="book-layout">
        <div>
          <Image
            src={book.cover}
            alt={`کاور ${book.kind} ${book.title} اثر Mustapha Samady`}
            width={640}
            height={900}
            className="book-cover"
            priority
          />
          <a className="download" href={book.pdf} download>
            دانلود رایگان PDF
          </a>

          {book.publisher && (
            <dl className="book-meta-list">
              {book.archiveId && <div><dt>شناسه آرشیو</dt><dd>{book.archiveId}</dd></div>}
              <div><dt>ناشر</dt><dd>{book.publisher}</dd></div>
              {book.firstEdition && <div><dt>چاپ اول</dt><dd>{book.firstEdition}</dd></div>}
              {book.publicationPlace && <div><dt>محل نشر</dt><dd>{book.publicationPlace}</dd></div>}
              {book.printRun && <div><dt>تیراژ</dt><dd>{book.printRun} نسخه</dd></div>}
              {book.editor && <div><dt>ویراستار</dt><dd>{book.editor}</dd></div>}
              {book.coverDesigner && <div><dt>طرح جلد</dt><dd>{book.coverDesigner}</dd></div>}
              {book.adaptedFrom && <div><dt>اقتباس از</dt><dd>{book.adaptedFrom}</dd></div>}
              {book.copyright && <div><dt>حق نشر</dt><dd>{book.copyright}</dd></div>}
            </dl>
          )}
        </div>

        <div>
          <h2>{book.contentModel === "prose" ? "نوشته‌های کتاب" : "شعرهای کتاب"}</h2>
          {book.contentModel === "silent-book" ? (
            <section className="silent-book-panel" aria-label="درباره ساختار مفهومی کتاب">
              <div className="silent-book-page" aria-hidden="true">
                <span>۱</span>
              </div>
              <div>
                <h2>صد صفحه سکوت</h2>
                <p>{book.conceptStatement}</p>
                <p className="silent-book-note">
                  این کتاب عمداً سفید است. نبودن شعر یا متن، نقص PDF یا خطای استخراج نیست.
                </p>
              </div>
            </section>
          ) : entries.length > 0 ? (
            (book.titleMode === "numbered" || book.titleMode === "prose-numbered") ? (
              <div className="poem-number-grid">
                {entries.map((entry) => (
                  <Link
                    href={`/books/${book.slug}/${entry.slug}`}
                    key={entry.slug}
                    aria-label={book.contentModel === "prose" ? `نوشته شماره ${entry.displayNumber}` : `شعر شماره ${entry.displayNumber}`}
                  >
                    {entry.displayNumber}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="list">
                {entries.map((entry, index) => (
                  <Link href={`/books/${book.slug}/${entry.slug}`} key={entry.slug}>
                    <span>{entry.title}</span>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                  </Link>
                ))}
              </div>
            )
          ) : (
            <div className="context-box"><p>فهرست دقیق این کتاب هنوز در حال بازبینی است.</p></div>
          )}
          {bookCriticism.length > 0 && (
            <section className="book-criticism">
              <h2>نقد و نظر درباره این کتاب</h2>
              <div>
                {bookCriticism.map((item) => (
                  <Link href={`/criticism/${item.slug}`} key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{item.author}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {bookTopics.length > 0 && (
            <section className="book-topics">
              <h2>موضوع‌های اصلی</h2>
              <div>
                {bookTopics.map(({ topic, count }) => (
                  <Link href={`/topics/${topic.slug}`} key={topic.slug}>
                    {topic.title} <small>{count}</small>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
