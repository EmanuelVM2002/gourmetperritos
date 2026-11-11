import type { Metadata, Viewport } from "next";
import "@fontsource/russo-one/latin-400.css";
import "@fontsource-variable/manrope/wght.css";
import "./globals.css";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  // Cambiar por el dominio real al publicar (variable NEXT_PUBLIC_SITE_URL).
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description:
    "Sushi, baos, arroces, perritos gourmet, hamburguesas y mucho más. Pide por WhatsApp en la UVA de El Poblado, Sabaneta y Provenza.",
  openGraph: {
    title: siteConfig.name,
    description: "No vinimos a comer lo de siempre. Vinimos a despertar tus antojos.",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/logo.png", width: 640, height: 640 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
