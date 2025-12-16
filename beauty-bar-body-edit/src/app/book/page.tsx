"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE DATA
// ─────────────────────────────────────────────────────────────────────────────
const services = [
  // Infusion Bar - Signature Favorites
  {
    id: "total-body-edit",
    name: "Total Body Edit",
    category: "Infusion Bar",
    subcategory: "Signature Favorites",
    price: 450000,
    duration: 60,
    description: "Complete wellness reset with hydration, vitamins, and minerals.",
  },
  {
    id: "nad-cellular",
    name: "NAD+ Cellular Regeneration",
    category: "Infusion Bar",
    subcategory: "Signature Favorites",
    price: 680000,
    duration: 90,
    description: "Energy, longevity, and mental clarity through cellular repair.",
  },
  {
    id: "glow-radiance",
    name: "Glow & Radiance Infusion",
    category: "Infusion Bar",
    subcategory: "Signature Favorites",
    price: 370000,
    duration: 45,
    description: "Brightening, even tone, and luminous skin from within.",
  },
  // Infusion Bar - Balance & Metabolism
  {
    id: "weight-management",
    name: "Weight Management Mix",
    category: "Infusion Bar",
    subcategory: "Balance & Metabolism",
    price: 320000,
    duration: 45,
    description: "Support fat burn and metabolism optimization.",
  },
  {
    id: "detox-infusion",
    name: "Detoxification Infusion",
    category: "Infusion Bar",
    subcategory: "Balance & Metabolism",
    price: 280000,
    duration: 40,
    description: "Cleanse and reset your system with targeted nutrients.",
  },
  {
    id: "hangover-recovery",
    name: "Hangover & Recovery",
    category: "Infusion Bar",
    subcategory: "Balance & Metabolism",
    price: 250000,
    duration: 30,
    description: "Fast relief from dehydration and fatigue.",
  },
  // Infusion Bar - Skin & Beauty
  {
    id: "skin-whitening",
    name: "Skin Whitening Mix",
    category: "Infusion Bar",
    subcategory: "Skin & Beauty",
    price: 400000,
    duration: 50,
    description: "Glutathione and vitamin C for brighter, even skin tone.",
  },
  {
    id: "anti-aging",
    name: "Skin Anti-Aging Infusion",
    category: "Infusion Bar",
    subcategory: "Skin & Beauty",
    price: 450000,
    duration: 55,
    description: "Combat fine lines with collagen-boosting nutrients.",
  },
  {
    id: "glow-boost-shot",
    name: "Glow Boost Shot",
    category: "Infusion Bar",
    subcategory: "Skin & Beauty",
    price: 150000,
    duration: 15,
    description: "Quick vitamin boost for instant radiance.",
  },
  // Infusion Bar - Wellness & Mood
  {
    id: "stress-relief",
    name: "Stress Relief & Calm",
    category: "Infusion Bar",
    subcategory: "Wellness & Mood",
    price: 300000,
    duration: 45,
    description: "Magnesium and B-vitamins for relaxation and mental clarity.",
  },
  {
    id: "immune-boost",
    name: "Immune Boost Infusion",
    category: "Infusion Bar",
    subcategory: "Wellness & Mood",
    price: 280000,
    duration: 40,
    description: "High-dose vitamin C and zinc for immune support.",
  },
  {
    id: "energy-vitality",
    name: "Energy & Vitality",
    category: "Infusion Bar",
    subcategory: "Wellness & Mood",
    price: 320000,
    duration: 45,
    description: "B12 and amino acids for sustained energy.",
  },
  // Edit Studio - Body Sculpting
  {
    id: "cryo-fat-freezing",
    name: "Cryolipolysis Fat Freezing",
    category: "Edit Studio",
    subcategory: "Body Sculpting",
    price: 800000,
    duration: 60,
    description: "Non-invasive fat reduction through controlled cooling.",
  },
  {
    id: "body-contouring",
    name: "Body Contouring & Tightening",
    category: "Edit Studio",
    subcategory: "Body Sculpting",
    price: 600000,
    duration: 45,
    description: "RF technology for skin tightening and cellulite reduction.",
  },
  {
    id: "sculpt-tone",
    name: "Sculpt & Tone Session",
    category: "Edit Studio",
    subcategory: "Body Sculpting",
    price: 500000,
    duration: 40,
    description: "Muscle stimulation for definition and tone.",
  },
  // Edit Studio - Intimate Wellness
  {
    id: "intimate-rejuvenation",
    name: "Intimate Rejuvenation",
    category: "Edit Studio",
    subcategory: "Female Intimate Wellness",
    price: 700000,
    duration: 45,
    description: "Non-surgical intimate wellness treatment.",
  },
  {
    id: "intimate-tightening",
    name: "Intimate Tightening",
    category: "Edit Studio",
    subcategory: "Female Intimate Wellness",
    price: 650000,
    duration: 40,
    description: "RF-based intimate tightening and comfort enhancement.",
  },
  // Edit Studio - Skin Rejuvenation
  {
    id: "facial-rejuvenation",
    name: "Facial Rejuvenation",
    category: "Edit Studio",
    subcategory: "Skin Rejuvenation",
    price: 400000,
    duration: 50,
    description: "Advanced facial treatment for youthful, glowing skin.",
  },
  {
    id: "micro-needling",
    name: "Micro-Needling Therapy",
    category: "Edit Studio",
    subcategory: "Skin Rejuvenation",
    price: 350000,
    duration: 45,
    description: "Collagen induction for smoother, firmer skin.",
  },
  // Lash Lounge - Prices Updated Dec 2025
  {
    id: "classic-full-set",
    name: "Classic Full Set",
    category: "Lash Lounge",
    subcategory: "Lash Extensions",
    price: 100000,
    duration: 90,
    description: "Natural-looking classic lash extensions.",
  },
  {
    id: "hybrid-full-set",
    name: "Hybrid Full Set",
    category: "Lash Lounge",
    subcategory: "Lash Extensions",
    price: 100000,
    duration: 90,
    description: "Mix of classic and volume for textured fullness.",
  },
  {
    id: "volume-full-set",
    name: "Volume Full Set",
    category: "Lash Lounge",
    subcategory: "Lash Extensions",
    price: 130000,
    duration: 120,
    description: "Dramatic, fluffy volume lash set.",
  },
  {
    id: "mega-volume",
    name: "Mega Volume Full Set",
    category: "Lash Lounge",
    subcategory: "Lash Extensions",
    price: 150000,
    duration: 150,
    description: "Ultra-dramatic mega volume for maximum impact.",
  },
  {
    id: "wet-set",
    name: "Wet Set Lashes",
    category: "Lash Lounge",
    subcategory: "Lash Extensions",
    price: 120000,
    duration: 90,
    description: "Trendy wet/spiky look for a bold style.",
  },
  {
    id: "anime-set",
    name: "Anime Set Lashes",
    category: "Lash Lounge",
    subcategory: "Lash Extensions",
    price: 120000,
    duration: 90,
    description: "Dramatic anime-inspired lash style.",
  },
  {
    id: "wispy-hybrid",
    name: "Wispy Hybrid",
    category: "Lash Lounge",
    subcategory: "Wispy Collection",
    price: 100000,
    duration: 90,
    description: "Soft, wispy hybrid lash look.",
  },
  {
    id: "wispy-volume",
    name: "Wispy Volume",
    category: "Lash Lounge",
    subcategory: "Wispy Collection",
    price: 130000,
    duration: 120,
    description: "Fluffy wispy volume lash set.",
  },
  {
    id: "wispy-mega-volume",
    name: "Wispy Mega Volume",
    category: "Lash Lounge",
    subcategory: "Wispy Collection",
    price: 150000,
    duration: 150,
    description: "Full wispy mega volume for ultimate drama.",
  },
  {
    id: "lash-infill",
    name: "Lash Refill (2-3 weeks)",
    category: "Lash Lounge",
    subcategory: "Maintenance",
    price: 0,
    duration: 60,
    description: "Half price refill within 2-3 weeks of new set. After that, it's a new set.",
  },
  {
    id: "lash-removal",
    name: "Lash Removal",
    category: "Lash Lounge",
    subcategory: "Maintenance",
    price: 20000,
    duration: 30,
    description: "Safe, gentle removal of existing extensions.",
  },
];

