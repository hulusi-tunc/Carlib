import type { Metadata } from "next";
import localFont from "next/font/local";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const aeonik = localFont({
  src: [
    { path: "./fonts/Aeonik-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/Aeonik-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/Aeonik-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/Aeonik-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-aeonik",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Carlib — De l'accrochage aux clés en main, en cinq étapes",
  description:
    "Carlib transforme la prise en charge d'un sinistre en un parcours en cinq étapes depuis votre téléphone : déclaration, mise en relation, acceptation, réparation, récupération.",
  metadataBase: new URL("https://carlib.fr"),
  openGraph: {
    title: "Carlib",
    description:
      "Carlib transforme la prise en charge d'un sinistre en un parcours en cinq étapes depuis votre téléphone.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${aeonik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-screen text-ink">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
