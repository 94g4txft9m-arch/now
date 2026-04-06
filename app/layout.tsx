import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
