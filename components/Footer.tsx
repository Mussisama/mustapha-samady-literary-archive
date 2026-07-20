import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">

      <div className="container footer-grid-final">

        {/* LEFT */}

        <div className="footer-column footer-note-final">
          <p>
            این آرشیو برای دسترسی آزاد و ماندگاری
            <br />
            آثار ادبی مصطفی صمدی ایجاد شده است.
          </p>
        </div>

        {/* CENTER */}

        <div className="footer-column footer-nav-final">
          <Link href="/poems">شعرها</Link>
          <Link href="/books">کتاب‌ها</Link>
          <Link href="/criticism">نقد و نظر</Link>
          <Link href="/topics">موضوع‌ها</Link>
          <Link href="/about">درباره من</Link>
        </div>

        {/* RIGHT */}

        <div className="footer-column footer-brand-final">
          <h3>Mustapha Samady</h3>

          <p className="footer-role">
            DIGITAL LITERARY ARCHIVE
          </p>

          <p className="footer-place">
            Berlin, Germany
          </p>
        </div>

      </div>

      <div className="container footer-bottom-final">
        <span>© 2026 Mustapha Samady</span>
        <span>|</span>
        <a href="/rss.xml">RSS</a>
      </div>

    </footer>
  );
}