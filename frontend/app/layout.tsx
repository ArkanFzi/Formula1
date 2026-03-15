import type { Metadata } from "next";
import { Barlow_Condensed, Space_Grotesk } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-barlow",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Formula 1 Central | Mission Control",
  description: "Premium Formula 1 Dashboard & Real-time Analytics",
  manifest: "/manifest.json",
  themeColor: "#e10600",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} ${space.variable} font-[family-name:var(--font-space)] bg-carbon min-h-screen relative`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
