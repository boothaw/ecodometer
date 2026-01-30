import type { Metadata } from "next";
import { Racing_Sans_One, Overpass } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className={`${racingSansOne.variable} ${overpass.variable}`}>
      <body className="antialiased">
          <div className="navbar bg-white shadow-sm">
            <div className="navbar-start">
              <button className="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg>
              </button>
              <a href="/login" className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
                  <span className="badge badge-xs badge-primary indicator-item"></span>
                </div>
              </a>
            </div>
            <div className="navbar-center">
              <a href="/" className="btn btn-ghost text-xl font-display">ECOdometer</a>
            </div>
            <div className="navbar-end">
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hamburger" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
                </div>
                <ul
                  tabIndex="-1"
                  className="menu menu-sm dropdown-content right-0 bg-white rounded-box z-1 mt-3 w-52 p-2 border-2">
                  <li><a href="/">Homepage</a></li>
                  <li><a href="/profile">Profile </a></li>
                  <li><a href="/login">Login</a></li>
                  {/* <li><a href="/login">Vehicles</a></li> */}
                </ul>
              </div>
            </div>
          </div>
        {children}
      </body>
    </html>
  );
}
