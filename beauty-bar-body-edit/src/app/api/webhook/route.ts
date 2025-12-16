import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";

// Only initialize Stripe if API key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-11-17.clover" })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

async function sendPaymentConfirmationEmail(
  customerEmail: string,
  customerName: string,
  bookingId: string,
  serviceName: string,
  amount: number,
  currency: string
) {
  const ownerEmail = process.env.BOOKING_TO_EMAIL;
  const fromEmail = process.env.BOOKING_FROM_EMAIL || ownerEmail;

  if (!ownerEmail || !fromEmail) return;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });

    const formattedAmount = new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);

    // Send to owner
    await transporter.sendMail({
      to: ownerEmail,
      from: fromEmail,
      subject: `💰 Payment Received! ${customerName} · ${bookingId}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10223a 0%, #233651 100%); color: white; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">💳 Payment Confirmed!</h1>
          </div>
          <div style="background: #fdf6e9; padding: 30px; border-radius: 0 0 16px 16px;">
            <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <h2 style="color: #10223a; margin-top: 0;">Payment Details</h2>
              <p><strong>Amount:</strong> ${formattedAmount}</p>
              <p><strong>Booking ID:</strong> ${bookingId}</p>
              <p><strong>Service:</strong> ${serviceName}</p>
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${customerEmail}</p>
            </div>
            <p style="color: #666; font-size: 14px;">This payment was processed securely via Stripe.</p>
          </div>
        </div>
      `,
    });

    // Send receipt to customer
    if (customerEmail) {
      await transporter.sendMail({
        to: customerEmail,
        from: fromEmail,
        subject: `✨ Payment Confirmed - The Body Edit · ${bookingId}`,
        html: `
          <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #d9a64d 0%, #f0c979 100%); color: #10223a; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">✨ Thank You for Your Payment!</h1>
              <p style="margin: 10px 0 0;">The Body Edit · Your Best Edit Yet</p>
            </div>
            <div style="background: #fdf6e9; padding: 30px; border-radius: 0 0 16px 16px;">
              <p style="font-size: 16px; color: #10223a;">Dear ${customerName},</p>
              <p style="color: #333;">Your payment has been successfully processed. Here are your details:</p>
              
              <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #d9a64d;">
                <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ${formattedAmount}</p>
                <p style="margin: 5px 0;"><strong>Booking Reference:</strong> ${bookingId}</p>
                <p style="margin: 5px 0;"><strong>Service:</strong> ${serviceName}</p>
              </div>
              
              <p style="color: #333;">We're excited to see you! Our team will reach out to confirm your appointment time.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0d3b8;">
                <p style="color: #666; font-size: 14px; margin: 0;">With love,</p>
                <p style="color: #10223a; font-weight: 600; margin: 5px 0;">The Body Edit Team</p>
                <p style="color: #d9a64d; font-size: 12px; margin: 0;">Your Best Edit Yet ✨</p>
              </div>
            </div>
          </div>
        `,
      });
    }
  } catch (error) {
    console.error("Error sending payment confirmation email:", error);
  }
}

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { bookingId, serviceName, customerName } = paymentIntent.metadata;
      
      await sendPaymentConfirmationEmail(
        paymentIntent.receipt_email || "",
        customerName,
        bookingId,
        serviceName,
        paymentIntent.amount,
        paymentIntent.currency
      );
      
      console.log(`✅ Payment succeeded for booking ${bookingId}`);
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log(`❌ Payment failed for booking ${failedPayment.metadata.bookingId}`);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
