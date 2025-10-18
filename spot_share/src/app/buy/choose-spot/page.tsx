"use client";

import React, { useState, useEffect } from "react";
import { MapPin, DollarSign, Star, Navigation, X, Clock } from "lucide-react";

/**
 * PARKING SPOTS DATA
 */
const parkingSpots = [
  {
    id: 1,
    name: "LMU Parking Structure A",
    address: "1 LMU Drive",
    price: "$5/hr",
    rating: 4.5,
    distance: "0.1 mi",
    available: true,
    lat: 33.967133,
    lng: -118.417822,
  },
  {
    id: 2,
    name: "Campus Center Lot",
    address: "1 Loyola Marymount University Dr",
    price: "$8/hr",
    rating: 4.8,
    distance: "0.2 mi",
    available: true,
    lat: 33.968,
    lng: -118.418,
  },
  {
    id: 3,
    name: "Bluff Parking",
    address: "Del Rey Hills Dr",
    price: "$6/hr",
    rating: 4.2,
    distance: "0.3 mi",
    available: false,
    lat: 33.967,
    lng: -118.42,
  },
];

/**
 * BOOKING MODAL COMPONENT
 * Displays a modal with booking details and hours selection
 * Shows total price calculation based on hours selected
 */
function BookingModal({
  spot,
  isOpen,
  onClose,
}: {
  spot: (typeof parkingSpots)[0];
  isOpen: boolean;
  onClose: () => void;
}) {
  const [hours, setHours] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Parse the hourly rate from the price string
  const hourlyRate = parseFloat(spot.price.replace("$", "").replace("/hr", ""));
  const totalPrice = hourlyRate * hours;

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spotId: spot.id,
          spotName: spot.name,
          amount: Math.round(totalPrice * 100), // Convert to cents
          hours: hours,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to start checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Light Backdrop - semi-transparent white instead of dark */}
      <div
        className="absolute inset-0 bg-white/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-gray-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold mb-2">Book Parking Spot</h2>
          <p className="text-blue-100 text-sm">Complete your reservation</p>
        </div>

        {/* Spot Details */}
        <div className="p-6">
          {/* Spot Name and Badge */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-xl text-gray-800">{spot.name}</h3>
              <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {spot.address}
              </p>
            </div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
              Available
            </span>
          </div>

          {/* Spot Info Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Rate</p>
              <p className="font-bold text-gray-800">{spot.price}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <Navigation className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Distance</p>
              <p className="font-bold text-gray-800">{spot.distance}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <Star className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Rating</p>
              <p className="font-bold text-gray-800">{spot.rating}</p>
            </div>
          </div>

          {/* Hours Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Select Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 6, 8, 12, 24].map((h) => (
                <button
                  key={h}
                  onClick={() => setHours(h)}
                  className={`py-3 px-2 rounded-lg font-semibold text-sm transition-all ${
                    hours === h
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Hourly Rate:</span>
              <span className="font-semibold">${hourlyRate.toFixed(2)}/hr</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold">{hours} hour{hours > 1 ? "s" : ""}</span>
            </div>
            <div className="border-t border-blue-200 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                `Proceed to Payment`
              )}
            </button>
          </div>

          {/* Info Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            You'll be redirected to Stripe's secure payment page
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * PARKING SPOT CARD COMPONENT
 */
function ParkingSpotCard({ spot }: { spot: (typeof parkingSpots)[0] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800">{spot.name}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              spot.available
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {spot.available ? "Available" : "Occupied"}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {spot.address}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-blue-600 font-bold text-lg flex items-center gap-1">
              <DollarSign className="w-5 h-5" />
              {spot.price.replace("$", "")}
            </span>
            <span className="text-gray-600 text-sm flex items-center gap-1">
              <Navigation className="w-4 h-4" />
              {spot.distance}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-gray-700 font-semibold">{spot.rating}</span>
          </div>
        </div>

        {spot.available && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Book Now
          </button>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        spot={spot}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

/**
 * INTERACTIVE MAP PLACEHOLDER COMPONENT
 * Static map placeholder - replace with actual Google Maps implementation in your project
 */
function InteractiveMap() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-blue-50">
      {/* Map Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-24 h-24 text-blue-600 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Interactive Map</h2>
          <p className="text-gray-600">Parking spots near LMU Campus</p>
        </div>
      </div>
      
      {/* Animated Location Markers */}
      {parkingSpots.map((spot, index) => (
        <div
          key={spot.id}
          className="absolute animate-pulse"
          style={{
            top: `${30 + index * 20}%`,
            left: `${25 + index * 25}%`,
            animationDelay: `${index * 0.3}s`,
          }}
        >
          <div
            className={`w-4 h-4 rounded-full shadow-lg ${
              spot.available ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * MAIN PAGE COMPONENT
 */
export default function ChooseSpotPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 h-screen flex">
        <div className="w-3/5 h-full">
          <InteractiveMap />
        </div>

        <div className="w-2/5 h-full bg-white shadow-xl overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Available Spots
              </h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {parkingSpots.filter((s) => s.available).length} Available
              </span>
            </div>

            <div className="space-y-4">
              {parkingSpots.map((spot) => (
                <ParkingSpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
