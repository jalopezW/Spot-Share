"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, Navigation, Star, X, User } from "lucide-react";
import { StripePaymentForm } from "./StripeComponent";

// --- Interfaces ---
interface SellerVehicleInfo {
  first_name?: string;
  make?: string;
  model?: string;
  color?: string;
  plate?: string;
  rating?: string;
}

interface SpotInfo {
  id: string | number;
  lat: number;
  long: number;
  price: number;
  available: boolean;
  time: Date;
  userId: string;
  name?: string;
  address?: string;
}

export function BookingModal({
  spot,
  isOpen,
  onClose,
  distance,
  sellerInfo,
}: {
  spot: SpotInfo;
  isOpen: boolean;
  onClose: () => void;
  distance?: string;
  sellerInfo?: SellerVehicleInfo | null;
}) {
  const [hours, setHours] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [vehicleImageUrl, setVehicleImageUrl] = useState(
    "/honda-civic-gray.webp"
  );
  const [imageLoading, setImageLoading] = useState(false);

  const totalPrice = 4;
  const displayPlate = sellerInfo?.plate
    ? `***${sellerInfo.plate.slice(-3)}`
    : "N/A";

  // --- Fetch Vehicle Image from API Route ---
  useEffect(() => {
    const fetchVehicleImage = async () => {
      if (!sellerInfo?.make || !sellerInfo?.model) return;

      setImageLoading(true);

      try {
        setVehicleImageUrl("/honda-civic-gray.webp");
      } catch (err) {
        console.error(err);
        setVehicleImageUrl("/honda-civic-gray.webp");
      } finally {
        setImageLoading(false);
      }
    };

    if (isOpen) fetchVehicleImage();
    else setVehicleImageUrl("/honda-civic-gray.webp");
  }, [sellerInfo, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setShowPayment(false);
      setHours(1);
    }
  }, [isOpen]);

  const handleProceedToPayment = () => setShowPayment(true);
  const handleBackToBooking = () => setShowPayment(false);

  if (!isOpen) return null;

  const hourlyRateDisplay = `$4/hr`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-white/40 backdrop-blur-sm cursor-default"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto border border-gray-200 flex flex-col cursor-default">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-4 rounded-t-xl z-10 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">
              {showPayment ? "Complete Payment" : "Book Parking Spot"}
            </h2>
            <p className="text-blue-100 text-xs mt-0.5">
              {showPayment ? "Secure checkout via Stripe" : "Confirm details"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-blue-100 hover:bg-white/20 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 flex-grow">
          {!showPayment ? (
            <div className="flex flex-col h-full">
              {/* Seller & Vehicle Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2.5">
                  <h4 className="font-medium text-gray-700 flex items-center gap-1.5 text-sm">
                    <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    Seller: {sellerInfo?.first_name || "N/A"}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      spot.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {spot.available ? "Available" : "Occupied"}
                  </span>
                </div>

                {/* Vehicle */}
                <div className="flex gap-3 items-center mt-2 pt-2.5 border-t border-gray-200">
                  <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                    {imageLoading ? (
                      <div className="animate-pulse bg-gray-300 w-full h-full" />
                    ) : (
                      <img
                        src={vehicleImageUrl}
                        alt={`${sellerInfo?.make || ""} ${
                          sellerInfo?.model || "vehicle"
                        }`}
                        className="object-cover w-full h-full"
                        onError={(e) =>
                          (e.currentTarget.src = "/honda-civic-gray.webp")
                        }
                      />
                    )}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-gray-800 leading-tight">
                      {sellerInfo?.make
                        ? sellerInfo.make.charAt(0).toUpperCase() +
                          sellerInfo.make.slice(1)
                        : ""}{" "}
                      {sellerInfo?.model
                        ? sellerInfo.model.charAt(0).toUpperCase() +
                          sellerInfo.model.slice(1)
                        : ""}
                    </p>
                    <p className="text-gray-600 leading-tight">
                      Color:{" "}
                      {sellerInfo?.color
                        ? sellerInfo.color.charAt(0).toUpperCase() +
                          sellerInfo.color.slice(1)
                        : "N/A"}
                    </p>
                    <p className="text-gray-600 leading-tight">
                      Plate: {displayPlate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating & Distance */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="bg-blue-50 rounded-md p-2.5 text-center border border-blue-100">
                  <Star className="w-4 h-4 text-yellow-400 mx-auto mb-0.5" />
                  <p className="text-[10px] text-blue-800 uppercase font-medium leading-tight">
                    Rating
                  </p>
                  <p className="font-semibold text-xs text-gray-800 mt-0.5">
                    {sellerInfo?.rating}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-md p-2.5 text-center border border-purple-100">
                  <Navigation className="w-4 h-4 text-purple-600 mx-auto mb-0.5" />
                  <p className="text-[10px] text-purple-800 uppercase font-medium leading-tight">
                    Distance
                  </p>
                  <p className="font-semibold text-xs text-gray-800 mt-0.5">
                    {distance
                      ? parseFloat(distance).toFixed(1) + " miles"
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Total Price */}
              <div className="bg-gray-50 rounded-lg p-3 mb-5 border border-gray-200 mt-auto">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">
                    Total Price:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="cursor-pointer flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          ) : (
            <StripePaymentForm
              amount={totalPrice}
              spot={spot}
              hours={hours}
              onBack={handleBackToBooking}
              sellerInfo={sellerInfo}
            />
          )}
        </div>
      </div>
    </div>
  );
}
