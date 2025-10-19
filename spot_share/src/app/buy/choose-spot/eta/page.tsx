"use client";

import React, { useState, useEffect, useRef } from "react";
import { Car, MapPin, Clock, User, Phone, MessageCircle, X, Send } from "lucide-react";

interface Message {
  sender: "buyer" | "seller";
  text: string;
  time: string;
}

export default function SellerEtaPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [eta, setEta] = useState<string>("12 mins");
  const [distance, setDistance] = useState<number>(2.3);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "buyer", text: "On my way!", time: "2:45 PM" },
  ]);
  const [inputText, setInputText] = useState<string>("");

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Wait for Google Maps to load
    if (window.google && window.google.maps) {
      initMap();
    } else {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          initMap();
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, []);

  const initMap = () => {
    if (
      !mapRef.current ||
      typeof window === "undefined" ||
      !window.google ||
      !window.google.maps
    ) {
      return;
    }

    try {
      // Seller location (parking spot)
      const sellerLocation = { lat: 33.9697, lng: -118.4187 };

      // Buyer's location (simulated - on the way)
      const buyerLocation = { lat: 33.9757, lng: -118.425 };

      // Calculate distance
      const distanceInMiles = calculateDistance(
        buyerLocation.lat,
        buyerLocation.lng,
        sellerLocation.lat,
        sellerLocation.lng
      );
      setDistance(distanceInMiles);

      const map = new window.google.maps.Map(mapRef.current, {
        center: sellerLocation,
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
      });

      // Seller marker (red - parking spot destination)
      new window.google.maps.Marker({
        position: sellerLocation,
        map: map,
        title: "Your Parking Spot",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#EF4444",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
      });

      // Buyer marker (blue - moving towards spot)
      new window.google.maps.Marker({
        position: buyerLocation,
        map: map,
        title: "Buyer Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#0C76F2",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
      });

      // Draw route line
      const routePath = new window.google.maps.Polyline({
        path: [buyerLocation, sellerLocation],
        geodesic: true,
        strokeColor: "#3B82F6",
        strokeOpacity: 0.8,
        strokeWeight: 4,
      });

      routePath.setMap(map);

      // Fit bounds to show both markers
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(sellerLocation);
      bounds.extend(buyerLocation);
      map.fitBounds(bounds);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  const handleArrived = () => {
    // Navigate to next page
    window.location.href = "/sell/choose-spot/waiting-page/eta/confirmed";
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">
              Spot <span className="text-blue-600">Share</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Side - Map */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-full min-h-[500px] relative">
              <div
                ref={mapRef}
                className="w-full h-full"
                style={{ minHeight: "500px" }}
              />
            </div>
          </div>

          {/* Right Side - Buyer Info & ETA */}
          <div className="space-y-6">
            {/* Buyer Car Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Car className="w-6 h-6 text-blue-600" />
                Buyer Information
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">Name</div>
                    <div className="font-semibold text-gray-900 text-lg">
                      John Smith
                    </div>
                  </div>
                </div>

                {/* Car Details */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">Vehicle</div>
                    <div className="font-semibold text-gray-900 text-lg">
                      Toyota Camry
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Silver • ABC 1234
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">Contact</div>
                    <div className="font-semibold text-gray-900 text-lg">
                      (555) 123-4567
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ETA Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Estimated Arrival
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <div className="text-5xl font-bold text-blue-600">{eta}</div>
                  <div className="text-gray-600">away</div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                  <div>
                    <div className="text-sm text-gray-600">Distance</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {distance.toFixed(1)} mi
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Arrives at</div>
                    <div className="text-xl font-semibold text-gray-900">
                      3:05 PM
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrived Button */}
            <button
              onClick={handleArrived}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
            >
              <MapPin className="w-6 h-6" />
              Buyer Arrived
            </button>

            {/* Status Note */}
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">
                Click "Buyer Arrived" once the buyer reaches your parking spot
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-2xl transition-all duration-200 transform hover:scale-105 z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Popup */}
      {isChatOpen && (
        <div
          className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl flex flex-col z-50"
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