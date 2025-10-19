"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BookingModal } from "@/components/items/BookingModal";
import {
  MapPin,
  DollarSign,
  Star,
  Navigation,
  X,
  Clock,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { GoogleMap, Marker, OverlayView } from "@react-google-maps/api";
import { useAuth } from "@/components/contexts/AuthContext";
import { useLocation } from "@/components/contexts/LocationContext";
import { getSpots, getUserInfo } from "../../../../databaseService";
import { auth } from "../../../../firebaseConfig";
import { loggedInUserID } from "../../../../authService";
import { useRouter, useSearchParams } from "next/navigation";

function InteractiveGoogleMap() {
  const [zoom] = useState(18.9);

  // Get user location from context
  const { userLocation } = useLocation();

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

  useAuth();
  const [parkingSpots, setParkingSpots] = useState<any[]>([]);

  async function updateParams() {
    if (auth.currentUser != null) {
      setParkingSpots(await getSpots());
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await updateParams();
      } catch (err) {}
    };

    fetchData();
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={{ lat: 33.966787, lng: -118.417631 }}
      options={mapOptions}
    >
      {/* User location marker - Blue with pulse */}
      {userLocation && (
        <>
          {/* Main blue circle marker */}
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#0C76F2",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
            }}
          />
          {/* Pulse overlay on user location */}
          <OverlayView
            position={userLocation}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              style={{
                position: "absolute",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            >
              <div
                className="pulse-ring"
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "#59A3FF",
                  opacity: 0.6,
                }}
              />
            </div>
          </OverlayView>
        </>
      )}

      {/* Dynamically render markers for all parking spots from data */}
      {parkingSpots.map((spot) => (
        <React.Fragment key={spot.id}>
          <Marker
            position={{ lat: spot.Lat, lng: spot.Long }}
            icon={{
              url: spot.available
                ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" // Available = green
                : "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Occupied = red
            }}
          />
          {/* Time display below the pin using OverlayView */}
          <OverlayView
            position={{ lat: spot.Lat, lng: spot.Long }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              style={{
                position: "absolute",
                transform: "translate(-50%, 10px)",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {spot.Time.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </OverlayView>
        </React.Fragment>
      ))}
    </GoogleMap>
  );
}

export default function ChooseSpotPage() {
  useAuth();
  const [parkingSpots, setParkingSpots] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chosenSpot, setChosenSpot] = useState<any | null>(null);

  const [selectedSpot, setSelectedSpot] = useState<any | null>(null);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("from") === "home") {
      router.refresh(); // refetches Server Components/data
      // or: window.location.reload(); // true hard reload (rarely needed)
    }
  }, [params, router]);

  async function updateParams() {
    if (auth.currentUser != null) {
      const userID = loggedInUserID();
      const temp_user_info = await getUserInfo(userID);
      if (temp_user_info != undefined) {
        setUserInfo(temp_user_info);
        const newSpots = await getSpots();

        setParkingSpots(
          newSpots.map((spot: any) => ({
            ...spot,
            distance: distanceInMiles(
              spot.Lat,
              spot.Long,
              temp_user_info.lat,
              temp_user_info.long
            ),
          }))
        );
      }
    }
  }

  function toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  function distanceInMiles(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const R = 3958.8; // Earth's radius in miles

    // Convert degrees to radians
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await updateParams();
      } catch (err) {}
    };

    fetchData();
  }, []);

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
                <div key={spot.id}>
                  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
                    {/* Card Header: Spot name and availability badge */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-800">
                        Hannon Parking Lot
                      </h3>
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

                    {/* Address with map pin icon
                    <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Address here
                    </p> */}

                    {/* Time information */}
                    <div className="flex items-center gap-1 mb-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Available until:{" "}
                        <span className="font-semibold">
                          {spot.Time.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </span>
                    </div>

                    {/* Spot details: price, distance, and rating */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        {/* Price per hour */}
                        <span className="text-blue-600 font-bold text-lg flex items-center gap-1">
                          <DollarSign className="w-5 h-5" />
                          {spot.Price}
                        </span>
                        {/* Distance from user */}
                        <span className="text-gray-600 text-sm flex items-center gap-1">
                          <Navigation className="w-4 h-4" />
                          {spot.distance.toFixed(1)} mi
                        </span>
                      </div>

                      {/* Star rating */}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-700 font-semibold">
                          {spot.userInfo
                            ? spot.userInfo.rating.reduce(
                                (accumulator: number, currentValue: number) =>
                                  accumulator + currentValue,
                                0
                              ) / spot.userInfo.rating.length
                            : 5}
                        </span>
                      </div>
                    </div>

                    {/* Book Now button (only shown for available spots) */}
                    {spot.available && (
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setChosenSpot(spot);
                        }}
                        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
                      >
                        Book Now
                      </button>
                    )}
                    <BookingModal
                      spot={chosenSpot}
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      distance={spot.distance}
                      rating={
                        spot.userInfo
                          ? spot.userInfo.rating.reduce(
                              (accumulator: number, currentValue: number) =>
                                accumulator + currentValue,
                              0
                            ) / spot.userInfo.rating.length
                          : 5
                      }
                      sellerInfo={spot.userInfo}
                      price={4}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
