"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapPin, DollarSign, Star, Navigation, X, Clock, ArrowLeft, CreditCard } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

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
 * STRIPE PAYMENT FORM COMPONENT
 */
function StripePaymentForm({
  amount,
  spotName,
  hours,
  spotId,
  onBack,
}: {
  amount: number;
  spotName: string;
  hours: number;
  spotId: number;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spotId: spotId,
          spotName: spotName,
          amount: Math.round(amount * 100), // Convert to cents
          hours: hours,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
      setError("Failed to initialize payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to booking details
      </button>

      <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
        <h3 className="font-semibold text-gray-800 mb-3">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="font-semibold text-gray-800">{spotName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold text-gray-800">{hours} hour{hours > 1 ? "s" : ""}</span>
          </div>
          <div className="border-t border-blue-200 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-800">Total Amount:</span>
              <span className="text-xl font-bold text-blue-600">${amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
        <div className="flex items-center justify-center mb-4">
          <CreditCard className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-center font-bold text-gray-800 mb-2">Secure Payment via Stripe</h3>
        <p className="text-center text-sm text-gray-600 mb-4">
          You'll be redirected to Stripe's secure checkout page to complete your payment
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleStripeCheckout}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Redirecting to Stripe...
          </span>
        ) : (
          `Proceed to Stripe Checkout - $${amount.toFixed(2)}`
        )}
      </button>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>Secured by Stripe • SSL Encrypted</span>
      </div>
    </div>
  );
}

/**
 * BOOKING MODAL COMPONENT
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
  const [showPayment, setShowPayment] = useState(false);

  const hourlyRate = parseFloat(spot.price.replace("$", "").replace("/hr", ""));
  const totalPrice = hourlyRate * hours;

  useEffect(() => {
    if (!isOpen) {
      setShowPayment(false);
      setHours(1);
    }
  }, [isOpen]);

  const handleProceedToPayment = () => {
    setShowPayment(true);
  };

  const handleBackToBooking = () => {
    setShowPayment(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-white/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold mb-2">
            {showPayment ? "Complete Payment" : "Book Parking Spot"}
          </h2>
          <p className="text-blue-100 text-sm">
            {showPayment ? "Secure checkout with Stripe" : "Complete your reservation"}
          </p>
        </div>

        <div className="p-6">
          {!showPayment ? (
            <>
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

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Proceed to Payment
                </button>
              </div>
            </>
          ) : (
            <StripePaymentForm
              amount={totalPrice}
              spotName={spot.name}
              hours={hours}
              spotId={spot.id}
              onBack={handleBackToBooking}
            />
          )}
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

      <BookingModal
        spot={spot}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

/**
 * GOOGLE MAPS COMPONENT WITH PARKING SPOTS
 */
function InteractiveGoogleMap() {
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY || "";
  const [zoom] = useState(19);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const mapOptions = {
    zoom: zoom,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
  };

  return (
    <LoadScript 
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      id="google-maps-script"
      preventGoogleFontsLoading
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: 33.966787, lng: -118.417631 }}
        options={mapOptions}
      >
        {/* Dynamically render markers for all parking spots from data */}
        {parkingSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={{ lat: spot.lat, lng: spot.lng }}
            title={`${spot.name} - ${spot.price}`}
            icon={{
              url: spot.available 
                ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" // Available = green
                : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",   // Occupied = red
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

/**
 * MAIN PAGE COMPONENT
 */
export default function ChooseSpotPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 h-screen flex">
        {/* Left Side: Google Map (60%) */}
        <div className="w-3/5 h-full">
          <InteractiveGoogleMap />
        </div>

        {/* Right Side: Parking Spot List (40%) */}
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