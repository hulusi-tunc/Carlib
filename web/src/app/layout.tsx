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
  title: "Carlib — Five steps from the accident to the keys back in your hand",
  description:
    "Carlib turns a body-shop claim into a five-step flow you can follow from your phone. Declare, match, accept, repair, pick up.",
  metadataBase: new URL("https://carlib.fr"),
  openGraph: {
    title: "Carlib",
    description:
      "Carlib turns a body-shop claim into a five-step flow you can follow from your phone.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${aeonik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-screen text-ink">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
