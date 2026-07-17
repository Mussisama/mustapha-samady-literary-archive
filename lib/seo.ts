type SeoPoem = {
  title: string;
  displayTitle?: string;
  webTitle?: string;
  displayNumber?: string;
  body: string;
  bookTitle: string;
  bookSlug: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
};

type SeoBook = {
  title: string;
  titleMode?: string;
};

function cleanWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function poemWebTitle(poem: SeoPoem, book?: SeoBook) {
  const isNumbered =
    book?.titleMode === "numbered" ||
    /^\d+$/.test(poem.title.trim()) ||
    /^\d+$/.test((poem.displayTitle || "").trim());

  if (book?.titleMode === "prose-numbered") {
    if (poem.title === "صفر") return `متن «صفر» از کتاب ${poem.bookTitle}`;
    const number = poem.displayNumber || poem.title;
    return `نوشته شماره ${number} از کتاب ${poem.bookTitle}`;
  }

  if (isNumbered) {
    const number = poem.displayNumber || poem.title;
    return `شعر شماره ${number} از مجموعه ${poem.bookTitle}`;
  }

  return poem.webTitle?.trim() || poem.displayTitle?.trim() || poem.title.trim();
}

export function automaticSeoTitle(poem: SeoPoem, book?: SeoBook) {
  return `${poemWebTitle(poem, book)} | Mustapha Samady`;
}

export function automaticSeoDescription(poem: SeoPoem, book?: SeoBook) {
  const title = poemWebTitle(poem, book);
  const firstLines = cleanWhitespace(
    poem.body
      .split("\n")
      .filter(Boolean)
      .slice(0, 3)
      .join(" ")
  ).slice(0, 145);

  const base = `متن کامل ${title} اثر Mustapha Samady از کتاب «${poem.bookTitle}».`;
  return firstLines ? `${base} ${firstLines}` : base;
}

export function resolvedSeoTitle(poem: SeoPoem, book?: SeoBook) {
  return poem.seoTitle?.trim() || automaticSeoTitle(poem, book);
}

export function resolvedSeoDescription(poem: SeoPoem, book?: SeoBook) {
  return poem.seoDescription?.trim() || automaticSeoDescription(poem, book);
}