// Generate time slots from 9 AM to 7 PM
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 19; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    const label = hour < 12 ? `${hour}:00 AM` : hour === 12 ? "12:00 PM" : `${hour - 12}:00 PM`;
    slots.push({ value: time, label });
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Get next 30 days for date selection
const getAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-UG", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-UG").format(price);
};

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [aiMessage, setAiMessage] = useState("");

  const availableDates = useMemo(() => getAvailableDates(), []);

  const categories = useMemo(() => {
    const cats = [...new Set(services.map((s) => s.category))];
    return cats;
  }, []);

  const filteredServices = useMemo(() => {
    if (!selectedCategory) return [];
    return services.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const groupedServices = useMemo(() => {
    const groups: Record<string, typeof services> = {};
    filteredServices.forEach((service) => {
      if (!groups[service.subcategory]) {
        groups[service.subcategory] = [];
      }
      groups[service.subcategory].push(service);
    });
    return groups;
  }, [filteredServices]);

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !formData.name || !formData.phone) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: selectedService.name,
          serviceId: selectedService.id,
          category: selectedService.category,
          price: selectedService.price,
          duration: selectedService.duration,
          date: selectedDate.toISOString().split("T")[0],
          time: selectedTime,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookingRef(data.bookingRef || `TBB-${Date.now().toString(36).toUpperCase()}`);
        setAiMessage(data.message || "Thank you for booking with The Beauty Bar UG! 🎀");
        setBookingComplete(true);
        setStep(5);
      } else {
        alert("Booking failed. Please try again or contact us on WhatsApp: +256 700 980 021");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedCategory(null);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({ name: "", phone: "", email: "", notes: "" });
    setBookingComplete(false);
    setBookingRef("");
    setAiMessage("");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP INDICATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
              step >= s
                ? "bg-gold text-cream"
                : "bg-cream-soft border border-gold/30 text-navy/50"
            }`}
          >
            {step > s ? "✓" : s}
          </div>
          {s < 4 && (
            <div
              className={`w-8 h-0.5 mx-1 transition-all ${
                step > s ? "bg-gold" : "bg-gold/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER STEPS
  // ─────────────────────────────────────────────────────────────────────────────
  
  // Step 1: Category Selection
  if (step === 1) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-[11px] font-medium tracking-[0.35em] text-gold uppercase">
            Step 1 of 4
          </p>
          <h1 className="text-2xl font-semibold tracking-[0.12em] text-navy mt-2">
            Choose Your Experience
          </h1>
          <p className="text-sm text-navy/70 mt-2">
            Select a category to explore our services
          </p>
        </div>

        <StepIndicator />

        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => {
            const categoryServices = services.filter((s) => s.category === category);
            const minPrice = Math.min(...categoryServices.map((s) => s.price));
            
            return (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setStep(2);
                }}
                className="card text-left hover:border-gold hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-navy group-hover:text-gold transition-colors">
                      {category}
                    </p>
                    <p className="text-xs text-navy/60 mt-1">
                      {categoryServices.length} services available
                    </p>
                  </div>
                  <span className="text-gold text-lg">→</span>
                </div>
                <p className="text-xs text-navy/70 mt-3">
                  Starting from UGX {formatPrice(minPrice)}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {[...new Set(categoryServices.map((s) => s.subcategory))].slice(0, 3).map((sub) => (
                    <span
                      key={sub}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Social & Contact Section */}
        <div className="mt-12 card bg-gold/5 border-dashed border-gold/40">
          <div className="text-center">
            <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">
              Connect with us
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://www.tiktok.com/@thebeautybarug0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy text-cream text-xs font-medium hover:bg-navy-soft transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                @thebeautybarug0
              </a>
              <a
                href="https://wa.me/256700980021"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-navy/20 text-navy text-xs font-medium hover:bg-cream-soft transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                +256 700 980 021
              </a>
              <a
                href="tel:+256700980021"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-navy/20 text-navy text-xs font-medium hover:bg-cream-soft transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Call Us
              </a>
            </div>
            <p className="mt-4 text-[11px] text-navy/60">
              Follow us on TikTok for the latest treatments and transformations!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Service Selection
  if (step === 2) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-[11px] font-medium tracking-[0.35em] text-gold uppercase">
            Step 2 of 4
          </p>
          <h1 className="text-2xl font-semibold tracking-[0.12em] text-navy mt-2">
            Select Your Service
          </h1>
          <p className="text-sm text-navy/70 mt-2">
            {selectedCategory} • Choose from our curated menu
          </p>
        </div>

        <StepIndicator />

        <button
          onClick={() => {
            setSelectedCategory(null);
            setStep(1);
          }}
          className="mb-6 text-xs text-navy/60 hover:text-gold transition-colors flex items-center gap-1"
        >
          ← Back to categories
        </button>

        <div className="space-y-6">
          {Object.entries(groupedServices).map(([subcategory, subServices]) => (
            <div key={subcategory}>
              <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase mb-3">
                {subcategory}
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {subServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setStep(3);
                    }}
                    className={`card text-left hover:border-gold hover:shadow-md transition-all ${
                      selectedService?.id === service.id ? "border-gold ring-1 ring-gold" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-navy">
                          {service.name}
                        </p>
                        <p className="text-xs text-navy/60 mt-1">
                          {service.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-[11px] text-navy/50">
                          <span>⏱ {service.duration} min</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold text-gold whitespace-nowrap">
                          {service.price === 0 ? "Half Price*" : `UGX ${formatPrice(service.price)}`}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 3: Date & Time Selection
  if (step === 3) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-[11px] font-medium tracking-[0.35em] text-gold uppercase">
            Step 3 of 4
          </p>
          <h1 className="text-2xl font-semibold tracking-[0.12em] text-navy mt-2">
            Choose Date & Time
          </h1>
          <p className="text-sm text-navy/70 mt-2">
            {selectedService?.name} • {selectedService?.duration} minutes
          </p>
        </div>

        <StepIndicator />

        <button
          onClick={() => setStep(2)}
          className="mb-6 text-xs text-navy/60 hover:text-gold transition-colors flex items-center gap-1"
        >
          ← Back to services
        </button>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Date Selection */}
          <div className="card">
            <p className="card-title mb-4">Select Date</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto pr-2">
              {availableDates.map((date) => {
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                const isSunday = date.getDay() === 0;
                
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => !isSunday && setSelectedDate(date)}
                    disabled={isSunday}
                    className={`p-2 rounded-xl text-center transition-all ${
                      isSelected
                        ? "bg-gold text-cream"
                        : isSunday
                        ? "bg-cream-soft/50 text-navy/30 cursor-not-allowed"
                        : "bg-cream-soft hover:bg-gold/10 text-navy"
                    }`}
                  >
                    <p className="text-[10px] font-medium">
                      {date.toLocaleDateString("en-UG", { weekday: "short" })}
                    </p>
                    <p className="text-lg font-semibold">{date.getDate()}</p>
                    <p className="text-[10px]">
                      {date.toLocaleDateString("en-UG", { month: "short" })}
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-navy/50 mt-3">
              * Sundays unavailable
            </p>
          </div>

          {/* Time Selection */}
          <div className="card">
            <p className="card-title mb-4">Select Time</p>
            {selectedDate ? (
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTime === slot.value;
                  
                  return (
                    <button
                      key={slot.value}
                      onClick={() => setSelectedTime(slot.value)}
                      className={`p-2 rounded-xl text-center transition-all ${
                        isSelected
                          ? "bg-gold text-cream"
                          : "bg-cream-soft hover:bg-gold/10 text-navy"
                      }`}
                    >
                      <p className="text-sm font-medium">{slot.label}</p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-navy/50 text-center py-8">
                Please select a date first
              </p>
            )}
          </div>
        </div>

        {/* Selected Summary */}
        {selectedDate && selectedTime && (
          <div className="mt-6 card bg-gold/5 border-gold/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gold uppercase tracking-wider">Your Selection</p>
                <p className="text-sm font-semibold text-navy mt-1">
                  {formatDate(selectedDate)} at {timeSlots.find((t) => t.value === selectedTime)?.label}
                </p>
              </div>
              <button
                onClick={() => setStep(4)}
                className="primary-button !w-auto"
              >
                Continue →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Step 4: Contact Details
  if (step === 4 && !bookingComplete) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-[11px] font-medium tracking-[0.35em] text-gold uppercase">
            Step 4 of 4
          </p>
          <h1 className="text-2xl font-semibold tracking-[0.12em] text-navy mt-2">
            Your Details
          </h1>
          <p className="text-sm text-navy/70 mt-2">
            Almost there! We&apos;ll confirm your booking shortly.
          </p>
        </div>

        <StepIndicator />

        <button
          onClick={() => setStep(3)}
          className="mb-6 text-xs text-navy/60 hover:text-gold transition-colors flex items-center gap-1"
        >
          ← Back to date & time
        </button>

        {/* Booking Summary */}
        <div className="card bg-gold/5 border-gold/30 mb-6">
          <p className="text-xs text-gold uppercase tracking-wider mb-3">Booking Summary</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-navy/70">Service</span>
              <span className="font-semibold text-navy">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/70">Category</span>
              <span className="text-navy">{selectedService?.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/70">Date & Time</span>
              <span className="text-navy">
                {selectedDate && formatDate(selectedDate)} at{" "}
                {timeSlots.find((t) => t.value === selectedTime)?.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/70">Duration</span>
              <span className="text-navy">{selectedService?.duration} minutes</span>
            </div>
            <div className="border-t border-gold/20 pt-2 mt-2 flex justify-between">
              <span className="font-semibold text-navy">Total</span>
              <span className="font-bold text-gold">
                {selectedService?.price === 0 ? "Half Price of Original Set*" : `UGX ${selectedService && formatPrice(selectedService.price)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card space-y-4">
          <div>
            <label className="field-label">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="field-input mt-1"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="field-label">Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="field-input mt-1"
              placeholder="+256 700 000 000"
              required
            />
          </div>

          <div>
            <label className="field-label">Email (Optional)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="field-input mt-1"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="field-label">Special Requests (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="field-input mt-1 min-h-[80px]"
              placeholder="Any special requests or notes..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name || !formData.phone}
            className="primary-button mt-4"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              "Confirm Booking"
            )}
          </button>

          <p className="text-[11px] text-center text-navy/50">
            By booking, you agree to our cancellation policy. Our team will confirm
            your appointment via WhatsApp or call.
          </p>
        </div>
      </div>
    );
  }

  // Step 5: Confirmation with AI Thank You Message
  if (step === 5 || bookingComplete) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <div className="card text-center space-y-6">
          {/* Success Animation */}
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center animate-pulse">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* AI Thank You Message */}
          <div className="bg-gradient-to-br from-cream to-cream-soft rounded-2xl p-6 border border-gold/20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">🎀</span>
              <p className="text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
                Booking Confirmed
              </p>
              <span className="text-2xl">🎀</span>
            </div>
            <p className="text-sm text-navy leading-relaxed whitespace-pre-line">
              {aiMessage || `Thank you for booking with The Beauty Bar UG! 💖 We're thrilled to have you and can't wait to give you the glow-up you deserve. See you soon, beautiful!`}
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-navy text-cream rounded-xl p-5 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-cream/20 pb-3">
              <span className="text-cream/70 text-sm">Reference</span>
              <span className="font-mono font-bold text-gold text-lg">{bookingRef}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cream/70">Service</span>
              <span className="font-semibold">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cream/70">Date & Time</span>
              <span>
                {selectedDate && formatDate(selectedDate)} at{" "}
                {timeSlots.find((t) => t.value === selectedTime)?.label}
              </span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-cream/20">
              <span className="text-cream/70">Total</span>
              <span className="font-bold text-gold text-lg">
                {selectedService?.price === 0 ? "Half Price*" : `UGX ${selectedService && formatPrice(selectedService.price)}`}
              </span>
            </div>
          </div>

          {/* What's Next */}
          <div className="text-left bg-cream-soft rounded-xl p-4">
            <p className="text-xs font-semibold text-navy mb-2">📱 What happens next?</p>
            <p className="text-xs text-navy/70">
              Our team will contact you via <strong>WhatsApp</strong> or phone call within 24 hours to confirm your exact appointment time.
            </p>
          </div>

          {/* Contact & Social */}
          <div className="pt-4 border-t border-gold/20">
            <p className="text-xs text-navy/60 mb-4">Questions? Reach us directly:</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="https://wa.me/256700980021"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20bd5a] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
              <a
                href="https://www.tiktok.com/@thebeautybarug0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-navy text-cream text-sm font-semibold hover:bg-navy-soft transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                @thebeautybarug0
              </a>
            </div>
          </div>

          {/* Cancel Booking Info */}
          <div className="text-xs text-navy/50 bg-cream-soft rounded-lg p-3">
            <p>⚠️ <strong>Need to cancel?</strong></p>
            <p className="mt-1">
              Contact us on WhatsApp with your booking reference: <strong className="text-gold">{bookingRef}</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-2">
            <button onClick={resetBooking} className="secondary-button sm:w-auto">
              Book Another Service
            </button>
            <Link href="/" className="primary-button sm:w-auto">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
