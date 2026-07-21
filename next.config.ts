import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@google/model-viewer'],
  allowedDevOrigins: ['192.168.1.142'],
};

export default nextConfig;