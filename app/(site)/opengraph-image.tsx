import { ImageResponse } from "next/og";

export const alt = "Retouch Africa — Elevating the Art of Retouching Across Africa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#0a0a0a",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", width: 96, height: 4, background: "#c9971e" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
            fontSize: 132,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          <span style={{ color: "#ffffff" }}>RETOUCH</span>
          <span style={{ color: "#c9971e" }}>AFRICA</span>
        </div>
        <div style={{ display: "flex", marginTop: 44, fontSize: 38, color: "rgba(255,255,255,0.72)" }}>
          Elevating the art of retouching across Africa.
        </div>
      </div>
    ),
    { ...size },
  );
}
