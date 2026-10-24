import type { NextConfig } from "next";

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://retouchafrica.com");
const isLocal = ["localhost", "127.0.0.1"].includes(siteUrl.hostname);

const nextConfig: NextConfig = {
  // One canonical host: send www.<domain> to <domain> permanently so search
  // engines don't index both.
  async redirects() {
    if (isLocal) return [];
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${siteUrl.hostname}` }],
        destination: `${siteUrl.origin}/:path*`,
        permanent: true,
      },
    ];
  },
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
