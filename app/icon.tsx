import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: -1,
        }}
      >
        <span style={{ color: "#ffffff" }}>R</span>
        <span style={{ color: "#c9971e" }}>A</span>
      </div>
    ),
    { ...size },
  );
}
