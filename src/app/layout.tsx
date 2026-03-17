import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.smartap.cl"),
  title: {
    default: "Smartap - Calculadora de Comida Chilena ERP",
    template: "%s | Smartap",
  },
  description: "Calculadora de comida, completos, inventory management y ERP gratuito para negocios de comida en Chile. Calcula ingredientes, costos, logística y ventas. 100% gratis.",
  keywords: [
    "calculadora de comida",
    "calculadora completos",
    "calculadora empanadas",
    "ERP comida",
    "gestion food truck",
    "carrito chileno",
    "calculadora ingredientes",
    "costos comida",
    "inventario restaurant",
    "ERP gratuito Chile",
    "gestión pedidos comida",
    "calculadora sandwich",
    "control inventario comida",
  ],
  authors: [{ name: "Smartap", url: "https://www.smartap.cl" }],
  creator: "Smartap",
  publisher: "Smartap",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://www.smartap.cl",
    siteName: "Smartap",
    title: "Smartap - Calculadora de Comida Chilena ERP",
    description: "Calculadora de comida, completos, inventory management y ERP gratuito para negocios de comida en Chile.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Smartap - ERP para Negocios de Comida",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smartap - Calculadora de Comida Chilena ERP",
    description: "Calculadora de comida y ERP gratuito para negocios de comida en Chile.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.smartap.cl",
    languages: {
      es: "https://www.smartap.cl",
    },
  },
  category: "business",
  classification: "ERP, Calculator, Food Business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Smartap",
              "alternateName": "Smartap ERP",
              "description": "Calculadora de comida y ERP gratuito para negocios de comida en Chile",
              "url": "https://www.smartap.cl",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "CLP",
                "availability": "https://schema.org/InStock"
              },
              "featureList": [
                "Calculadora de ingredientes",
                "Control de inventario",
                "Gestión de eventos",
                "Cálculo de costos",
                "Logística de delivery",
                "Multi-usuario"
              ],
              "author": {
                "@type": "Organization",
                "name": "Smartap",
                "url": "https://www.smartap.cl"
              }
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
