import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Only initialize Stripe if API key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-11-17.clover" })
  : null;

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!stripe) {
    return NextResponse.json(
      { error: "Payment system not configured. Please contact us on WhatsApp: +256 700 980 021" },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const { amount, currency = "ugx", bookingId, customerEmail, customerName, serviceName } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Stripe expects amount in smallest currency unit
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingId: bookingId || "",
        serviceName: serviceName || "",
        customerName: customerName || "",
      },
      receipt_email: customerEmail || undefined,
      description: `The Body Edit - ${serviceName || "Booking"}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
