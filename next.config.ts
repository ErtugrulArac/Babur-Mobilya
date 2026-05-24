import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { hostname: "hblimg.mmtcdn.com" },
    ],
  },
};

export default nextConfig;
