import type { Metadata } from "next";
import { Racing_Sans_One, Overpass } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Nav from "@/src/components/Nav";

const racingSansOne = Racing_Sans_One({
  variable: "--font-racing-sans-one",
  subsets: ["latin"],
  weight: "400",
});

const overpass = Overpass({
  variable: "--font-overpass",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ECOdometer",
  description: "Track your MPG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${racingSansOne.variable} ${overpass.variable}`}>
        <body className="antialiased">
          <Nav />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
