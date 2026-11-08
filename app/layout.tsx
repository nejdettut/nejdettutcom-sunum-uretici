import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Sunum Üretici — nejdettut.com",
  description:
    "Konu + hedef kitle + slayt sayısı seçimiyle yapılandırılmış PowerPoint sunumu üretir; .pptx olarak indirilir.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
