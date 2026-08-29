import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenSEO — Open-source SEO auditing for developers",
  description:
    "Audit websites for technical and on-page SEO issues with an open-source developer-first tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
