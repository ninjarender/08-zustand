import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";
import "modern-normalize";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "NoteHub",
  description:
    "NoteHub is a simple and efficient app for creating, searching and managing personal notes.",
  openGraph: {
    title: "NoteHub",
    description:
      "A simple and efficient app for creating, searching and managing personal notes.",
    url: "/",
    siteName: "NoteHub",
    images: [OG_IMAGE],
    type: "website",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <Header />
          {/* <main> — на кожній сторінці (стилі .main у CSS-модулях сторінок) */}
          {children}
          {/* слот @modal: деталі нотатки, перехоплені з /notes/[id] */}
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
