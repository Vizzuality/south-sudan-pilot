import { Jost, DM_Serif_Text } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-jost",
});

const dmSerifText = DM_Serif_Text({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif-text",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jost.variable} ${dmSerifText.variable}`}>
      <body>{children}</body>
    </html>
  );
}
