"use client";

import React, { useState } from "react";
import { MapPin, DollarSign, Star, Navigation } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

/**
 * PARKING SPOTS DATA
 * Sample parking spots near LMU campus
 * Markers are dynamically generated from this data
 * Replace with data from your database/API later
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
    lat: 33.9680,
    lng: -118.4180,
  },
  {
    id: 3,
    name: "Bluff Parking",
    address: "Del Rey Hills Dr",
    price: "$6/hr",
    rating: 4.2,
    distance: "0.3 mi",
    available: false,
    lat: 33.9670,
    lng: -118.4200,
  },
];

/**
 * PARKING SPOT CARD COMPONENT
 * Displays individual parking spot information in a card format
 * Shows: spot name, availability badge, address, price, distance, rating, and booking button
 * Appears in the sidebar list on the right side of the page
 */
function ParkingSpotCard({ spot }: { spot: (typeof parkingSpots)[0] }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
      {/* Card Header: Spot name and availability badge */}
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

      {/* Address with map pin icon */}
      <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
        <MapPin className="w-4 h-4" />
        {spot.address}
      </p>

      {/* Spot details: price, distance, and rating */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Price per hour */}
          <span className="text-blue-600 font-bold text-lg flex items-center gap-1">
            <DollarSign className="w-5 h-5" />
            {spot.price.replace("$", "")}
          </span>
          {/* Distance from user */}
          <span className="text-gray-600 text-sm flex items-center gap-1">
            <Navigation className="w-4 h-4" />
            {spot.distance}
          </span>
        </div>

        {/* Star rating */}
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-gray-700 font-semibold">{spot.rating}</span>
        </div>
      </div>

      {/* Book Now button (only shown for available spots) */}
      {spot.available && (
        <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition">
          Book Now
        </button>
      )}
    </div>
  );
}

/**
 * PARKING PIN MARKER COMPONENT
 * Individual map pin that marks a parking spot location
 * Positioned using latitude and longitude coordinates
 * Can be dynamically generated based on data from external sources
 *
 * Props:
 * - lat: latitude coordinate of the parking spot
 * - lng: longitude coordinate of the parking spot
 * - name: name of the parking spot (shown on hover)
 */
function ParkingPin({
  lat,
  lng,
  name,
}: {
  lat: number;
  lng: number;
  name: string;
}) {
  // maps center cords and zoom (change to hannon lat, long)
  const centerLat = 33.966787; 
  const centerLng = -118.417631;
  const scale = 50000; // Adjust this to zoom in/out on the map

  // Calculate pixel position relative to center
  const x = 400 + (lng - centerLng) * scale;
  const y = 300 - (lat - centerLat) * scale; // Y is inverted (up is negative)

  return (
    <g transform={`translate(${x}, ${y})`}>
      <title>{name}</title>
      {/* Pin shape - teardrop style marker */}
      <path
        d="M 0,-25 C -8,-25 -15,-18 -15,-10 C -15,-2 0,10 0,10 C 0,10 15,-2 15,-10 C 15,-18 8,-25 0,-25 Z"
        fill="#3b82f6"
        stroke="white"
        strokeWidth="2"
      />
      {/* White center dot */}
      <circle cx="0" cy="-12" r="5" fill="white" />
    </g>
  );
}

/**
 * INTERACTIVE GOOGLE MAP COMPONENT
 * Real Google Maps showing parking spot locations with dynamic markers
 * Markers are generated from parkingSpots data and color-coded by availability
 * Centered on LMU campus area
 */
function InteractiveMap() {
  // Load API key from environment variable
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY || "";
  
  // Map center - LMU campus area
  const center = { lat: 33.966787, lng: -118.417631 };

  const [zoom] = useState(19);
  
  // Map container styling
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  // Map options
  const mapOptions = {
    zoom: zoom,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
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
 * Choose Spot Page - where users browse and select parking spots
 * Layout: Split screen with map (60% left) and spot list (40% right)
 * Accessed when user clicks "Buy a Spot" button on the home page
 */
export default function ChooseSpotPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area with map and sidebar */}
      <div className="pt-20 h-screen flex">
        {/* LEFT SIDE: Interactive map showing parking locations - takes 60% of screen width */}
        <div className="w-3/5 h-full">
          {/* Google Maps with dynamic markers from parkingSpots data */}
          <InteractiveMap />
        </div>

        {/* RIGHT SIDE: Scrollable list of parking spots - takes 40% of screen width */}
        <div className="w-2/5 h-full bg-white shadow-xl overflow-y-auto">
          <div className="p-6">
            {/* Header with title and count badge */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Available Spots
              </h2>
              {/* Badge showing number of available spots */}
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {parkingSpots.filter((s) => s.available).length} Available
              </span>
            </div>

            {/* List of parking spot cards */}
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
