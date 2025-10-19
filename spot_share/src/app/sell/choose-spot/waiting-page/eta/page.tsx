"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Navigation, MapPin } from "lucide-react";
import { useLocation } from "@/components/contexts/LocationContext";

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
  const mapRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState<number>(0);

  // Get actual user location from context
  const { userLocation } = useLocation();

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
    if (!userLocation) return;

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
  }, [userLocation]);

  const initMap = () => {
    if (
      !mapRef.current ||
      typeof window === "undefined" ||
      !window.google ||
      !window.google.maps ||
      !userLocation
    ) {
      return;
    }

    try {
      const parkingLot = { lat: 33.966566, lng: -118.417312 };
      const buyerLocation = { lat: userLocation.lat, lng: userLocation.lng };
      const distanceInMiles = calculateDistance(
        buyerLocation.lat,
        buyerLocation.lng,
        parkingLot.lat,
        parkingLot.lng
      );
      setDistance(distanceInMiles);

      const map = new window.google.maps.Map(mapRef.current, {
        center: parkingLot,
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
      });

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

      // Add pulse overlay for seller location
      class PulseOverlay extends window.google.maps.OverlayView {
        position: google.maps.LatLng;
        div: HTMLDivElement | null = null;

        constructor(position: google.maps.LatLng) {
          super();
          this.position = position;
        }

        onAdd() {
          const div = document.createElement("div");
          div.style.position = "absolute";
          div.style.pointerEvents = "none";

          const pulse = document.createElement("div");
          pulse.className = "pulse-ring";
          pulse.style.width = "20px";
          pulse.style.height = "20px";
          pulse.style.borderRadius = "50%";
          pulse.style.background = "#59A3FF";
          pulse.style.opacity = "0.6";

          div.appendChild(pulse);
          this.div = div;

          const panes = this.getPanes();
          if (panes) {
            panes.overlayMouseTarget.appendChild(div);
          }
        }

        draw() {
          if (!this.div) return;

          const overlayProjection = this.getProjection();
          const position = overlayProjection.fromLatLngToDivPixel(
            this.position
          );

          if (position) {
            this.div.style.left = position.x + "px";
            this.div.style.top = position.y + "px";
            this.div.style.transform = "translate(-50%, -50%)";
          }
        }

        onRemove() {
          if (this.div && this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
          }
        }
      }

      const pulseOverlay = new PulseOverlay(
        new window.google.maps.LatLng(buyerLocation.lat, buyerLocation.lng)
      );
      pulseOverlay.setMap(map);

      // BUYER (Black) location marker with hardcoded coordinates
      const blackMarkerLocation = { lat: 33.9687, lng: -118.418696 };

      new window.google.maps.Marker({
        position: blackMarkerLocation,
        map: map,
        title: "Black Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#000000",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
      });

      // Add black pulse overlay
      class BlackPulseOverlay extends window.google.maps.OverlayView {
        position: google.maps.LatLng;
        div: HTMLDivElement | null = null;

        constructor(position: google.maps.LatLng) {
          super();
          this.position = position;
        }

        onAdd() {
          const div = document.createElement("div");
          div.style.position = "absolute";
          div.style.pointerEvents = "none";

          const pulse = document.createElement("div");
          pulse.className = "pulse-ring";
          pulse.style.width = "12px";
          pulse.style.height = "12px";
          pulse.style.borderRadius = "50%";
          pulse.style.background = "#333333";
          pulse.style.opacity = "0.6";

          div.appendChild(pulse);
          this.div = div;

          const panes = this.getPanes();
          if (panes) {
            panes.overlayMouseTarget.appendChild(div);
          }
        }

        draw() {
          if (!this.div) return;

          const overlayProjection = this.getProjection();
          const position = overlayProjection.fromLatLngToDivPixel(
            this.position
          );

          if (position) {
            this.div.style.left = position.x + "px";
            this.div.style.top = position.y + "px";
            this.div.style.transform = "translate(-50%, -50%)";
          }
        }

        onRemove() {
          if (this.div && this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
          }
        }
      }

      const blackPulseOverlay = new BlackPulseOverlay(
        new window.google.maps.LatLng(
          blackMarkerLocation.lat,
          blackMarkerLocation.lng
        )
      );
      blackPulseOverlay.setMap(map);

      // Use Google Maps Directions API for actual route
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true, // We already have custom markers
        polylineOptions: {
          strokeColor: "#3B82F6",
          strokeOpacity: 0.8,
          strokeWeight: 4,
        },
      });

      // Request directions from buyer location to parking spot
      directionsService.route(
        {
          origin: new window.google.maps.LatLng(
            buyerLocation.lat,
            buyerLocation.lng
          ),
          destination: new window.google.maps.LatLng(
            parkingLot.lat,
            parkingLot.lng
          ),
          travelMode: window.google.maps.TravelMode.WALKING,
        },
        (result: any, status: any) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            directionsRenderer.setDirections(result);

            // Get route distance and duration from directions result
            if (result.routes[0]?.legs[0]) {
              const leg = result.routes[0].legs[0];
              const distanceInMiles = leg.distance.value / 1609.34; // Convert meters to miles
              setDistance(distanceInMiles);

              // Optional: You could also set ETA based on duration
              // const durationMinutes = Math.ceil(leg.duration.value / 60);

              console.log("Route calculated:", {
                distance: leg.distance.text,
                duration: leg.duration.text,
              });
            }
          } else {
            console.error("Directions request failed:", status);
            // Fallback to simple line if directions fail
            const routePath = new window.google.maps.Polyline({
              path: [buyerLocation, parkingLot],
              geodesic: true,
              strokeColor: "#3B82F6",
              strokeOpacity: 0.8,
              strokeWeight: 4,
            });
            routePath.setMap(map);

            // Fit bounds manually as fallback
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(parkingLot);
            bounds.extend(buyerLocation);
            map.fitBounds(bounds);
          }
        }
      );

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

  const handleArrived = () => {
    window.location.href = "/sell/choose-spot/waiting-page/eta/rate";
    // You can replace this with navigation or a backend call
  };

  return (
    <div className="relative w-full h-screen bg-gray-100 flex flex-col">
      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden bg-gray-200">
        <div ref={mapRef} className="w-full h-full" />
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 z-10">
          <Navigation className="w-5 h-5 text-blue-500" />
          <div>
            <div className="text-xs text-gray-500">Buyer Location</div>
            <div className="text-sm font-semibold">
              {distance > 0
                ? `${distance.toFixed(1)} miles away`
                : "Calculating..."}
            </div>
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
            <div className="text-2xl font-semibold text-gray-700">
              {distance > 0 ? `${distance.toFixed(1)} mi` : "..."}
            </div>
          </div>
        </div>
      </div>

      {/* Arrived Button */}
      <button
        onClick={handleArrived}
        className="absolute bottom-40 right-6 bg-red-500 hover:bg-red-600 text-white rounded-full px-6 py-3 font-semibold shadow-lg transition-transform duration-200 transform hover:scale-105 z-20 flex items-center gap-2"
      >
        <MapPin className="w-5 h-5" />
        Arrived
      </button>

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

          {/* Messages */}
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

          {/* Input */}
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
