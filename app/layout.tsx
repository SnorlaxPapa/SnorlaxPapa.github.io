import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";
import config from "@/config";

// A blocky pixel-terminal font. Swap for IBM Plex Mono or JetBrains Mono
// in config.ts's theme if you want something less "CRT" and more "modern".
const termMono = VT323({
  variable: "--font-term-mono",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${config.identity.name} -- ${config.identity.role}`,
  description: config.identity.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${termMono.variable} h-full antialiased`}>
      <body className="h-full flex flex-col overflow-hidden">{children}</body>
    </html>
  );
}
