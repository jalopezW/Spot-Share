"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserLocation } from "@/utils/location";
import { updateLocation } from "../../../databaseService";
import { useAuth } from "./AuthContext";
import { loggedInUserID } from "../../../authService";

interface LocationContextType {
  userLocation: { lat: number; lng: number } | null;
  isLoading: boolean;
  error: string | null;
  refetchLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const user = useAuth();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const location = await getUserLocation();
      setUserLocation(location);
      const userID = loggedInUserID();
      await updateLocation(userID, location.lat, location.lng);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error getting user location";
      console.error("Error getting user location:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        isLoading,
        error,
        refetchLocation: fetchLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
