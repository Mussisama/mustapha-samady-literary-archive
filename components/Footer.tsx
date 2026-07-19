import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-name">Mustapha Samady</div>
          <div className="footer-role">Official Literary Archive</div>
          <div className="footer-place">Berlin, Germany</div>
        </div>
        <div className="footer-links">
          <Link href="/books">کتاب‌ها</Link>
          <Link href="/criticism">نقد و نظر</Link>
          <Link href="/topics">موضوع‌ها</Link>
          <Link href="/about">درباره من</Link>
          <a href="/rss.xml">RSS</a>
        </div>
        <div className="footer-note">
          تمام آثار ادبی این آرشیو به‌صورت آزاد و رایگان در دسترس‌اند.
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© ۲۰۲۶ Mustapha Samady</span>
        <span>تمامی حقوق مادی و معنوی آثار متعلق به مصطفی صمدی است.</span>
      </div>
    </footer>
  );
}
