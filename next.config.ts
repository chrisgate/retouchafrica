import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Uploads are already resized by sharp at upload time (lib/uploads.ts);
    // skipping Next's own optimizer avoids it needing to read admin-uploaded
    // files through the same stale public/ snapshot the /uploads route works
    // around (see app/uploads/[...path]/route.ts).
    unoptimized: true,
  },
};

export default nextConfig;
