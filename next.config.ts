import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    largePageDataBytes: 1024 * 256,
  },
};

export default nextConfig;
