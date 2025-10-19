"use client";

import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "@/components/CheckoutPage";
import { Convergence } from "next/font/google";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function Page() {
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
    <>
      <div className="pt-20">
        <h1 className="text-4xl font-bold text-gray-800">Checkout</h1>
      </div>

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
    </>
  );
}
