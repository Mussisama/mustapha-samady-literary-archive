import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-freeze">

        <div className="footer-note-freeze">
          این آرشیو برای دسترسی آزاد و ماندگاری
          <br />
          آثار ادبی مصطفی صمدی ایجاد شده است.
        </div>

        <div className="footer-links-freeze">
          <Link href="/poems">شعرها</Link>
          <Link href="/books">کتاب‌ها</Link>
          <Link href="/criticism">نقد و نظر</Link>
          <Link href="/topics">موضوع‌ها</Link>
          <Link href="/about">درباره من</Link>
        </div>

        <div className="footer-brand-freeze">
          <div className="footer-name">
            Mustapha Samady
          </div>

          <div className="footer-role">
            DIGITAL LITERARY ARCHIVE
          </div>

          <div className="footer-place">
            Berlin, Germany
          </div>
        </div>

      </div>

      <div className="container footer-bottom-freeze">
        <span>© 2026 Mustapha Samady</span>
        <a href="/rss.xml">RSS</a>
      </div>
    </footer>
  );
}