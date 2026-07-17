import {
  automaticSeoDescription,
  automaticSeoTitle,
} from "@/lib/seo";

export type SeoInput = {
  title?: string;
  displayTitle?: string;
  displayNumber?: string;
  body?: string;
  bookTitle?: string;
  bookSlug?: string;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  topics?: string[];
  keywords?: string[];
  status?: string;
  startPage?: number;
  endPage?: number;
};

export function calculateSeoScore(item: SeoInput) {
  const completeItem = {
    title: item.title || "",
    displayTitle: item.displayTitle,
    displayNumber: item.displayNumber,
    body: item.body || "",
    bookTitle: item.bookTitle || "",
    bookSlug: item.bookSlug || "",
    slug: item.slug || "",
    seoTitle: item.seoTitle,
    seoDescription: item.seoDescription,
  };

  const generatedTitle = automaticSeoTitle(completeItem);
  const generatedDescription = automaticSeoDescription(completeItem);

  const checks = [
    { label: "عنوان اثر", ok: Boolean(item.title?.trim()), points: 10 },
    { label: "متن کامل", ok: Boolean(item.body && item.body.trim().length >= 80), points: 20 },
    { label: "SEO Title", ok: generatedTitle.length >= 20 && generatedTitle.length <= 75, points: 10 },
    { label: "SEO Description", ok: generatedDescription.length >= 70 && generatedDescription.length <= 190, points: 15 },
    { label: "موضوع دقیق", ok: Boolean(item.topics && item.topics.length >= 2), points: 15 },
    { label: "کلیدواژه کافی", ok: Boolean(item.keywords && item.keywords.length >= 5), points: 10 },
    { label: "صفحات کتاب", ok: Boolean(item.startPage && item.endPage), points: 5 },
    { label: "وضعیت انتشار", ok: item.status === "published", points: 5 },
    { label: "پیوند درون‌سایتی", ok: Boolean(item.bookSlug && item.slug), points: 5 },
  ];

  const raw = checks.reduce((sum, check) => sum + (check.ok ? check.points : 0), 0);
  const score = Math.min(95, raw);

  return { score, checks };
}
