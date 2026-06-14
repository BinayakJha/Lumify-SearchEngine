import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumify — the search engine that asks why you asked",
  description:
    "Type a question and Lumify infers the reasons you might be asking — plus a sharper question to ask instead. Runs entirely on your device: no API, no tracking, works offline.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
