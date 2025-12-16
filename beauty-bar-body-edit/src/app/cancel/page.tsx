"use client";

import { useState } from "react";
import Link from "next/link";

export default function CancelBookingPage() {
  const [bookingRef, setBookingRef] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingRef || !phone) {
      setResult({ error: "Please enter your booking reference and phone number" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `/api/bookings?action=cancel&id=${encodeURIComponent(bookingRef)}&phone=${encodeURIComponent(phone)}`
      );
      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message });
      } else {
        setResult({ error: data.error || "Failed to cancel booking" });
      }
    } catch {
      setResult({ error: "Network error. Please try again or contact us on WhatsApp." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-2xl font-semibold tracking-[0.15em] text-navy">
              THE BEAUTY BAR
            </h1>
            <p className="text-[10px] tracking-[0.3em] text-gold">YOUR BEST EDIT YET</p>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-navy">Cancel Booking</h2>
            <p className="text-sm text-navy/60 mt-2">
              Enter your booking details to cancel your appointment
            </p>
          </div>

          {result?.success ? (
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-800 font-medium">{result.message}</p>
              </div>
              
              <p className="text-sm text-navy/60">
                We hope to see you again soon! 💕
              </p>

              <div className="flex flex-col gap-3">
                <Link 
                  href="/book" 
                  className="w-full py-3 px-4 bg-gold text-cream rounded-full font-semibold text-center hover:bg-gold/90 transition-colors"
                >
                  Book New Appointment
                </Link>
                <Link 
                  href="/" 
                  className="w-full py-3 px-4 border border-navy/20 text-navy rounded-full font-semibold text-center hover:bg-cream-soft transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCancel} className="space-y-5">
              <div>
                <label className="block text-xs font-medium tracking-[0.15em] text-navy/70 uppercase mb-2">
                  Booking Reference *
                </label>
                <input
                  type="text"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
                  placeholder="e.g., TBB-M1ABC123"
                  className="w-full px-4 py-3 rounded-xl border border-navy/20 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium tracking-[0.15em] text-navy/70 uppercase mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +256700518006"
                  className="w-full px-4 py-3 rounded-xl border border-navy/20 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  required
                />
                <p className="text-xs text-navy/50 mt-1">
                  Enter the phone number you used when booking
                </p>
              </div>

              {result?.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                  {result.error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Cancelling...
                  </>
                ) : (
                  "Cancel My Booking"
                )}
              </button>

              <div className="text-center pt-4 border-t border-navy/10">
                <p className="text-xs text-navy/50 mb-3">
                  Need help? Contact us directly:
                </p>
                <a
                  href="https://wa.me/256700980021"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white text-sm font-medium hover:bg-[#20bd5a] transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/book" className="text-sm text-navy/60 hover:text-gold transition-colors">
            ← Back to Booking
          </Link>
        </div>
      </div>
    </div>
  );
}
