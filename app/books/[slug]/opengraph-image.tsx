import { ImageResponse } from "next/og";
import { getBook } from "@/lib/data";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = "Mustapha Samady — Official Literary Archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getBook(slug);
  const coverUrl = book?.cover ? new URL(book.cover, site.url).toString() : null;

  return new ImageResponse(
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      background: "#f5f0e8",
      color: "#171513",
      padding: "56px 70px",
      alignItems: "center",
      justifyContent: "space-between",
      fontFamily: "serif",
      direction: "rtl",
    }}>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: "720px", alignItems: "flex-start" }}>
        <div style={{ fontSize: 28, color: "#78664f" }}>اثر منتشرشده</div>
        <div style={{ fontSize: 76, lineHeight: 1.2, marginTop: 20 }}>{book?.title || "Mustapha Samady"}</div>
        <div style={{ fontSize: 31, marginTop: 28 }}>مصطفی صمدی</div>
        <div style={{ fontSize: 20, marginTop: 18, color: "#78664f" }}>Official Literary Archive</div>
      </div>
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={book?.title || "Book cover"}
          width="300"
          height="470"
          style={{ objectFit: "cover", boxShadow: "0 18px 50px rgba(0,0,0,.18)" }}
        />
      ) : null}
    </div>,
    size
  );
}
