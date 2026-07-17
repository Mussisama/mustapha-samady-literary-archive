import { poems, topics } from "@/lib/data";

function normalize(value: string) {
  return value
    .replace(/\u200c/g, " ")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .toLowerCase();
}

export function poemMatchesTopic(poem: (typeof poems)[number], topic: (typeof topics)[number]) {
  const haystack = normalize([
    poem.title,
    poem.body,
    ...(poem.topics || []),
    ...(poem.keywords || []),
  ].join(" "));

  const needles = [
    topic.title,
    ...(topic.keywords || []),
    ...((topic as any).aliases || []),
  ].map(normalize);

  return needles.some((needle) => needle && haystack.includes(needle));
}

export function poemsForTopic(topicSlug: string) {
  const topic = topics.find((item) => item.slug === topicSlug);
  if (!topic) return [];
  return poems.filter((poem) => poem.status === "published" && poemMatchesTopic(poem, topic));
}

export function topicOpportunity(topicSlug: string) {
  const topic = topics.find((item) => item.slug === topicSlug);
  if (!topic) return null;

  const related = poemsForTopic(topicSlug);
  const books = new Set(related.map((poem) => poem.bookSlug));
  const count = related.length;

  const contentScore = Math.min(45, count * 3);
  const diversityScore = Math.min(25, books.size * 8);
  const keywordScore = Math.min(15, (topic.keywords || []).length * 5);
  const baseScore = 10;
  const score = Math.min(95, baseScore + contentScore + diversityScore + keywordScore);

  let status = "ضعیف";
  if (score >= 80) status = "قوی";
  else if (score >= 60) status = "خوب";
  else if (score >= 40) status = "در حال رشد";

  return {
    topic,
    related,
    bookCount: books.size,
    score,
    status,
  };
}
