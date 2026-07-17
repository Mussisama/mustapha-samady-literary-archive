import type { Metadata } from "next";
import { BookCard } from "@/components/BookCard";
import { books } from "@/lib/data";

export const metadata: Metadata = {
  title: "کتاب‌ها و مجموعه شعرها",
  description: "فهرست کتاب‌ها، مجموعه شعرها و نثرهای مصطفی صمدی با متن کامل و PDF رایگان.",
  alternates: { canonical: "/books" },
};

export default function BooksPage() {
  return (
    <div className="page container">
      <div className="breadcrumbs"><a href="/">خانه</a> / کتاب‌ها</div>
      <h1>کتاب‌ها و مجموعه‌ها</h1>
      <p className="lead">تمام آثار منتشرشده مصطفی صمدی، با فهرست کامل و دسترسی آزاد.</p>
      <div className="books-grid">{books.map((book) => <BookCard key={book.slug} book={book} />)}</div>
    </div>
  );
}
