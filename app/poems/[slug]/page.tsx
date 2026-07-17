import { redirect, notFound } from "next/navigation";
import { poems, getPoem } from "@/lib/data";

export function generateStaticParams() {
  return poems.map((poem) => ({ slug: poem.slug }));
}

export default async function LegacyPoemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const poem = getPoem(slug);
  if (!poem) notFound();
  redirect(`/books/${poem.bookSlug}/${poem.slug}`);
}
