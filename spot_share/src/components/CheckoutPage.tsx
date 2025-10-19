"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { setAvailablity } from "../../databaseService";

export default function CheckoutForm({
  amount,
  spot,
  sellerInfo,
}: {
  amount: number;
  spot: { id: string };
  sellerInfo?: { name?: string; rating?: number[] | number } | null;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setErrorMessage(undefined);
    setLoading(true);

    try {
      // Validate inputs in the mounted PaymentElement (optional but recommended)
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message);
        setLoading(false);
        return;
      }

      console.log("SETTING AVAILABILITY");
      await setAvailablity(spot.id, false);

      // Confirm payment; only redirect if the bank requires it
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/buy/choose-spot/eta`,
        },
      });

      if (error) {
        console.log("CHANGING AVAILABILITY");
        await setAvailablity(spot.id, true);
        setErrorMessage(error.message ?? "Payment failed.");
        return;
      }
    } catch (err: any) {
      setErrorMessage(err?.message ?? "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      <PaymentElement />
      {errorMessage && <div className="mt-2 text-red-600">{errorMessage}</div>}
      <button
        disabled={!stripe || loading}
        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );
}
