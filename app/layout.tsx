import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "STRINGS — Advokáti v dobe kvantovej fyziky",
  description:
    "Právna prax na hranici technológie, regulácie a inovácií. Advokátska kancelária STRINGS — IT právo, GDPR, obchodné právo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
