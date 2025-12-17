"use client";

import { useState, useEffect } from "react";

type Booking = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  category: string;
  price: number;
  date: string;
  time: string;
  notes?: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // Simple password protection (change this password!)
  const ADMIN_PASSWORD = "beautybar2025";

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
    } else {
      alert("Wrong password!");
    }
  };

  useEffect(() => {
    // Check if already authenticated
    if (localStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchBookings();
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchBookings, 30000);
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings?key=admin_beautybar_2025");
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-UG").format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-UG", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Login Screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-cream-soft flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-navy">🎀 Beauty Bar Admin</h1>
            <p className="text-navy/60 text-sm mt-2">Enter password to view bookings</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 rounded-xl border border-gold/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-gold text-white py-3 rounded-xl font-semibold hover:bg-gold/90 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Delete booking handler
  const handleDelete = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to delete this booking? This cannot be undone.")) return;
    try {
      const response = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, key: "admin_beautybar_2025" }),
      });
      if (response.ok) {
        fetchBookings();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete booking.");
      }
    } catch (error) {
      alert("Failed to delete booking.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-cream-soft">
      {/* Header */}
      <div className="bg-navy text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">🎀 Beauty Bar Admin</h1>
            <p className="text-cream/70 text-sm">Booking Management</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchBookings}
              className="bg-gold/20 hover:bg-gold/30 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("admin_auth");
                setAuthenticated(false);
              }}
              className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-navy/60 text-xs uppercase tracking-wider">Total Bookings</p>
            <p className="text-2xl font-bold text-navy">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-navy/60 text-xs uppercase tracking-wider">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "confirmed").length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-navy/60 text-xs uppercase tracking-wider">Cancelled</p>
            <p className="text-2xl font-bold text-red-500">
              {bookings.filter((b) => b.status === "cancelled").length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-navy/60 text-xs uppercase tracking-wider">Total Revenue</p>
            <p className="text-xl font-bold text-gold">
              UGX {formatPrice(bookings.filter((b) => b.status === "confirmed").reduce((sum, b) => sum + b.price, 0))}
            </p>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gold/20">
            <h2 className="font-semibold text-navy">Recent Bookings</h2>
            <p className="text-xs text-navy/60">Auto-refreshes every 30 seconds</p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-navy/60">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-navy/60">No bookings yet</p>
              <p className="text-xs text-navy/40 mt-2">New bookings will appear here automatically</p>
            </div>
          ) : (
            <div className="divide-y divide-gold/10">
              {bookings
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-cream/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {booking.status}
                          </span>
                          <span className="font-mono text-xs text-gold">{booking.id}</span>
                        </div>
                        <h3 className="font-semibold text-navy">{booking.name}</h3>
                        <p className="text-sm text-navy/70">{booking.service}</p>
                      </div>

                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="text-navy/60">📞</span>{" "}
                          <a href={`tel:${booking.phone}`} className="text-gold hover:underline">
                            {booking.phone}
                          </a>
                        </p>
                        {booking.email && (
                          <p className="text-sm">
                            <span className="text-navy/60">✉️</span>{" "}
                            <a href={`mailto:${booking.email}`} className="text-gold hover:underline">
                              {booking.email}
                            </a>
                          </p>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm text-navy/70">
                          📅 {booking.date} at {booking.time}
                        </p>
                        <p className="text-sm font-semibold text-gold">
                          UGX {formatPrice(booking.price)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                        >
                          WhatsApp
                        </a>
                        <a
                          href={`tel:${booking.phone}`}
                          className="bg-navy text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-navy-soft transition-colors"
                        >
                          Call
                        </a>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {booking.notes && (
                      <p className="mt-2 text-xs text-navy/60 bg-cream/50 p-2 rounded">
                        📝 {booking.notes}
                      </p>
                    )}
                    <p className="mt-2 text-[10px] text-navy/40">
                      Booked: {formatDate(booking.createdAt)}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
