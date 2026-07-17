import fs from "fs/promises";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const poemsFile = path.join(dataDir, "poems.json");
const booksFile = path.join(dataDir, "books.json");

export async function readPoems() {
  return JSON.parse(await fs.readFile(poemsFile, "utf8"));
}

export async function writePoems(poems: unknown[]) {
  await fs.writeFile(poemsFile, JSON.stringify(poems, null, 2), "utf8");
}

export async function readBooks() {
  return JSON.parse(await fs.readFile(booksFile, "utf8"));
}

export async function writeBooks(books: unknown[]) {
  await fs.writeFile(booksFile, JSON.stringify(books, null, 2), "utf8");
}
