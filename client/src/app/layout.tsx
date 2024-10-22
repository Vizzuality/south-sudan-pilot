import { Jost, DM_Serif_Text } from "next/font/google";

import Head from "@/components/head";

import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Hydrological Information Management Systems",
    default: "Hydrological Information Management Systems",
  },
  description:
    "Pilot for flood and drought hazard maps in South Sudan, enhancing access to water management data and supporting informed decision-making.",
};

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
      <Head />
      <body>{children}</body>
    </html>
  );
}
