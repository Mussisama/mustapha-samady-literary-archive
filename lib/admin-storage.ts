import fs from "fs/promises";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const poemsFile = path.join(dataDir, "poems.json");
const booksFile = path.join(dataDir, "books.json");
const criticismFile = path.join(dataDir, "criticism.json");

const githubToken = process.env.GITHUB_TOKEN?.trim();
const githubOwner = process.env.GITHUB_OWNER?.trim() || "Mussisama";
const githubRepo = process.env.GITHUB_REPO?.trim() || "mustapha-samady-literary-archive";
const githubBranch = process.env.GITHUB_BRANCH?.trim() || "main";

function githubEnabled() {
  return Boolean(githubToken);
}

function githubApiUrl(filePath: string) {
  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${encodedPath}`;
}

function githubHeaders() {
  if (!githubToken) throw new Error("GITHUB_TOKEN is not configured");
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${githubToken}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "mustapha-samady-literary-archive",
  };
}

async function getGitHubFile(filePath: string, allowMissing = false) {
  const response = await fetch(`${githubApiUrl(filePath)}?ref=${encodeURIComponent(githubBranch)}`, {
    headers: githubHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    if (allowMissing && response.status === 404) return null;
    const details = await response.text();
    throw new Error(`GitHub read failed (${response.status}): ${details}`);
  }

  const file = await response.json() as {
    sha: string;
    content: string;
    encoding: string;
  };

  if (file.encoding !== "base64") {
    throw new Error(`Unsupported GitHub encoding: ${file.encoding}`);
  }

  return {
    sha: file.sha,
    buffer: Buffer.from(file.content.replace(/\n/g, ""), "base64"),
  };
}

async function updateGitHubFile(filePath: string, buffer: Buffer, commitMessage: string) {
  const current = await getGitHubFile(filePath, true);
  const response = await fetch(githubApiUrl(filePath), {
    method: "PUT",
    headers: {
      ...githubHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: commitMessage,
      content: buffer.toString("base64"),
      ...(current ? { sha: current.sha } : {}),
      branch: githubBranch,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`GitHub write failed (${response.status}): ${details}`);
  }

  return response.json() as Promise<{
    commit?: { html_url?: string; sha?: string };
    content?: { html_url?: string };
  }>;
}

async function readJson<T>(localFile: string, githubPath: string): Promise<T> {
  if (githubEnabled()) {
    const remote = await getGitHubFile(githubPath);
    if (!remote) throw new Error(`GitHub file not found: ${githubPath}`);
    return JSON.parse(remote.buffer.toString("utf8")) as T;
  }

  return JSON.parse(await fs.readFile(localFile, "utf8")) as T;
}

async function writeJson(githubPath: string, localFile: string, value: unknown, commitMessage: string) {
  const buffer = Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8");

  if (githubEnabled()) {
    return updateGitHubFile(githubPath, buffer, commitMessage);
  }

  await fs.writeFile(localFile, buffer);
  return { local: true };
}

export async function readPoems() {
  return readJson<any[]>(poemsFile, "data/poems.json");
}

export async function writePoems(poems: unknown[], commitMessage = "Update poem content from admin") {
  return writeJson("data/poems.json", poemsFile, poems, commitMessage);
}

export async function readBooks() {
  return readJson<any[]>(booksFile, "data/books.json");
}

export async function writeBooks(books: unknown[], commitMessage = "Update book metadata from admin") {
  return writeJson("data/books.json", booksFile, books, commitMessage);
}

export async function writePublicFile(filePath: string, buffer: Buffer, commitMessage: string) {
  if (githubEnabled()) {
    return updateGitHubFile(filePath, buffer, commitMessage);
  }

  const localPath = path.join(process.cwd(), filePath);
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, buffer);
  return { local: true };
}

export async function readCriticism() {
  return readJson<any[]>(criticismFile, "data/criticism.json");
}

export async function writeCriticism(items: unknown[], commitMessage = "Update criticism from admin") {
  return writeJson("data/criticism.json", criticismFile, items, commitMessage);
}
