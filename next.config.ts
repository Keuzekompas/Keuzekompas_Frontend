import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
  },
  experimental: {
  },
  allowedDevOrigins: process.env.LOCAL_IPV4 
    ? [process.env.LOCAL_IPV4, "localhost"] 
    : ["localhost"],
  output: "standalone",
  /* config options here */
};

export default nextConfig;