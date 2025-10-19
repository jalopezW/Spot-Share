import { Clock, DollarSign, MapPin, Navigation, Star, X } from "lucide-react";
import { useState, useEffect } from "react";
import { StripePaymentForm } from "./StripeComponent";

export function BookingModal({
  spot,
  isOpen,
  onClose,
  distance,
  rating,
  sellerInfo,
  price,
}: {
  spot: {
    lat: number;
    long: number;
    price: number;
    available: boolean;
    time: Date;
    userId: string;
  };
  isOpen: boolean;
  onClose: () => void;
  distance?: string; // e.g. "0.3 mi"
  rating?: number; // e.g. 4.7
  sellerInfo?: {
    name?: string;
    rating?: number[] | number;
  } | null;
  price?: number | string;
}) {
  const [hours, setHours] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  const totalPrice = 4;

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
            {showPayment
              ? "Secure checkout with Stripe"
              : "Complete your reservation"}
          </p>
        </div>

        <div className="p-6">
          {!showPayment ? (
            <>
              <div className="flex justify-between items-start mb-4">
                {spot.available ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    <span className="font-bold text-gray-800">Available</span>
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                    <span className="font-bold text-gray-800">Unavailable</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Rate</p>
                  <p className="font-bold text-gray-800">{price}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <Navigation className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Distance</p>
                  <p className="font-bold text-gray-800">{distance}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <Star className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Rating</p>
                  <p className="font-bold text-gray-800">{rating}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">
                      Total:
                    </span>
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
              spot={spot}
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
