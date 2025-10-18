import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover", // Use the latest stable API version
});

export async function POST(request: NextRequest) {
  try {
    const { spotId, spotName, amount, hours } = await request.json();

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: spotName,
              description: `${hours} hour${
                hours > 1 ? "s" : ""
              } of parking at ${spotName}`,
            },
            unit_amount: amount, // amount should be in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?amount=${
        amount / 100
      }`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/buy/choose-spot?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe API Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
