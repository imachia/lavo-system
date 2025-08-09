import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SystemProvider from "@/components/SystemProvider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lavo System",
  description: "Sistema de gerenciamento para lavanderias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-nextjs-dev-tools-button="false">
      <body className={`${inter.className} antialiased`}>
        <SystemProvider>{children}</SystemProvider>
      </body>
    </html>
  );
}
