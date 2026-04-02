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
  title: "Solara - ระบบคำนวณการติดตั้งโซลาร์เซลล์",
  description: "ประเมินความคุ้มค่าและเงินที่ประหยัดได้จากการติดตั้งโซลาร์เซลล์สำหรับบ้านคุณ",
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#020617]">
        <Toaster theme="dark" position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
