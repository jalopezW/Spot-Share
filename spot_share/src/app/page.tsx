"use client";

import React, { useState, useCallback, useEffect } from "react";
import { MapPin, DollarSign } from "lucide-react";
import Link from "next/link";
import { GoogleMap, Marker, OverlayView } from "@react-google-maps/api";
import { getUserLocation } from "@/utils/location";

// Map Section Component with Interactive Marking
const MapSection = () => {
  // Load API key from environment variable
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY || "";

  // Initial map center coordinates LMU
  const [center] = useState({ lat: 33.9687, lng: -118.4189 });

  // Map zoom level (1-20, higher = more zoomed in)
  const [zoom] = useState(17);

  // Store user's current location
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Store marked locations
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);

  // Store the last clicked coordinates
  const [lastClickedCoords, setLastClickedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Fetch user location when component mounts
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const location = await getUserLocation();
        setUserLocation(location);
        console.log("User location:", location);
      } catch (error) {
        console.error("Error getting user location:", error);
      }
    };

    fetchUserLocation();
  }, []);

  // Map container styling
  const mapContainerStyle = {
    width: "100%",
    height: "100vh",
  };

  // Map options
  const mapOptions = {
    zoom: zoom,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
  };

  // Handle map click to add marker
  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      // Add new marker
      setMarkers((current) => [...current, { lat, lng }]);

      // Store coordinates for use in other pages
      setLastClickedCoords({ lat, lng });

      // Log coordinates (you can save these to localStorage, state management, or database)
      console.log("Marked location:", { lat, lng });

      // Example: Save to localStorage for use on other pages
      localStorage.setItem("lastMarkedLocation", JSON.stringify({ lat, lng }));
    }
  }, []);

  return (
    <div className="h-screen relative">
      {/* Interactive Google Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        options={mapOptions}
        onClick={onMapClick}
      >
        {/* User location marker - Blue */}
        {userLocation && (
          <>
            {/* Pulse overlay on user location */}
            <OverlayView
              position={userLocation}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: '#0C76F2',
                  borderRadius: '50%',
                  position: 'relative',
                }}>
                  <div 
                    className="pulse-ring"
                    style={{
                      width: '20px',
                      height: '20px',
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      borderRadius: '50%',
                      background: '#59A3FF',
                      opacity: 0.6,
                    }} 
                  />
                </div>
              </div>
            </OverlayView>
          </>
        )}

        {/* Render all clicked markers */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
          />
        ))}
      </GoogleMap>

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Center content overlay */}
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
          <Link href="/sell/choose-spot">
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

// <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//         <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
//           <MapPin className="w-24 h-24 text-blue-600 mx-auto mb-4" />
//           <h2 className="text-3xl font-bold text-gray-800 mb-2">
//             Find Your Perfect Spot
//           </h2>
//           <p className="text-gray-600 text-lg">
//             Click on the map to mark parking locations
//           </p>

//           {/* Show last clicked coordinates */}
//           {lastClickedCoords && (
//             <div className="mt-4 text-sm text-gray-600 bg-white/80 p-3 rounded-lg">
//               <p className="font-semibold">Last Marked Location:</p>
//               <p>Lat: {lastClickedCoords.lat.toFixed(6)}</p>
//               <p>Lng: {lastClickedCoords.lng.toFixed(6)}</p>
//             </div>
//           )}
//         </div>
//       </div>
