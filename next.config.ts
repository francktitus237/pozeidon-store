import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // requis pour le Dockerfile Dokploy
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.137.96"],
  serverExternalPackages: ["better-sqlite3"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  // Compat : les anciens uploads étaient enregistrés sous /images/<uuid>.
  // Si le fichier n'existe pas dans public/images, on retombe sur /uploads/.
  async rewrites() {
    return {
      fallback: [
        { source: "/images/:name", destination: "/uploads/:name" },
      ],
    };
  },
};

export default nextConfig;
