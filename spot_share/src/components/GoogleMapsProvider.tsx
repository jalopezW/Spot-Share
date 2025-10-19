"use client";

import { LoadScript } from "@react-google-maps/api";
import { ReactNode } from "react";

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY || "";

  return (
    <LoadScript 
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      id="google-maps-script"
      preventGoogleFontsLoading
    >
      {children}
    </LoadScript>
  );
}
