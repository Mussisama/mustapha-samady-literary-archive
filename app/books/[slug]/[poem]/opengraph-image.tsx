import { ImageResponse } from "next/og";
import { getBook, getBookPoem } from "@/lib/data";
import { poemDisplayLabel } from "@/lib/labels";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = "Mustapha Samady literary work";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; poem: string }>;
}) {
  const p = await params;
  const book = getBook(p.slug);
  const work = getBookPoem(p.slug, p.poem, true);
  const coverUrl = book?.cover ? new URL(book.cover, site.url).toString() : null;
  const label = work && book ? poemDisplayLabel(work, book.titleMode) : "اثر ادبی";

  return new ImageResponse(
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      background: "#f5f0e8",
      color: "#171513",
      padding: "58px 68px",
      alignItems: "center",
      justifyContent: "space-between",
      fontFamily: "serif",
      direction: "rtl",
    }}>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: "730px", alignItems: "flex-start" }}>
        <div style={{ fontSize: 27, color: "#78664f" }}>{book?.title}</div>
        <div style={{ fontSize: 65, lineHeight: 1.25, marginTop: 24 }}>{label}</div>
        <div style={{ fontSize: 30, marginTop: 36 }}>مصطفی صمدی</div>
        <div style={{ fontSize: 19, marginTop: 16, color: "#78664f" }}>Official Literary Archive</div>
      </div>
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={book?.title || "Book cover"}
          width="280"
          height="440"
          style={{ objectFit: "cover", boxShadow: "0 18px 50px rgba(0,0,0,.18)" }}
        />
      ) : null}
    </div>,
    size
  );
}
