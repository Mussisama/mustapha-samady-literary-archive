import Link from "next/link";

export function Header() {
  return (
    <header className="topbar">
      <nav className="nav container" aria-label="ناوبری اصلی">
        <Link href="/poems">شعرها</Link>
        <Link href="/books">کتاب‌ها</Link>
        <Link href="/criticism">نقد و نظر</Link>
        <Link href="/topics">موضوع‌ها</Link>
        <Link href="/about">درباره من</Link>
      </nav>
    </header>
  );
}
