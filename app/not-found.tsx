import Link from "next/link";
export default function NotFound(){return <div className="not-found container"><div className="eyebrow">404</div><h1>این صفحه پیدا نشد</h1><p>ممکن است نشانی تغییر کرده باشد یا صفحه وجود نداشته باشد.</p><Link href="/">بازگشت به خانه</Link></div>}
