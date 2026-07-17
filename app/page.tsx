import Link from "next/link";
import { BookCard } from "@/components/BookCard";
import { books, topics } from "@/lib/data";

export default function HomePage() {

  return (
    <>
      <header className="hero container">
        <div className="hero-mark">Digital Literary Archive</div>
        <h1>Mustapha Samady</h1>
        <p className="hero-role">Contemporary Afghan Poet &amp; Writer</p>
      </header>

      <section className="books-section">
        <div className="container">
          <div className="section-head"><h2>کتاب‌ها</h2></div>
          <div className="books-grid">
            {books.map((book) => <BookCard key={book.slug} book={book} />)}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head"><h2>موضوع‌ها</h2></div>
          <div className="topic-grid">
            {topics.map((topic) => (
              <Link className="topic-card" href={`/topics/${topic.slug}`} key={topic.slug}>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
