"use client";
import { useState } from "react";
import { MapPin, Edit3, Check } from "lucide-react";
import Modal from "@/components/items/Modal";
import SwipeToConfirm from "@/components/ui/swiper";
import { toast } from "sonner";

// Theme tokens inspired by the screenshot
const theme = {
  brandBlue: "#2563EB", // primary blue
  brandPurple: "#8B5CF6", // CTA purple
  bg: "#EEF5FF", // soft blue bg tint
};

export default function ChooseSpot() {
  const [address] = useState("Hannon Parking lot, LMU");
  const [coords] = useState({ lat: 34.0107, lng: -118.492 });
  const [openSellConfirmation, setOpenSellConfirmation] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col bg-white pt-16 md:pt-20 ">
      {/* Hero question bar */}
      <section className="w-full border-b border-slate-200/60 bg-[rgba(242,247,255,0.8)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
          <p className="text-slate-500 text-sm">Confirm Location</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Is this the spot you want to sell?
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-sm text-slate-700 shadow-sm">
              <MapPin className="h-4 w-4 text-blue-600" /> {address}
            </span>
            <button className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Edit3 className="h-4 w-4" /> Edit location
            </button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <main className="relative mx-auto w-full max-w-6xl grow px-0 sm:px-6 pt-6 pb-28">
        <div
          className="relative h-[60vh] w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200"
          style={{
            background: `radial-gradient(100% 60% at 50% 0%, ${theme.bg}, #ffffff)`,
          }}
        >
          {/* Faux map grid / tiles */}
          <div className="absolute inset-0 bg-[linear-gradient(#e5eefc_1px,transparent_1px),linear-gradient(90deg,#e5eefc_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* Rivers / roads hint lines */}
          <svg
            className="absolute inset-0 h-full w-full opacity-50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="road" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#c7d8fe" />
                <stop offset="100%" stopColor="#a8c1fd" />
              </linearGradient>
            </defs>
            <path
              d="M0,200 C150,220 250,120 400,140 C550,160 650,240 800,220 C950,200 1100,160 1280,190"
              fill="none"
              stroke="url(#road)"
              strokeWidth="8"
            />
            <path
              d="M100,420 C280,380 520,450 720,410 C920,370 1120,440 1400,410"
              fill="none"
              stroke="url(#road)"
              strokeWidth="8"
            />
          </svg>

          {/* Selected Pin */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* pulse */}
              <span className="absolute -inset-8 rounded-full bg-blue-500/10 animate-ping" />
              <span className="absolute -inset-4 rounded-full bg-blue-500/10" />
              {/* pin */}
              <div className="grid place-items-center">
                <MapPin className="h-14 w-14 text-blue-600 drop-shadow" />
                <div className="-mt-1 h-2 w-10 rounded-full bg-slate-300/70 blur-[2px]" />
              </div>
            </div>
            <div className="mt-3 rounded-lg bg-white/90 px-3 py-2 text-sm shadow-md ring-1 ring-slate-200 backdrop-blur">
              <div className="font-semibold text-slate-900">
                Selected location
              </div>
              <div className="text-slate-600">
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom confirm bar */}
      <div className="fixed inset-x-0 bottom-0 z-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-xl backdrop-blur">
            <div className="flex w-full items-center gap-3">
              <div className="hidden sm:block rounded-xl bg-blue-50 p-2">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="min-w-0 grow">
                <p className="truncate text-sm text-slate-500">Confirm spot</p>
                <p className="truncate font-medium text-slate-900">{address}</p>
              </div>
            </div>

            <div className="flex w-full sm:w-auto items-center gap-2">
              <button className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
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
  const [formData, setFormData] = useState({
    time: "",
    carMake: "",
    carModel: "",
    carLicense: "",
  });

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="carMake" className="text-md font-medium mr-5">
                Car Make
              </label>
              <input
                id="carMake"
                type="text"
                value={formData.carMake}
                onChange={(e) => handleInputChange("carMake", e.target.value)}
                className="h-12 text-base"
                placeholder="e.g., Toyota"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="carModel" className="text-md font-medium mr-5">
                Car Model
              </label>
              <input
                id="carModel"
                type="text"
                value={formData.carModel}
                onChange={(e) => handleInputChange("carModel", e.target.value)}
                className="h-12 text-base"
                placeholder="e.g., Camry"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="carModel" className="text-md font-medium mr-5">
                License Plate
              </label>
              <input
                id="carLicense"
                type="text"
                value={formData.carLicense}
                onChange={(e) =>
                  handleInputChange("carLicense", e.target.value)
                }
                className="h-12 text-base"
                placeholder="ABC123"
              />
            </div>
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
                <span className="font-medium">Vehicle:</span>{" "}
                {formData.carMake && formData.carModel
                  ? `${formData.carMake} ${formData.carModel}`
                  : "Not specified"}
              </p>
              <p>
                <span className="font-medium">Plate #:</span>{" "}
                {formData.carLicense
                  ? `${formData.carLicense}`
                  : "Not specified"}
              </p>
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
