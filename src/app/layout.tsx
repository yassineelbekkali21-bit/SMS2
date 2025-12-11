import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Science Made Simple - L'apprentissage scientifique réinventé",
  description: "Découvrez une nouvelle façon d'apprendre les sciences avec des quiz interactifs, une communauté d'entraide et des certifications blockchain. Rejoignez la révolution de l'éducation Web 3.0.",
  keywords: ["science", "apprentissage", "éducation", "quiz", "communauté", "Web3", "blockchain", "certifications"],
  authors: [{ name: "Science Made Simple Team" }],
  creator: "Science Made Simple",
  publisher: "Science Made Simple",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://sciencemadesimple.io",
    siteName: "Science Made Simple",
    title: "Science Made Simple - L'apprentissage scientifique réinventé",
    description: "Découvrez une nouvelle façon d'apprendre les sciences avec des quiz interactifs, une communauté d'entraide et des certifications blockchain.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Science Made Simple - Plateforme d'apprentissage scientifique"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@ScienceMadeSimple",
    creator: "@ScienceMadeSimple",
    title: "Science Made Simple - L'apprentissage scientifique réinventé",
    description: "Découvrez une nouvelle façon d'apprendre les sciences avec des quiz interactifs, une communauté d'entraide et des certifications blockchain.",
    images: ["/og-image.jpg"]
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Science Made Simple"
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { ColorSwitcher } from "@/components/ColorSwitcher";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/brand/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AccessibilityProvider>
          {children}
        </AccessibilityProvider>
        <ColorSwitcher />
      </body>
    </html>
  );
}
