import { books, poems } from "@/lib/data";
import { site } from "@/lib/site";
import { getBook } from "@/lib/data";
import { poemDisplayLabel } from "@/lib/labels";

export const dynamic = "force-static";

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function asRssDate(value?: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? "" : `<pubDate>${date.toUTCString()}</pubDate>`;
}

export function GET() {
  const bookItems = [...books]
    .filter((book) => book.isPublished !== false)
    .sort((a, b) => (b.datePublished || "").localeCompare(a.datePublished || ""))
    .map((book) => `
      <item>
        <title>${esc(book.title)}</title>
        <link>${site.url}/books/${book.slug}</link>
        <guid isPermaLink="true">${site.url}/books/${book.slug}</guid>
        <description>${esc(book.description)}</description>
        <category>${esc(book.kind || "کتاب")}</category>
        ${asRssDate(book.datePublished)}
      </item>`);

  const workItems = [...poems]
    .filter((work) => work.status === "published")
    .sort((a, b) => {
      const bookA = getBook(a.bookSlug);
      const bookB = getBook(b.bookSlug);
      const dateCompare = (bookB?.datePublished || "").localeCompare(bookA?.datePublished || "");
      return dateCompare || b.order - a.order;
    })
    .slice(0, 30)
    .map((work) => {
      const book = getBook(work.bookSlug);
      const label = poemDisplayLabel(work, book?.titleMode);
      const kind = book?.contentModel === "prose" ? "نثر" : "شعر";
      return `
        <item>
          <title>${esc(`${label} — ${work.bookTitle}`)}</title>
          <link>${site.url}/books/${work.bookSlug}/${work.slug}</link>
          <guid isPermaLink="true">${site.url}/books/${work.bookSlug}/${work.slug}</guid>
          <description>${esc(work.excerpt || work.body.slice(0, 220))}</description>
          <category>${kind}</category>
          ${asRssDate(book?.datePublished)}
        </item>`;
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.title)}</title>
    <link>${site.url}</link>
    <description>${esc(site.description)}</description>
    <language>fa</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${[...bookItems, ...workItems].join("")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
