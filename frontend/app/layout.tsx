import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "./globals.css";
import MainNav from "@/components/main-nav";
import Footer from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NFT Ticketing System",
  description: "A decentralized ticketing platform using NFTs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} flex flex-col min-h-screen`}>
        <MainNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
