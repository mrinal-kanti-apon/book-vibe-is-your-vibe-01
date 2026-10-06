import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./Components/NavBar";
import Footer from './Components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Book Vive',
  description: 'Track the books you have read and the ones you want to read next.',
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
  <NavBar />

  <div className="flex-1">{children}</div>

  <Footer />
</body>
    </html>
  );
}
