import type { Metadata } from "next";
import "@/app/globals.css";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({ subsets: ["latin"], display: "swap", variable: "--font-open-sans" });

export const metadata: Metadata = {
  title: "pixelbind",
  description:
    "pixelbind is a simple and powerful web tool that lets you quickly convert your images into high-quality PDFs. Easily upload, arrange, and customize your photos, then generate a downloadable PDF in just a few clicks. Perfect for organizing images into professional documents with ease. No sign-up required!",
  keywords: [
    "jpg to pdf",
    "png to pdf",
    "convert jpg to pdf",
    "image to pdf",
    "pics into pdf",
    "pdf converter jpg to pdf",
    "jpg in to pdf",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} min-h-dvh`}>
      {children}
    </html>
  );
}
