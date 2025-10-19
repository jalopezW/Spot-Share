"use client";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "@/components/CheckoutPage";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

import {
  ArrowLeft,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  Navigation,
  Star,
  X,
} from "lucide-react";

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

export function BookingModal({
  spot,
  isOpen,
  onClose,
}: {
  spot: (typeof parkingSpots)[0];
  isOpen: boolean;
  onClose: () => void;
}) {
  const [hours, setHours] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  const hourlyRate = parseFloat(spot.price.replace("$", "").replace("/hr", ""));
  const totalPrice = hourlyRate * hours;

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
                <div>
                  <h3 className="font-bold text-xl text-gray-800">
                    {spot.name}
                  </h3>
                  <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {spot.address}
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  Available
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Rate</p>
                  <p className="font-bold text-gray-800">{spot.price}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <Navigation className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Distance</p>
                  <p className="font-bold text-gray-800">{spot.distance}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <Star className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Rating</p>
                  <p className="font-bold text-gray-800">{spot.rating}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Select Duration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 6, 8, 12, 24].map((h) => (
                    <button
                      key={h}
                      onClick={() => setHours(h)}
                      className={`py-3 px-2 rounded-lg font-semibold text-sm transition-all ${
                        hours === h
                          ? "bg-blue-600 text-white shadow-lg scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Hourly Rate:</span>
                  <span className="font-semibold">
                    ${hourlyRate.toFixed(2)}/hr
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">
                    {hours} hour{hours > 1 ? "s" : ""}
                  </span>
                </div>
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
              spotName={spot.name}
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

function StripePaymentForm({
  amount,
  spotName,
  hours,
  spotId,
  onBack,
}: {
  amount: number;
  spotName: string;
  hours: number;
  spotId: number;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [openPurchase, setOpenPurchase] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Create PaymentIntent on the server
    (async () => {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5 * 100 }),
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
    })();
  }, []);

  if (!clientSecret) {
    return <div className="pt-20">Loading checkout…</div>;
  }

  return (
    <div>
      {!openPurchase && (
        <>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to booking details
          </button>
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-3">
              Payment Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-semibold text-gray-800">{spotName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-800">
                  {hours} hour{hours > 1 ? "s" : ""}
                </span>
              </div>
              <div className="border-t border-blue-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">
                    Total Amount:
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    ${amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
            <div className="flex items-center justify-center mb-4">
              <CreditCard className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-center font-bold text-gray-800 mb-2">
              Secure Payment via Stripe
            </h3>
            <p className="text-center text-sm text-gray-600 mb-4">
              You'll be redirected to Stripe's secure checkout page to complete
              your payment
            </p>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <button
            onClick={() => setOpenPurchase(true)}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Redirecting to Stripe...
              </span>
            ) : (
              `Proceed to Stripe Checkout - $${amount.toFixed(2)}`
            )}
          </button>
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secured by Stripe • SSL Encrypted</span>
          </div>
        </>
      )}
      {openPurchase && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: clientSecret, // Add this line
            appearance: {
              theme: "stripe",
            },
          }}
        >
          <CheckoutPage amount={5} />
        </Elements>
      )}
    </div>
  );
}
