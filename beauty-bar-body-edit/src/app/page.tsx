import Link from "next/link";
import Image from "next/image";

const infusionHighlights = [
  {
    title: "Infusion Bar",
    subtitle: "Signature drips crafted for renewal, glow, and balance.",
    items: ["Total Body Edit", "NAD+ Cellular Regeneration", "Glow & Radiance"],
  },
  {
    title: "Balance & Metabolism",
    subtitle: "Support fat burn, detoxification, and recovery.",
    items: ["Weight Management Mix", "Detoxification", "Hangover & Recovery"],
  },
  {
    title: "Skin & Beauty",
    subtitle: "Brightening, firming, and anti‑aging from within.",
    items: ["Skin Whitening Mix", "Skin Anti‑Aging Infusion", "Glow Boost Shot"],
  },
];

const studioHighlights = [
  "Body Sculpting & Contouring",
  "Female Intimate Wellness",
  "Beauty & Skin Rejuvenation",
];

// Lash Sets from TBB - All 7 styles as shown in price list
const lashSets = [
  { 
    name: "Classic", 
    description: "Natural, elegant - 1:1 ratio", 
    icon: "✨",
    price: "100k",
    refill: "50k",
    thickness: "0.15-0.20",
    detail: "Very natural, most popular"
  },
  { 
    name: "Hybrid", 
    description: "Mix of Classic & Volume", 
    icon: "💫",
    price: "100k",
    refill: "50k",
    thickness: "0.05-0.07 & 0.15-0.20",
    detail: "Mixture of Classic and Volume"
  },
  { 
    name: "Volume", 
    description: "Full, fluffy lashes", 
    icon: "🌟",
    price: "130k",
    refill: "65k",
    thickness: "0.05-0.07",
    detail: "5-10 lashes on each fan"
  },
  { 
    name: "Mega Volume", 
    description: "Maximum dramatic impact", 
    icon: "👑",
    price: "150k",
    refill: "75k",
    thickness: "0.03",
    detail: "10-15 lashes per fan, ultra full"
  },
  { 
    name: "Wet Set", 
    description: "Trendy spiky look", 
    icon: "💧",
    price: "120k",
    refill: "60k",
    thickness: "0.05-0.07",
    detail: "Bold, edgy wet/spiky style"
  },
  { 
    name: "Anime Sets", 
    description: "Dramatic anime-inspired", 
    icon: "🎀",
    price: "120k",
    refill: "60k",
    thickness: "0.05-0.07",
    detail: "Bold anime-style lash look"
  },
  { 
    name: "Wispy", 
    description: "Soft, textured wispy look", 
    icon: "🦋",
    price: "100k-150k",
    refill: "50k-75k",
    thickness: "Mixed",
    detail: "Hybrid, Volume or Mega options"
  },
];

// Lash removal service
const lashRemoval = { name: "Lash Removal", price: "20k", icon: "🗑️" };

// Lash Products
const lashProducts = [
  { name: "Gel Pads", price: "20k", qty: "50 pairs" },
  { name: "Lash Tape", price: "3k", qty: "per roll" },
  { name: "Glue Rings", price: "15k", qty: "100 pack" },
  { name: "Lash Mirror", price: "7k", qty: "each" },
  { name: "Spoolies", price: "10k", qty: "pack" },
  { name: "Glue Wipes", price: "7k", qty: "pack" },
  { name: "Micro Swabs", price: "10k", qty: "pack" },
  { name: "Cleaning Bottle", price: "5k", qty: "each" },
  { name: "Cleaning Brush", price: "5k", qty: "each" },
  { name: "Bottom Lashes", price: "20k", qty: "set" },
  { name: "Lashes", price: "20k", qty: "tray" },
  { name: "Pre Mades", price: "20k", qty: "tray" },
];

