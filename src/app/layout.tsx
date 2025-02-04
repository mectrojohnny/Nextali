import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 0.8,
  maximumScale: 0.8,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Nextali",
  description: "Building Innovative Tech-Driven Business Solutions and Amazing communities for Startups, SME's and Entrepreneurs",
  keywords: ["Tech Solutions", "Business Innovation", "Startups", "SME", "Entrepreneurs", "Community Building", "Digital Solutions", "Tech-Driven Business", "Business Development"],
  authors: [{ name: "Nextali Team" }],
  creator: "Nextali",
  publisher: "Nextali",
  category: "Technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo.png', sizes: '48x48', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/logo.png'],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nextali.com',
    title: 'Nextali - Tech-Driven Business Solutions',
    description: "Building Innovative Tech-Driven Business Solutions and Amazing communities for Startups, SME's and Entrepreneurs",
    siteName: 'Nextali',
    images: [{
      url: '/logo.png',
      width: 1200,
      height: 630,
      alt: 'Nextali - Innovative Tech Solutions',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nextali - Tech-Driven Business Solutions',
    description: "Building Innovative Tech-Driven Business Solutions and Amazing communities for Startups, SME's and Entrepreneurs",
    images: ['/logo.png'],
    creator: '@nextali',
    site: '@nextali',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="beforeInteractive"
        />
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
