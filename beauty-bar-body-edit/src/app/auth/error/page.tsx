"use client";

import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-cream">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-xl font-semibold text-navy mb-2">
            Authentication Error
          </h1>
          <p className="text-navy/70 mb-6">
            Something went wrong during sign in. Please try again.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link
              href="/auth/signin"
              className="w-full bg-gold text-white font-semibold py-3 px-4 rounded-xl hover:bg-gold/90 transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="w-full bg-navy/10 text-navy font-semibold py-3 px-4 rounded-xl hover:bg-navy/20 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
