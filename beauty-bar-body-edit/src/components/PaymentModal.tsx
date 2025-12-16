"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Shield,
  Check,
  Loader2,
  X,
  Sparkles,
  Lock,
} from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
  amount: number;
  currency?: string;
  bookingId: string;
  customerEmail?: string;
  customerName: string;
  serviceName: string;
};

type PaymentMethod = "card" | "mobile_money";

function CheckoutForm({
  amount,
  currency,
  bookingId,
  customerName,
  serviceName,
  onSuccess,
  onClose,
}: {
  amount: number;
  currency: string;
  bookingId: string;
  customerName: string;
  serviceName: string;
  onSuccess: (paymentId: string) => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/book/success?booking=${bookingId}`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }
  }

  const formattedAmount = new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="rounded-xl bg-cream-soft p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-navy/70">Service</span>
          <span className="font-medium text-navy">{serviceName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-navy/70">Customer</span>
          <span className="font-medium text-navy">{customerName}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-gold/20">
          <span className="font-semibold text-navy">Total</span>
          <span className="font-bold text-gold text-lg">{formattedAmount}</span>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="rounded-xl border border-gold/30 p-4 bg-white">
        <PaymentElement
          options={{
            layout: "tabs",
            business: { name: "The Body Edit" },
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700"
        >
          {errorMessage}
        </motion.div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-navy/60">
        <Lock className="h-3 w-3" />
        <span>Secured by Stripe · 256-bit SSL encryption</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="secondary-button"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="primary-button flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Pay {formattedAmount}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  currency = "UGX",
  bookingId,
  customerEmail,
  customerName,
  serviceName,
}: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileProvider, setMobileProvider] = useState<"mtn" | "airtel">("mtn");
  const [mobileProcessing, setMobileProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && !clientSecret) {
      createPaymentIntent();
    }
  }, [isOpen]);

  async function createPaymentIntent() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: currency.toLowerCase(),
          bookingId,
          customerEmail,
          customerName,
          serviceName,
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      console.error("Failed to create payment intent:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMobileMoneyPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!mobileNumber.trim()) return;

    setMobileProcessing(true);
    
    // Simulate mobile money payment processing
    // In production, integrate with MTN MoMo or Airtel Money APIs
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    // For demo, we'll show success
    alert(`Mobile Money payment request sent to ${mobileNumber}. Please approve the payment on your phone.`);
    setMobileProcessing(false);
  }

  const formattedAmount = new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-cream rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-navy to-navy-soft px-6 py-5 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20">
                  <Sparkles className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-semibold text-cream">Secure Payment</h2>
                  <p className="text-xs text-cream/70">The Body Edit</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Payment Method Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === "card"
                    ? "border-gold bg-gold/10"
                    : "border-gold/30 hover:border-gold/50"
                }`}
              >
                <CreditCard
                  className={`h-5 w-5 ${
                    paymentMethod === "card" ? "text-gold" : "text-navy/60"
                  }`}
                />
                <div className="text-left">
                  <p
                    className={`text-sm font-medium ${
                      paymentMethod === "card" ? "text-navy" : "text-navy/70"
                    }`}
                  >
                    Card
                  </p>
                  <p className="text-[10px] text-navy/50">Visa, Mastercard, Amex</p>
                </div>
                {paymentMethod === "card" && (
                  <Check className="h-4 w-4 text-gold ml-auto" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("mobile_money")}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === "mobile_money"
                    ? "border-gold bg-gold/10"
                    : "border-gold/30 hover:border-gold/50"
                }`}
              >
                <Smartphone
                  className={`h-5 w-5 ${
                    paymentMethod === "mobile_money" ? "text-gold" : "text-navy/60"
                  }`}
                />
                <div className="text-left">
                  <p
                    className={`text-sm font-medium ${
                      paymentMethod === "mobile_money" ? "text-navy" : "text-navy/70"
                    }`}
                  >
                    Mobile Money
                  </p>
                  <p className="text-[10px] text-navy/50">MTN, Airtel</p>
                </div>
                {paymentMethod === "mobile_money" && (
                  <Check className="h-4 w-4 text-gold ml-auto" />
                )}
              </button>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === "card" && (
              <>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gold" />
                    <p className="mt-3 text-sm text-navy/60">
                      Preparing secure checkout...
                    </p>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#d9a64d",
                          colorBackground: "#ffffff",
                          colorText: "#10223a",
                          colorDanger: "#dc2626",
                          fontFamily: "system-ui, sans-serif",
                          borderRadius: "12px",
                        },
                      },
                    }}
                  >
                    <CheckoutForm
                      amount={amount}
                      currency={currency}
                      bookingId={bookingId}
                      customerName={customerName}
                      serviceName={serviceName}
                      onSuccess={onSuccess}
                      onClose={onClose}
                    />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-navy/60">
                      Unable to initialize payment. Please try again.
                    </p>
                    <button
                      onClick={createPaymentIntent}
                      className="mt-4 primary-button"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Mobile Money Form */}
            {paymentMethod === "mobile_money" && (
              <form onSubmit={handleMobileMoneyPayment} className="space-y-4">
                {/* Order Summary */}
                <div className="rounded-xl bg-cream-soft p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/70">Service</span>
                    <span className="font-medium text-navy">{serviceName}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gold/20">
                    <span className="font-semibold text-navy">Total</span>
                    <span className="font-bold text-gold text-lg">
                      {formattedAmount}
                    </span>
                  </div>
                </div>

                {/* Provider Selection */}
                <div>
                  <label className="field-label">Provider</label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setMobileProvider("mtn")}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        mobileProvider === "mtn"
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-gold/30"
                      }`}
                    >
                      <p className="font-bold text-yellow-600">MTN MoMo</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileProvider("airtel")}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        mobileProvider === "airtel"
                          ? "border-red-500 bg-red-50"
                          : "border-gold/30"
                      }`}
                    >
                      <p className="font-bold text-red-600">Airtel Money</p>
                    </button>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="field-label" htmlFor="mobile">
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    placeholder={
                      mobileProvider === "mtn" ? "077XXXXXXX" : "070XXXXXXX"
                    }
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="field-input mt-2"
                    required
                  />
                </div>

                {/* Instructions */}
                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                  <p className="font-medium">How it works:</p>
                  <ol className="list-decimal list-inside mt-1 text-xs space-y-1">
                    <li>Enter your mobile money number</li>
                    <li>Click &quot;Pay&quot; to send payment request</li>
                    <li>Approve the payment on your phone</li>
                    <li>You&apos;ll receive confirmation once complete</li>
                  </ol>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="secondary-button"
                    disabled={mobileProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mobileProcessing || !mobileNumber.trim()}
                    className="primary-button flex items-center justify-center gap-2"
                  >
                    {mobileProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending request...
                      </>
                    ) : (
                      <>
                        <Smartphone className="h-4 w-4" />
                        Pay {formattedAmount}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-gold/20">
              <div className="flex items-center gap-1 text-[10px] text-navy/50">
                <Shield className="h-3 w-3" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-navy/50">
                <Lock className="h-3 w-3" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-navy/50">
                <Check className="h-3 w-3" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
