import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { poems } from "@/lib/data";
import { PoemEditor } from "./PoemEditor";
import { getBook } from "@/lib/data";
import { poemDisplayLabel } from "@/lib/labels";

export default async function AdminPoemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  const poem = poems.find(item => item.id === id);
  if (!poem) notFound();

  return (
    <div className="admin-page">
      <div className="admin-heading-row">
        <div>
          <Link href={`/admin/books/${poem.bookSlug}`}>{poem.bookTitle} ←</Link>
          <h1>{poemDisplayLabel(poem, getBook(poem.bookSlug)?.titleMode)}</h1>
        </div>
      </div>
      <PoemEditor poem={poem} />
    </div>
  );
}
