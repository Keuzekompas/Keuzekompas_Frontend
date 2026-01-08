import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
  },
  experimental: {
  },
  allowedDevOrigins: process.env.LOCAL_IPV4 
    ? [process.env.LOCAL_IPV4, "localhost"] 
    : ["localhost"],
};

export default nextConfig;