// Treatment Zones for Cool Sculpting with images
const treatmentZones = [
  { name: "Double Chin", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=200&fit=crop" },
  { name: "Armpit Fat", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop" },
  { name: "Upper Arm", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=200&fit=crop" },
  { name: "Upper Abdomen", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop" },
  { name: "Love Handles", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop" },
  { name: "Lower Abdomen", image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=300&h=200&fit=crop" },
  { name: "Outer Thighs", image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=200&fit=crop" },
  { name: "Inner Thighs", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=200&fit=crop" },
  { name: "Knee Fat", image: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=300&h=200&fit=crop" },
  { name: "Upper Back", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop" },
  { name: "Lower Back", image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=300&h=200&fit=crop" },
  { name: "Banana Roll", image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=200&fit=crop" },
  { name: "Inner Knee", image: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=300&h=200&fit=crop" },
];

// Body Edit Services with images
const bodyEditServices = [
  {
    name: "Cool Sculpting",
    description: "Non-invasive fat freezing technology",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&h=350&fit=crop",
    price: "From UGX 300,000"
  },
  {
    name: "Body Contouring",
    description: "Sculpt and tone your ideal shape",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=500&h=350&fit=crop",
    price: "From UGX 250,000"
  },
  {
    name: "Skin Tightening",
    description: "Firm and rejuvenate your skin",
    image: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=500&h=350&fit=crop",
    price: "From UGX 200,000"
  },
  {
    name: "Cellulite Treatment",
    description: "Smooth and refine skin texture",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&h=350&fit=crop",
    price: "From UGX 180,000"
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-112px)] max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="grid gap-10 lg:grid-cols-[3fr,2fr] lg:items-center">
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-[11px] font-medium tracking-[0.35em] text-gold uppercase">
              The Body Edit Infusion Bar
            </p>
            <h1 className="text-3xl font-semibold tracking-[0.12em] text-navy sm:text-4xl lg:text-[2.6rem]">
              Sculpt, renew & glow with{" "}
              <span className="text-gold">precision care.</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-navy/80">
              Book targeted IV infusions and sculpting treatments designed to
              hydrate, energise, and refine — so you can step into{" "}
              <span className="font-semibold text-navy">
                your best edit yet.
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/book" className="primary-button sm:w-auto">
              Book your session
            </Link>
            <a
              href="#services"
              className="secondary-button sm:w-auto"
            >
              Explore services
            </a>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] text-navy/70">
            <span className="pill">Infusion Bar</span>
            <span className="pill">Edit Studio</span>
            <span className="pill">Wellness & Mood</span>
            <span className="pill">Skin & Beauty</span>
          </div>
        </div>

        <div className="card space-y-4">
          <p className="card-title">Today&apos;s popular edits</p>
          <ul className="space-y-3 text-sm text-navy/90">
            <li className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">Glow & Radiance Infusion</p>
                <p className="text-xs text-navy/70">
                  Brightening, even tone, luminous skin.
                </p>
              </div>
              <span className="rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold text-gold">
                UGX 370,000
              </span>
            </li>
            <li className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">NAD+ Cellular Regeneration</p>
                <p className="text-xs text-navy/70">
                  Energy, longevity, and mental clarity.
                </p>
              </div>
              <span className="rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold text-gold">
                UGX 680,000
              </span>
            </li>
            <li className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">Body Sculpting & Contouring</p>
                <p className="text-xs text-navy/70">
                  Non‑surgical tightening and fat reduction.
                </p>
              </div>
              <span className="rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold text-gold">
                Edit Studio
              </span>
            </li>
          </ul>
          <p className="text-[11px] text-navy/65">
            Select your preferred edit, then choose your time — our team will
            confirm your booking by call or WhatsApp.
          </p>
        </div>
      </section>

      <section id="services" className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.3em] text-gold uppercase">
              Our edit menu
            </p>
            <h2 className="text-lg font-semibold tracking-[0.18em] text-navy uppercase">
              Infusion Bar Highlights
            </h2>
          </div>
          <p className="max-w-sm text-xs text-navy/75">
            A curated selection of IV infusions to support cellular renewal,
            mood, metabolism, and skin luminosity.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {infusionHighlights.map((group) => (
            <div key={group.title} className="card space-y-3">
              <p className="text-sm font-semibold text-navy">{group.title}</p>
              <p className="text-xs text-navy/75">{group.subtitle}</p>
              <ul className="space-y-1 text-xs text-navy/85">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-[3px] w-4 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium tracking-[0.3em] text-gold uppercase">
              Edit Studio
            </p>
            <p className="text-sm font-semibold text-navy">
              Sculpt | Tighten | Glow
            </p>
            <p className="max-w-md text-xs text-navy/75">
              From body sculpting to intimate wellness and advanced skin
              treatments, our Edit Studio is crafted for confident, precise
              transformation.
            </p>
          </div>
          <ul className="space-y-1 text-xs text-navy/85">
            {studioHighlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-[3px] w-4 rounded-full bg-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-2 rounded-2xl border border-dashed border-gold/50 bg-gold/5 px-4 py-5 text-center sm:px-6">
        <p className="text-xs font-medium uppercase tracking-[0.26em] text-gold">
          Ready for your best edit yet?
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Choose your service and preferred time — it takes less than a minute.
        </p>
        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/book" className="primary-button sm:w-auto sm:min-w-[220px]">
            Start booking
          </Link>
        </div>
      </section>

      {/* Cool Sculpting Treatment Zones */}
      <section className="space-y-4" id="gallery-body">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.3em] text-gold uppercase">
              Cool Sculpting
            </p>
            <h2 className="text-lg font-semibold tracking-[0.18em] text-navy uppercase">
              Treatment Zones
            </h2>
          </div>
          <p className="max-w-sm text-xs text-navy/75">
            Target stubborn fat areas with our advanced cryolipolysis technology.
          </p>
        </div>
        
        {/* Treatment Zones Grid with Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {treatmentZones.map((zone) => (
            <div 
              key={zone.name}
              className="card p-0 overflow-hidden group hover:border-gold hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="relative h-28 w-full overflow-hidden">
                <Image
                  src={zone.image}
                  alt={zone.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
              </div>
              <div className="p-2 text-center">
                <p className="text-xs font-medium text-navy">{zone.name}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Body Edit Services */}
        <div className="mt-8">
          <p className="text-[11px] font-medium tracking-[0.3em] text-gold uppercase mb-4">
            Body Edit Services
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bodyEditServices.map((service) => (
              <div 
                key={service.name}
                className="card p-0 overflow-hidden group hover:border-gold hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-sm font-bold">{service.name}</p>
                    <p className="text-[10px] opacity-90">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-cream to-cream-soft text-center py-4">
          <p className="text-[11px] text-navy/60">
            ✨ Non-invasive fat freezing & body contouring for visible results
          </p>
        </div>
      </section>

      {/* Lash Lounge Section */}
      <section className="space-y-6" id="gallery-lashes">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.3em] text-gold uppercase">
              TBB Lash Lounge
            </p>
            <h2 className="text-lg font-semibold tracking-[0.18em] text-navy uppercase">
              Lash Sets & Products
            </h2>
          </div>
          <a
            href="https://www.tiktok.com/@thebeautybarug0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-navy/70 hover:text-gold transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            @thebeautybarug0
          </a>
        </div>

        {/* TBB Lash Menu - YOUR Image */}
        <div className="space-y-6">
          <p className="text-xs font-medium tracking-[0.2em] text-gold uppercase">Our Lash Styles</p>
          
          {/* Your Lash Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/lashes/lash-styles.jpg"
              alt="Classic, Hybrid, Volume, Mega Lashes by The Beauty Bar UG"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

        {/* Quick Book Buttons */}
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-gold uppercase mb-3">Book Your Lash Style</p>
          <p className="text-[10px] text-navy/60 mb-4">💡 Refills @ half price (strictly after 2-3 weeks) • After that it&apos;s a new set</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {lashSets.map((lash) => (
              <Link 
                href={`/book?service=lashes&style=${encodeURIComponent(lash.name)}`}
                key={lash.name}
                className="card text-center hover:border-gold hover:shadow-xl transition-all group cursor-pointer p-3"
              >
                <div className="text-2xl mb-1">{lash.icon}</div>
                <p className="text-sm font-bold text-navy group-hover:text-gold transition-colors">
                  {lash.name}
                </p>
                <p className="text-lg font-bold text-gold mt-1">{lash.price}</p>
                <p className="text-[9px] text-navy/60 mt-1 line-clamp-1">{lash.description}</p>
                <p className="text-[9px] text-navy/50 mt-1">Refill: {lash.refill}</p>
                <button className="mt-2 w-full bg-navy text-white text-[10px] py-1.5 rounded-lg group-hover:bg-gold transition-colors font-semibold">
                  Book Now
                </button>
              </Link>
            ))}
          </div>
          
          {/* Lash Removal */}
          <div className="mt-4 flex justify-center">
            <Link 
              href="/book?service=lashes&style=Removal"
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy/10 hover:bg-gold/20 rounded-full transition-colors"
            >
              <span>🗑️</span>
              <span className="text-sm font-medium text-navy">Lash Removal</span>
              <span className="text-sm font-bold text-gold">20k</span>
            </Link>
          </div>
        </div>

        {/* Lash Products Grid */}
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-gold uppercase mb-3">Lash Products</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {lashProducts.map((product) => (
              <div 
                key={product.name}
                className="card hover:border-gold transition-all"
              >
                <p className="text-sm font-semibold text-navy">{product.name}</p>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xs text-gold font-bold">{product.price}</span>
                  <span className="text-[10px] text-navy/50">{product.qty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact for Orders */}
        <div className="card bg-gold/5 border-dashed border-gold/40 text-center">
          <p className="text-xs font-medium text-gold uppercase tracking-wider mb-2">
            Order Products or Book Lashes
          </p>
          <a
            href="https://wa.me/256700980021"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy text-cream text-xs font-medium hover:bg-navy-soft transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            +256 700 980 021
          </a>
        </div>
      </section>

      <section
        id="map"
        className="rounded-2xl border border-gold/40 bg-cream-soft px-4 py-5 sm:px-6"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.3em] text-gold uppercase">
              Find us
            </p>
            <h2 className="text-sm font-semibold text-navy">
              The Beauty Bar UG · Kampala
            </h2>
            <p className="text-xs text-navy/70">
              📍 Click to get GPS directions from your current location
            </p>
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=0.3136,32.5811&destination_place_id=ChIJLcXp5VK7fRcRos3Tw3P63eo&travelmode=driving"
            target="_blank"
            rel="noreferrer"
            className="primary-button sm:w-auto flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Get Directions
          </a>
        </div>
        
        {/* Quick Direction Buttons */}
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=The+Beauty+Bar+Kampala+Uganda&travelmode=driving"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs bg-navy/10 hover:bg-gold/20 px-3 py-1.5 rounded-full transition-colors"
          >
            🚗 Drive
          </a>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=The+Beauty+Bar+Kampala+Uganda&travelmode=walking"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs bg-navy/10 hover:bg-gold/20 px-3 py-1.5 rounded-full transition-colors"
          >
            🚶 Walk
          </a>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=The+Beauty+Bar+Kampala+Uganda&travelmode=transit"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs bg-navy/10 hover:bg-gold/20 px-3 py-1.5 rounded-full transition-colors"
          >
            🚌 Transit
          </a>
        </div>
        
        <div className="mt-4 overflow-hidden rounded-xl border border-gold/30 bg-white shadow-sm">
          <iframe
            title="The Beauty Bar UG Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63712.36308322283!2d32.5272311!3d0.3475964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb5265e9c58f%3A0xeadcfa73c7d3f1a2!2sKampala!5e0!3m2!1sen!2sug!4v1700000000000!5m2!1sen!2sug"
            width="100%"
            height="360"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        
        {/* Address Card */}
        <div className="mt-4 p-3 bg-gold/10 rounded-xl">
          <p className="text-sm font-semibold text-navy">📍 The Beauty Bar UG</p>
          <p className="text-xs text-navy/70 mt-1">Kampala, Uganda</p>
          <p className="text-xs text-navy/60 mt-2">
            When you click &quot;Get Directions&quot;, Google Maps will use your GPS to show the route from your current location to us!
          </p>
        </div>
      </section>
    </div>
  );
}
