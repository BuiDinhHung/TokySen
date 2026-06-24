import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TokySen Restaurant – Asiatische Küche in Berlin Mahlsdorf",
  description:
    "TokySen vereint japanische und vietnamesische Küche in Berlin-Mahlsdorf. Genießen Sie handgemachtes Sushi, Wok-Gerichte, Phở und mehr – mit frischen Zutaten und 30 Jahren Erfahrung.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
