import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Next's own optimizer would read admin-uploaded files through the same
    // stale public/ snapshot the /uploads route works around (see
    // app/uploads/[...path]/route.ts). Uploads are resized by our own /media
    // route instead; lib/image-loader.ts points next/image at it.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
};

export default nextConfig;
