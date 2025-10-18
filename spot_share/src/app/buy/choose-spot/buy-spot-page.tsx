import React from "react";
import { MapPin, DollarSign, Star, Navigation } from "lucide-react";

/**
 * NAVBAR COMPONENT
 * Simple top navigation bar that displays the Spot Share logo
 * Fixed to the top of the page with white background and shadow
 */
function Navbar() {
  return (
    <nav className="flex items-center justify-center p-4 bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="text-2xl font-bold text-blue-600">Spot Share</div>
    </nav>
  );
}

/**
 * PARKING SPOTS DATA
 * Array of sample parking spots with their details
 * Includes: name, address, pricing, ratings, availability status, and coordinates
 * 
 * TO LOAD FROM EXTERNAL FILE:
 * Replace this array with data fetched from an API or imported from a JSON file
 * Example: const parkingSpots = await fetch('/api/parking-spots').then(r => r.json())
 * 
 * Required fields for each spot:
 * - id: unique identifier
 * - name: spot name
 * - address: street address
 * - price: pricing information
 * - rating: user rating (0-5)
 * - distance: distance from user
 * - available: boolean availability status
 * - lat: latitude coordinate (required for map pin positioning)
 * - lng: longitude coordinate (required for map pin positioning)
 */
const parkingSpots = [
  {
    id: 1,
    name: "Downtown Garage",
    address: "123 Main St",
    price: "$5/hr",
    rating: 4.5,
    distance: "0.3 mi",
    available: true,
    lat: 40.7128,
    lng: -74.0060,
  },
  {
    id: 2,
    name: "City Center Parking",
    address: "456 Park Ave",
    price: "$8/hr",
    rating: 4.8,
    distance: "0.5 mi",
    available: true,
    lat: 40.7148,
    lng: -74.0080,
  },
  {
    id: 3,
    name: "Metro Lot",
    address: "789 Broadway",
    price: "$6/hr",
    rating: 4.2,
    distance: "0.7 mi",
    available: false,
    lat: 40.7108,
    lng: -74.0040,
  },
];

/**
 * PARKING SPOT CARD COMPONENT
 * Displays individual parking spot information in a card format
 * Shows: spot name, availability badge, address, price, distance, rating, and booking button
 * Appears in the sidebar list on the right side of the page
 */
function ParkingSpotCard({ spot }: { spot: typeof parkingSpots[0] }) {
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
function ParkingPin({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  // maps center cords and zoom (change to hannon lat, long)
  const centerLat = 40.7128;
  const centerLng = -74.0060;
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
 * STATIC MAP COMPONENT
 * Custom SVG-based map background with road network
 * No external map API required - completely self-contained
 * Shows: grid pattern background, road network, and animated user location
 * Parking pins are rendered separately as overlay components
 */
function StaticMap() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 overflow-hidden">
      {/* Grid pattern background for map texture */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <pattern
            id="grid"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="gray"
              strokeWidth="1"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main map SVG with roads and markers */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
        {/* Road network - horizontal and vertical streets */}
        {/* Main horizontal road (center) */}
        <line
          x1="0"
          y1="300"
          x2="800"
          y2="300"
          stroke="#94a3b8"
          strokeWidth="8"
        />
        {/* Main vertical road (center) */}
        <line
          x1="400"
          y1="0"
          x2="400"
          y2="600"
          stroke="#94a3b8"
          strokeWidth="8"
        />
        {/* Secondary roads */}
        <line
          x1="200"
          y1="0"
          x2="200"
          y2="600"
          stroke="#cbd5e1"
          strokeWidth="6"
        />
        <line
          x1="600"
          y1="0"
          x2="600"
          y2="600"
          stroke="#cbd5e1"
          strokeWidth="6"
        />
        <line
          x1="0"
          y1="150"
          x2="800"
          y2="150"
          stroke="#cbd5e1"
          strokeWidth="6"
        />
        <line
          x1="0"
          y1="450"
          x2="800"
          y2="450"
          stroke="#cbd5e1"
          strokeWidth="6"
        />

        {/* USER'S CURRENT LOCATION MARKER */}
        {/* Animated pulsing blue circle at the center of the map */}
        {/* Shows where the user currently is on the map */}
        <g transform="translate(400, 300)">
          {/* Pulsing outer ring animation */}
          <circle cx="0" cy="0" r="25" fill="#3b82f6" opacity="0.2">
            <animate
              attributeName="r"
              from="25"
              to="35"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.2"
              to="0"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Main location dot */}
          <circle cx="0" cy="0" r="10" fill="#3b82f6" />
          {/* White center dot for contrast */}
          <circle cx="0" cy="0" r="4" fill="white" />
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-700 font-medium">Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="12" height="16" viewBox="0 0 30 40" className="mt-0.5">
              <path
                d="M 15,5 C 10,5 5,9 5,15 C 5,20 15,35 15,35 C 15,35 25,20 25,15 C 25,9 20,5 15,5 Z"
                fill="#3b82f6"
              />
            </svg>
            <span className="text-gray-700 font-medium">Parking Spots</span>
          </div>
        </div>
      </div>
    </div>
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
      {/* Top navigation bar */}
      <Navbar />

      {/* Main content area with map and sidebar */}
      <div className="pt-20 h-screen flex">
        {/* LEFT SIDE: Interactive map showing parking locations - takes 60% of screen width */}
        <div className="w-3/5 h-full relative">
          {/* Base map layer - roads and background */}
          <StaticMap />
          
          {/* Parking pins overlay layer - dynamically generated from data */}
          {/* This SVG overlay sits on top of the map and renders pins based on lat/lng coordinates */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600">
            {parkingSpots.map((spot) => (
              <ParkingPin
                key={spot.id}
                lat={spot.lat}
                lng={spot.lng}
                name={spot.name}
              />
            ))}
          </svg>
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

