import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/data";

export function BookCard({ book }: { book: Book }) {
  const isPriority = book.order === 1;

  return (
    <article className="book-card">
      <Link
        href={`/books/${book.slug}`}
        aria-label={`مشاهده کتاب ${book.title}`}
      >
        <Image
          src={book.cover}
          alt={`کاور ${book.kind} ${book.title} اثر مصطفی صمدی`}
          width={540}
          height={760}
          className="book-cover"
          priority={isPriority}
          loading={isPriority ? "eager" : "lazy"}
          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 40vw, 280px"
        />

        <h3>{book.title}</h3>

        <p>
          {book.kind} ·{" "}
          {book.contentModel === "silent-book"
            ? `${book.silentPageCount || 100} صفحه سکوت`
            : book.contentModel === "prose"
              ? `${book.textCount || book.poemCount || 0} نوشته`
              : `${book.poemCount || 0} عنوان`}
        </p>
      </Link>
    </article>
  );
}