import type { MetadataRoute } from "next";
import { books, poems, topics } from "@/lib/data";
import { site } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
 const now=new Date(); const publishedBooks=books.filter(b=>b.isPublished); const publishedWorks=poems.filter(p=>p.status==="published");
 return [
  {url:site.url,lastModified:now,changeFrequency:"monthly",priority:1},
  {url:`${site.url}/books`,lastModified:now,changeFrequency:"monthly",priority:.9},
  {url:`${site.url}/topics`,lastModified:now,changeFrequency:"monthly",priority:.8},
  {url:`${site.url}/about`,lastModified:now,changeFrequency:"yearly",priority:.75},
  ...publishedBooks.map(b=>({url:`${site.url}/books/${b.slug}`,lastModified:b.datePublished?new Date(b.datePublished):now,changeFrequency:"yearly" as const,priority:.85})),
  ...publishedWorks.map(p=>({url:`${site.url}/books/${p.bookSlug}/${p.slug}`,lastModified:now,changeFrequency:"yearly" as const,priority:.75})),
  ...topics.map(t=>({url:`${site.url}/topics/${t.slug}`,lastModified:now,changeFrequency:"monthly" as const,priority:.7})),
 ];
}
