import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Terraventos | Investimentos Imobiliários no Nordeste",
    template: "%s | Terraventos",
  },
  description:
    "Terraventos conecta você a oportunidades únicas de investimento imobiliário no Nordeste brasileiro, com foco em áreas litorâneas de alto potencial de valorização.",
  keywords: [
    "Terraventos",
    "imóveis no Nordeste",
    "investimento imobiliário",
    "lotes à venda",
    "praia",
    "Ceará",
    "Nordeste Brasil",
  ],
  authors: [{ name: "Terraventos" }],
  creator: "Terraventos",
  publisher: "Terraventos",
  metadataBase: new URL("https://terraventos.com"), // ajuste para o domínio final
  openGraph: {
    title: "Terraventos | Investimentos Imobiliários no Nordeste",
    description:
      "Descubra terrenos exclusivos e oportunidades únicas de valorização no litoral nordestino com a Terraventos.",
    url: "https://terraventos.com",
    siteName: "Terraventos",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://terraventos.com/og-image.jpg", // colocar imagem OG real
        width: 1200,
        height: 630,
        alt: "Terraventos - Investimentos Imobiliários no Nordeste",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terraventos | Investimentos Imobiliários no Nordeste",
    description:
      "Encontre oportunidades únicas de investimento imobiliário no litoral nordestino com a Terraventos.",
    images: ["https://terraventos.com/og-image.jpg"], // mesma imagem ou outra otimizada
    creator: "@Terraventos", // se tiver Twitter oficial
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
