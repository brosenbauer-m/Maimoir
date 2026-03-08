import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maimoir — Your AI. Your Story. On Your Terms.",
  description: "Meet your personal AI representative. Share your story, be discovered, and connect meaningfully.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-background text-text-primary`}>
        {children}
      </body>
    </html>
  );
}
