import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { books } from "@/lib/data";
import { site } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171513",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | مصطفی صمدی" },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.persianName, url: site.url }],
  creator: site.persianName,
  publisher: site.persianName,
  applicationName: "Mustapha Samady Literary Archive",
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
  category: "literature",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  verification: {
    google: site.googleVerification || undefined,
    other: site.bingVerification ? { "msvalidate.01": site.bingVerification } : undefined,
  },
  openGraph: {
    type: "website", locale: site.locale, url: site.url,
    siteName: "آرشیو رسمی آثار مصطفی صمدی",
    title: site.title, description: site.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.title }],
  },
  twitter: {
    card: "summary_large_image", title: site.title, description: site.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const person = {
    "@context": "https://schema.org", "@type": "Person", "@id": `${site.url}/#person`,
    name: site.persianName, alternateName: site.name, url: site.url,
    jobTitle: "شاعر و نویسنده", knowsLanguage: ["fa", "de", "en"],
    nationality: { "@type": "Country", name: "Afghanistan" },
    homeLocation: { "@type": "Place", name: "Berlin, Germany" },
    mainEntityOfPage: `${site.url}/about`,
  };
  const website = {
    "@context": "https://schema.org", "@type": "WebSite", "@id": `${site.url}/#website`,
    url: site.url, name: "آرشیو رسمی آثار مصطفی صمدی", inLanguage: "fa",
    author: { "@id": `${site.url}/#person` },
  };
  const archive = {
    "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${site.url}/#archive`,
    name: "آرشیو رسمی آثار مصطفی صمدی", url: site.url, inLanguage: "fa",
    author: { "@id": `${site.url}/#person` },
    hasPart: books.map((book) => ({ "@type": "Book", name: book.title, url: `${site.url}/books/${book.slug}`, identifier: book.archiveId })),
  };
  return <html lang="fa" dir="rtl"><body>
    <JsonLd data={person} /><JsonLd data={website} /><JsonLd data={archive} />
    <Header /><main>{children}</main><Footer />
  </body></html>;
}
