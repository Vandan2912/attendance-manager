import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // dont check for eslink rules
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
