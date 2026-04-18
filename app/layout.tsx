import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpotRanking",
  description: "Find your perfect spots",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* 👇 GA */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E5RPXHTKMM"
          strategy="afterInteractive"
        />
        <Script id="ga">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E5RPXHTKMM');
          `}
        </Script>
      </head>

      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}