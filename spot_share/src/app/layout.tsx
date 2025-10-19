import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/components/contexts/AuthContext";
import { LocationProvider } from "@/components/contexts/LocationContext";
import { GoogleMapsProvider } from "@/components/GoogleMapsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spot Share - Find & Book Parking Spots",
  description: "Book parking spots easily and securely with Spot Share",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <AuthProvider>
          <LocationProvider>
            <GoogleMapsProvider>
              <Navbar />
              <main className="mx-auto">{children}</main>

              {/* Stripe script - needed for client-side Stripe integration */}
              <script src="https://js.stripe.com/v3/"></script>
            </GoogleMapsProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
