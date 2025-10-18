import React from "react";
import { Search, MapPin, DollarSign } from "lucide-react";
import Link from "next/link";

// Map Section Component
const MapSection = () => {
  const mapUrl =
    "https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=13&size=1200x600&maptype=roadmap&markers=color:red%7C40.7128,-74.0060&key=YOUR_API_KEY";

  return (
    <div className="pt-16 md:pt-20 h-screen">
      <div className="relative w-full h-full bg-gray-200">
        {/* Map Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
          <div className="text-center">
            <MapPin className="w-24 h-24 text-blue-600 mx-auto mb-4 animate-bounce" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Find Your Perfect Spot
            </h2>
            <p className="text-gray-600 text-lg">
              Search and book parking spaces near you
            </p>
          </div>
        </div>

        {/* Optional: Overlay with map styling */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full shadow-lg animate-pulse"></div>
          <div
            className="absolute top-1/3 right-1/3 w-3 h-3 bg-red-500 rounded-full shadow-lg animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-red-500 rounded-full shadow-lg animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Footer Actions Component
const FooterActions = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex justify-between items-end">
          {/* Buy Button */}
          <Link href="/buy/choose-spot">
            <button className="pointer-events-auto group relative bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 flex items-center space-x-3">
              <DollarSign className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-lg font-bold">Buy a Spot</span>
            </button>
          </Link>

          {/* Sell Button */}
          <Link href="/buy/choose-spot">
            <button className="pointer-events-auto group relative bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center space-x-3">
              <span className="text-lg font-bold">Sell a Spot</span>
              <MapPin className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <MapSection />
      <FooterActions />
    </main>
  );
}
