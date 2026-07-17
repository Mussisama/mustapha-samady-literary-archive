import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { books } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "درباره مصطفی صمدی",
  description: "مصطفی صمدی، شاعر و نویسنده معاصر افغانستان و آرشیو رسمی آثار منتشرشده او.",
  alternates: { canonical: "/about" },
  openGraph: { title: "درباره مصطفی صمدی", description: "شاعر و نویسنده معاصر افغانستان، ساکن برلین.", url: "/about" },
};

export default function AboutPage() {
  const timeline = [...books].sort((a, b) => (a.datePublished || "").localeCompare(b.datePublished || ""));
  const personPage = {
    "@context": "https://schema.org", "@type": "ProfilePage", url: `${site.url}/about`,
    mainEntity: { "@type": "Person", "@id": `${site.url}/#person`, name: "مصطفی صمدی", alternateName: "Mustapha Samady" },
  };
  return <div className="page container about-page">
    <JsonLd data={personPage} />
    <div className="breadcrumbs"><Link href="/">خانه</Link> / درباره من</div>
    <header className="about-hero"><div className="eyebrow">آرشیو رسمی</div><h1>مصطفی صمدی</h1><p>شاعر و نویسنده معاصر افغانستان</p></header>
    <div className="about-copy">
      <p>این وب‌سایت آرشیو رسمی آثار ادبی مصطفی صمدی است.</p>
      <p>تمامی کتاب‌ها، شعرها و نوشته‌های منتشرشده در این آرشیو به‌صورت رایگان و برای استفاده ادبی و پژوهشی در دسترس عموم قرار گرفته‌اند.</p>
      <p className="about-location">Berlin, Germany</p>
    </div>
    <section className="literary-timeline" aria-labelledby="published-works"><h2 id="published-works">آثار منتشرشده</h2>
      <ol>{timeline.map((book) => <li key={book.slug}><time dateTime={book.datePublished}>{book.publicationLabel || book.firstEdition}</time><Link href={`/books/${book.slug}`}>{book.title}</Link></li>)}</ol>
    </section>
  </div>;
}
