"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapPin, DollarSign, Star, Navigation } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { BookingModal } from "@/components/items/StripeComponent";

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
                : "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Occupied = red
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

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
