"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Navigation } from "lucide-react";

interface Message {
  sender: "buyer" | "seller";
  text: string;
  time: string;
}

export default function EtaPage() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "buyer", text: "On my way!", time: "2:45 PM" },
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    // Load Google Maps script
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", initMap);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDGFXb9CP3fA_zFY1DNrATMoC2MkkpXIAQ`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapLoaded(true);
      initMap();
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps");
    };
    document.head.appendChild(script);
  }, []);

  const initMap = () => {
    if (
      !mapRef.current ||
      typeof window === "undefined" ||
      !window.google ||
      !window.google.maps
    ) {
      console.log("Map not ready");
      return;
    }

    try {
      // LMU Parking Lot A coordinates
      const parkingLot = { lat: 33.9697, lng: -118.4187 };

      // Buyer's current location (simulated - 2.3 miles away)
      const buyerLocation = { lat: 33.985, lng: -118.445 };

      const map = new window.google.maps.Map(mapRef.current, {
        center: parkingLot,
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
      });

      // Destination marker (parking lot - seller location)
      new window.google.maps.Marker({
        position: parkingLot,
        map: map,
        title: "LMU Parking Lot A",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#EF4444",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
      });

      // Buyer location marker
      new window.google.maps.Marker({
        position: buyerLocation,
        map: map,
        title: "Buyer Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#3B82F6",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      // Draw route line
      const routePath = new window.google.maps.Polyline({
        path: [buyerLocation, parkingLot],
        geodesic: true,
        strokeColor: "#3B82F6",
        strokeOpacity: 0.8,
        strokeWeight: 4,
      });

      routePath.setMap(map);

      // Fit bounds to show both markers
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(parkingLot);
      bounds.extend(buyerLocation);
      map.fitBounds(bounds);

      console.log("Map initialized successfully");
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([
        ...messages,
        {
          sender: "seller",
          text: inputText,
          time: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
        },
      ]);
      setInputText("");
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-100 flex flex-col">
      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden bg-gray-200">
        {/* Google Map */}
        <div
          ref={mapRef}
          className="w-full h-full"
          style={{ minHeight: "400px" }}
        />

        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-gray-600">Loading map...</div>
          </div>
        )}

        {/* Location info badge */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 z-10">
          <Navigation className="w-5 h-5 text-blue-500" />
          <div>
            <div className="text-xs text-gray-500">Buyer Location</div>
            <div className="text-sm font-semibold">2.3 miles away</div>
          </div>
        </div>
      </div>

      {/* ETA Section */}
      <div className="bg-white border-t-2 border-gray-200 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <div className="text-sm text-gray-500 mb-1">Estimated Arrival</div>
            <div className="text-3xl font-bold text-gray-900">12 mins</div>
            <div className="text-sm text-gray-600 mt-1">Arrives at 3:05 PM</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Distance</div>
            <div className="text-2xl font-semibold text-gray-700">2.3 mi</div>
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="absolute bottom-24 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-2xl transition-all duration-200 transform hover:scale-105 z-20"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Popup */}
      {isChatOpen && (
        <div
          className="absolute bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl flex flex-col z-30"
          style={{ height: "400px" }}
        >
          {/* Chat Header */}
          <div className="bg-blue-500 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
            <div>
              <div className="font-semibold">Chat with Buyer</div>
              <div className="text-xs text-blue-100">Active now</div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-blue-600 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "seller" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] ${
                    msg.sender === "seller"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  } rounded-2xl px-4 py-2`}
                >
                  <div className="text-sm">{msg.text}</div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.sender === "seller"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// TypeScript declarations for Google Maps
declare global {
  interface Window {
    google: any;
  }
}
