import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Load your custom SauceTM font
const sauceTM = localFont({
  src: "../fonts/SauceTM-Regular.woff2",
  variable: "--font-sauce-tm",
  weight: "400",
  style: "normal",
});

export const metadata: Metadata = {
  title: "Nut November - A month-long hackathon for Cashu builders",
  description: "A month-long hackathon for Cashu builders who just can't hold their nuts.",
  openGraph: {
    title: "Nut November - A month-long hackathon for Cashu builders",
    description: "A month-long hackathon for Cashu builders who just can't hold their nuts.",
    url: "https://nutnovember.org",
    siteName: "Nut November",
    images: [
      {
        url: "https://nutnovember.org/opengraph.jpg",
        width: 1200,
        height: 630,
        alt: "Nut November Hackathon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nut November - A month-long hackathon for Cashu builders",
    description: "A month-long hackathon for Cashu builders who just can't hold their nuts.",
    images: ["https://nutnovember.org/opengraph.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sauceTM.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
