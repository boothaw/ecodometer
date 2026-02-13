import type { Metadata } from "next";
import { Racing_Sans_One, Overpass } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import "./globals.css";
import Link from "next/link";
import { getProfileForCurrentUser } from "@/src/lib/profile";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get profile for signed-in users (will be null if not signed in)
  let profileId: number | null = null;
  try {
    const profile = await getProfileForCurrentUser();
    profileId = profile.id;
  } catch {
    // User not signed in, profileId stays null
  }
  
  return (
    <ClerkProvider>
      <html lang="en" className={`${racingSansOne.variable} ${overpass.variable}`}>
        <body className="antialiased">
          <div className="navbar bg-white shadow-sm">
            <div className="navbar-start">
            <SignedOut>
                <Link href={"/login"}>Login</Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
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
                  // tabIndex="-1"
                  className="menu menu-sm dropdown-content right-0 bg-white rounded-box z-1 mt-3 w-52 p-2 border-2">
                  <li><a href="/">Homepage</a></li>
                  {profileId ? (
                    <li><Link href={`/profile/${profileId}`}>My Vehicles</Link></li>
                  ) : (
                    <li><a href="/login">Login</a></li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
