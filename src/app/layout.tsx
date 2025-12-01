import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LyraNet - Network Environment Detection",
  description: "Comprehensive network environment analysis tool",
  icons: {
    icon: '/icon.svg',
  },
};

import { I18nProvider } from "@/i18n/context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <I18nProvider>
          <Header />
          <main className="main-content">
            {children}
          </main>
        </I18nProvider>
      </body>
    </html>
  );
}
