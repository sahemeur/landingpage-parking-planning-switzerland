import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // allow <Image /> with static export
  },
  experimental: {
    largePageDataBytes: 1024 * 256,
  },
};

export default nextConfig;
