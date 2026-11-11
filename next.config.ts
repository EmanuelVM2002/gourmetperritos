import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio 100 % estático: se publica la carpeta `out` (Cloudflare Pages, GitHub Pages...).
  output: "export",
  images: {
    // El optimizador de imágenes de Next necesita un servidor; en hosting estático se sirven tal cual.
    unoptimized: true,
  },
};

export default nextConfig;
