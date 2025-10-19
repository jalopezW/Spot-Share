"use client";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "@/components/CheckoutPage";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

import { ArrowLeft, CreditCard } from "lucide-react";

export function StripePaymentForm({
  amount,
  spot,
  hours,
  onBack,
  sellerInfo,
}: {
  amount: number;
  spot: any;
  sellerInfo?: {
    name?: string;
    rating?: number[] | number;
  } | null;
  hours: number;
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
                <span className="font-semibold text-gray-800">
                  Hannon Parking Lot
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
          <CheckoutPage amount={5} spot={spot} sellerInfo={sellerInfo} />
        </Elements>
      )}
    </div>
  );
}
