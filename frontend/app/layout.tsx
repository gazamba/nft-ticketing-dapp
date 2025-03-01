import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/client-wrapper";
import { ThemeProvider } from "@/components/providers/theme-provider";
import QueryClientProvider from "@/components/providers/query-client-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} flex flex-col min-h-screen`}>
        <QueryClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ClientWrapper>
              <main className="flex-1">{children}</main>
            </ClientWrapper>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
