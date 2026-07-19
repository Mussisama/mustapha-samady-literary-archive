import booksData from "@/data/books.json";
import poemsData from "@/data/poems.json";
import topicsData from "@/data/topics.json";
import criticismData from "@/data/criticism.json";

export type Book = (typeof booksData)[number];
export type Poem = (typeof poemsData)[number];
export type Topic = (typeof topicsData)[number];
export type Criticism = (typeof criticismData)[number];

export const books = [...booksData].sort((a, b) => (a.order || 999) - (b.order || 999));
export const poems = poemsData;
export const topics = topicsData;
export const criticism = criticismData;

export function getBook(slug: string) {
  return books.find((book) => book.slug === slug);
}
export function getPoem(slug: string) {
  return poems.find((poem) => poem.slug === slug);
}
export function getBookPoems(bookSlug: string, includeDrafts = false) {
  return poems
    .filter((poem) => poem.bookSlug === bookSlug && (includeDrafts || poem.status === "published"))
    .sort((a, b) => a.order - b.order);
}
export function getBookPoem(bookSlug: string, poemSlug: string, includeDrafts = false) {
  return poems.find((poem) =>
    poem.bookSlug === bookSlug &&
    poem.slug === poemSlug &&
    (includeDrafts || poem.status === "published")
  );
}
export function getAdjacentPoems(bookSlug: string, poemOrder: number, includeDrafts = false) {
  const list = getBookPoems(bookSlug, includeDrafts);
  const index = list.findIndex((poem) => poem.order === poemOrder);
  return {
    previous: index > 0 ? list[index - 1] : null,
    next: index >= 0 && index < list.length - 1 ? list[index + 1] : null,
  };
}

export function getCriticism(segment: string) {
  return criticism.find((item) => item.slug === segment || item.id === segment);
}
export function getBookCriticism(bookSlug: string) {
  return criticism.filter((item) => item.relatedBook === bookSlug && item.status === "published");
}
export function getPoemCriticism(poemId: string) {
  return criticism.filter((item) => item.relatedPoem === poemId && item.status === "published");
}

export function criticismUrlSegment(item: { id: string; slug?: string }) {
  const slug = String(item.slug || "");
  return /^[a-z0-9-]+$/i.test(slug) ? slug : item.id;
}
