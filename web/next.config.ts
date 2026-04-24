import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Remote image hosts allowed for `next/image`.
    // - picsum.photos: seeded photo placeholders used by the PhotoCard demo
    //   until real licensed accident photography is dropped in.
    // - images.unsplash.com: swap-in slot for production photos, so marketing
    //   can change the URLs in components without another `next.config` edit.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
