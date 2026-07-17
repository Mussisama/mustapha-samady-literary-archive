import Link from "next/link";

export function Header() {
  return (
    <header className="topbar">
      <nav className="nav container" aria-label="ناوبری اصلی">
        <Link href="/">خانه</Link>
        <Link href="/books">کتاب‌ها</Link>
        <Link href="/topics">موضوع‌ها</Link>
        <Link href="/about">درباره من</Link>
      </nav>
    </header>
  );
}
