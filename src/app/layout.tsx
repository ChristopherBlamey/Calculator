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
  maximumScale: 5,
  userScalable: true,
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
    "ERP Santiago Chile",
    "software restaurant Chile",
    " delivery Chile",
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
    description: "Calculadora de comida, inventory management y ERP gratuito para negocios de comida en Chile.",
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
      "es-CL": "https://www.smartap.cl",
    },
  },
  other: {
    "geo.region": "CL",
    "geo.placename": "Santiago",
    "geo.position": "-33.4489;-70.6693",
    ICBM: "-33.4489, -70.6693",
    "business:contactdata:street_address": "Santiago",
    "business:contactdata:locality": "Santiago",
    "business:contactdata:region": "Metropolitana",
    "business:contactdata:country_name": "Chile",
  },
  category: "business",
  classification: "ERP, Calculator, Food Business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Smartap (Blamey ERP)",
    "alternateName": ["Blamey ERP", "Calculadora de Comida Chilena"],
    "description": "ERP gratuito y calculadora de comida para negocios de comida en Chile. Calcula ingredientes, costos, logística y ventas. 100% gratis.",
    "url": "https://www.smartap.cl",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser, Android, iOS",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CLP",
      "availability": "https://schema.org/InStock"
    },
    "author": {
      "@type": "Organization",
      "name": "Smartap",
      "url": "https://www.smartap.cl",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "contacto@smartap.cl"
      }
    },
    "featureList": [
      "Calculadora de ingredientes para completos, hamburguesas, empanadas",
      "Control de inventario y materia prima",
      "Gestión de eventos y ventas",
      "Cálculo automático de costos de producción",
      "Logística de delivery con Google Maps",
      "Multi-usuario con Google Auth",
      "Generación de listas de compras",
      "Presupuestos en PDF"
    ],
    "screenshot": "https://www.smartap.cl/og-image.png",
    "softwareVersion": "1.8",
    "datePublished": "2024-01-01",
    "inLanguage": ["es", "es-CL"],
    "country": "Chile",
    "areaServed": {
      "@type": "Country",
      "name": "Chile"
    },
    "potentialAction": {
      "@type": "UseAction",
      "target": "https://www.smartap.cl"
    }
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
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
