export function persianDigits(value: string | number) {
  return String(value).replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

export function poemDisplayLabel(
  poem: { title: string; displayNumber?: string },
  titleMode?: string
) {
  if (titleMode === "prose-numbered") {
    if (poem.title === "صفر") return "صفر";
    return `نوشته شماره ${persianDigits(poem.displayNumber || poem.title)}`;
  }
  if (titleMode === "numbered") {
    return `شعر شماره ${persianDigits(poem.displayNumber || poem.title)}`;
  }
  return poem.title;
}
