import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mustapha Samady Literary Archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", background: "#f5f0e8",
      color: "#171513", fontFamily: "serif"
    }}>
      <div style={{ fontSize: 76 }}>Mustapha Samady</div>
      <div style={{ marginTop: 24, fontSize: 30 }}>Contemporary Afghan Poet &amp; Writer</div>
    </div>,
    size
  );
}
