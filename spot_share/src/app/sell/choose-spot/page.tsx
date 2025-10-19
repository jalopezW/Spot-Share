"use client";
import { useEffect, useState } from "react";
import { MapPin, Edit3, Check } from "lucide-react";
import Modal from "@/components/items/Modal";
import SwipeToConfirm from "@/components/ui/swiper";
import { toast } from "sonner";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  getColor,
  getMake,
  getModel,
  getPlate,
  getUserInfo,
} from "../../../../databaseService";
import { loggedInUserID, useAuthentication } from "../../../../authService";
import { auth } from "../../../../firebaseConfig";
import { useAuth } from "@/components/contexts/AuthContext";

// Theme tokens inspired by the screenshot
const theme = {
  brandBlue: "#2563EB", // primary blue
  brandPurple: "#8B5CF6", // CTA purple
  bg: "#EEF5FF", // soft blue bg tint
};

/**
 * INTERACTIVE GOOGLE MAP COMPONENT
 * Same map as buy page - centered on LMU campus with same zoom
 */
interface InteractiveMapProps {
  markerPosition: { lat: number; lng: number } | null;
  onMapClick: (lat: number, lng: number) => void;
}

function InteractiveMap({ markerPosition, onMapClick }: InteractiveMapProps) {
  // Load API key from environment variable
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY || "";

  // Map center - same as buy page (LMU campus area)
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

  // Handle map click
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onMapClick(lat, lng);
    }
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        options={mapOptions}
        onClick={handleMapClick}
      >
        {/* Show marker at selected position */}
        {markerPosition && (
          <Marker
            position={markerPosition}
            animation={google.maps.Animation.DROP}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default function ChooseSpot() {
  const [address, setAddress] = useState("Hannon Parking lot, LMU");
  const [coords, setCoords] = useState({ lat: 33.966787, lng: -118.417631 }); // Updated to match buy page
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [openSellConfirmation, setOpenSellConfirmation] = useState(false);

  // Handle map click to update coordinates
  const handleMapClick = (lat: number, lng: number) => {
    const newCoords = { lat, lng };
    setCoords(newCoords);
    setMarkerPosition(newCoords);
    setAddress(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);

    // Show toast notification
    toast.success("Spot location updated!", {
      description: `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`,
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white pt-16 md:pt-20 ">
      {/* Hero question bar */}
      <section className="w-full border-b border-slate-200/60 bg-[rgba(242,247,255,0.8)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
          <p className="text-slate-500 text-sm">Confirm Location</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Is this the spot you want to sell?
          </h1>
        </div>
      </section>

      {/* Map Section */}
      <main className="relative mx-auto w-full max-w-6xl grow px-0 sm:px-6 pt-6 pb-28">
        <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200">
          {/* Interactive Google Map - same as buy page */}
          <InteractiveMap
            markerPosition={markerPosition}
            onMapClick={handleMapClick}
          />
        </div>
      </main>

      {/* Bottom confirm bar - only show after clicking on map */}
      {markerPosition && (
        <div className="fixed inset-x-0 bottom-0 z-50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-xl backdrop-blur">
              <div className="flex w-full items-center gap-3">
                <div className="hidden sm:block rounded-xl bg-blue-50 p-2">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div className="min-w-0 grow">
                  <p className="truncate text-sm text-slate-500">
                    Confirm spot
                  </p>
                  <p className="truncate font-medium text-slate-900">
                    {address}
                  </p>
                </div>
              </div>

              <div className="flex w-full sm:w-auto items-center gap-2">
                <button
                  onClick={() => setMarkerPosition(null)}
                  className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Not this spot
                </button>
                <button
                  onClick={() => setOpenSellConfirmation(true)}
                  className="w-full sm:w-auto inline-flex hover:cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brandPurple,#8B5CF6)] px-5 py-3 text-sm font-semibold text-white shadow-md hover:brightness-[0.95]"
                >
                  <Check className="h-5 w-5" /> Confirm this spot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <SellConfirmationModal
        open={openSellConfirmation}
        onClose={() => setOpenSellConfirmation(false)}
      />
    </div>
  );
}

type ModalProps = { open: boolean; onClose: () => void };
const SellConfirmationModal: React.FC<ModalProps> = ({
  open,
  onClose,
}: ModalProps) => {
  useAuth();

  const [formData, setFormData] = useState({
    time: "",
    carMake: "",
    carModel: "",
    carLicense: "",
  });

  const [model, setModel] = useState("");
  const [make, setMake] = useState("");
  const [color, setColor] = useState("");
  const [license, setLicense] = useState("");

  const isFormValid = formData.time && formData.carMake && formData.carModel;

  const handleConfirm = () => {
    if (!isFormValid) {
      toast.error("Please fill in all fields before confirming");
      return;
    }

    toast.success("Spot listing confirmed!", {
      description: `${formData.carMake} ${formData.carModel} - Available at ${formData.time}`,
    });

    setFormData({ time: "", carMake: "", carModel: "", carLicense: "" });
    onClose();
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function updateParams() {
    if (auth.currentUser != null) {
      const userID = loggedInUserID();
      const userInfo = await getUserInfo(userID);
      if (userInfo != undefined) {
        setModel(userInfo.model);
        setMake(userInfo.make);
        setColor(userInfo.color);
        setLicense(userInfo.plate);
      }
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
    <Modal
      open={open}
      onClose={onClose}
      title="List Your Parking Spot"
      className="bg-red-900"
    >
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-black">Sell Your Spot</h3>
          <p className="text-muted-foreground">
            Fill in the details below to list your parking spot and start
            earning.
          </p>
        </div>

        <div className="space-y-6 bg-card border border-border rounded-xl p-6">
          <div className="space-y-2">
            <label htmlFor="time" className="text-md font-medium mr-5">
              Available Time
            </label>
            <input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("time", e.target.value)
              }
              className="h-12 text-base"
              placeholder="Select time"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-lg">Listing Summary</h4>
            <div className="space-y-1 text-lg text-muted-foreground">
              <p>
                <span className="font-medium">Time:</span>{" "}
                {formData.time || "Not set"}
              </p>
              <p>
                Vehicle: {color} {make} {model}
              </p>
              <p>Plate #: {license}</p>
            </div>
          </div>

          <SwipeToConfirm
            onConfirm={handleConfirm}
            text="Swipe to list spot"
            disabled={!isFormValid}
          />

          {!isFormValid && (
            <p className="text-xs text-muted-foreground text-center">
              Complete all fields to enable confirmation
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
