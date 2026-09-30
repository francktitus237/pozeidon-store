import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // requis pour le Dockerfile Dokploy
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.137.96"],
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
