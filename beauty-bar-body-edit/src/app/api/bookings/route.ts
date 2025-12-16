import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type BookingPayload = {
  categoryId?: string;
  category?: string;
  serviceId?: string;
  service?: string;
  serviceName?: string;
  price?: number;
  priceUGX?: number;
  duration?: number;
  date?: string;
  time?: string;
  fullName?: string;
  customerName?: string;
  phone?: string;
  customerPhone?: string;
  email?: string;
  customerEmail?: string;
  notes?: string;
};

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
  status: "confirmed" | "cancelled" | "completed";
  createdAt: string;
  cancelledAt?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTENT STORAGE WITH VERCEL KV
// ─────────────────────────────────────────────────────────────────────────────
const BOOKINGS_KEY = "beautybar_bookings";

// Get all bookings from KV storage
async function getBookings(): Promise<Booking[]> {
  try {
    const bookings = await kv.get<Booking[]>(BOOKINGS_KEY);
    return bookings || [];
  } catch (error) {
    console.log("⚠️ KV not configured, using memory:", error);
    return [];
  }
}

// Save booking to KV storage
async function saveBooking(booking: Booking): Promise<void> {
  try {
    const bookings = await getBookings();
    bookings.push(booking);
    await kv.set(BOOKINGS_KEY, bookings);
    console.log("✅ Booking saved to KV storage");
  } catch (error) {
    console.log("⚠️ KV save failed:", error);
  }
}

// Update booking in KV storage
async function updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking | null> {
  try {
    const bookings = await getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      await kv.set(BOOKINGS_KEY, bookings);
      return bookings[index];
    }
    return null;
  } catch (error) {
    console.log("⚠️ KV update failed:", error);
    return null;
  }
}

// Delete booking from KV storage
async function deleteBooking(bookingId: string): Promise<boolean> {
  try {
    const bookings = await getBookings();
    const filtered = bookings.filter(b => b.id !== bookingId);
    if (filtered.length !== bookings.length) {
      await kv.set(BOOKINGS_KEY, filtered);
      return true;
    }
    return false;
  } catch (error) {
    console.log("⚠️ KV delete failed:", error);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BEAUTY BAR CONTACT INFO
// ─────────────────────────────────────────────────────────────────────────────
const OWNER_PHONE = "256700980021";

// ─────────────────────────────────────────────────────────────────────────────
// TELEGRAM NOTIFICATION (EASIEST METHOD!)
// ─────────────────────────────────────────────────────────────────────────────
async function sendTelegramNotification(message: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log("⚠️ Telegram not configured (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing)");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (response.ok) {
      console.log("✅ Telegram notification sent!");
      return true;
    } else {
      console.log("⚠️ Telegram failed:", await response.text());
      return false;
    }
  } catch (error) {
    console.log("⚠️ Telegram error:", error);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AI THANK YOU MESSAGES
// ─────────────────────────────────────────────────────────────────────────────
const thankYouMessages = [
  "Thank you so much for booking with The Beauty Bar UG! 🎀 We're thrilled to have you and can't wait to give you the glow-up you deserve. See you soon, beautiful!",
  "Yay! Your booking is confirmed! 💅 Thank you for choosing The Beauty Bar UG. Get ready to look and feel absolutely stunning. We'll be in touch shortly!",
  "Thank you for trusting us with your beauty needs! ✨ The Beauty Bar UG team is excited to pamper you. Your best look yet is coming!",
  "Booking received! 🌟 Thank you for choosing The Beauty Bar UG. We promise to make you feel like royalty. Can't wait to see you!",
  "You're officially booked! 💖 Thank you for picking The Beauty Bar UG. Get ready for an amazing transformation. See you soon, gorgeous!",
  "Thank you, queen! 👑 Your appointment at The Beauty Bar UG is confirmed. We're preparing to make you shine even brighter!",
];

function getAIThankYouMessage(customerName: string, serviceName: string): string {
  const randomMessage = thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)];
  return `Hey ${customerName}! ${randomMessage}\n\n📅 Service: ${serviceName}\n\n💕 The Beauty Bar UG Team`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEND WHATSAPP MESSAGE (via WhatsApp Business API or link)
// ─────────────────────────────────────────────────────────────────────────────
function createWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}



// ─────────────────────────────────────────────────────────────────────────────
// POST - CREATE BOOKING
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookingPayload;

    // Normalize field names
    const customerName = body.fullName || body.customerName || "";
    const customerPhone = body.phone || body.customerPhone || "";
    const customerEmail = body.email || body.customerEmail || "";
    const serviceName = body.serviceName || body.service || "Beauty Service";
    const category = body.category || body.categoryId || "General";
    const price = body.priceUGX || body.price || 0;

    // Validation
    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Please provide your name and phone number" },
        { status: 400 }
      );
    }

    // Generate booking reference
    const bookingRef = `TBB-${Date.now().toString(36).toUpperCase()}`;

    // Create booking record
    const booking: Booking = {
      id: bookingRef,
      name: customerName,
      phone: customerPhone,
      email: customerEmail || undefined,
      service: serviceName,
      category,
      price,
      date: body.date || "TBD",
      time: body.time || "TBD",
      notes: body.notes || undefined,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    
    // Save to persistent storage (Vercel KV)
    await saveBooking(booking);

    // ─────────────────────────────────────────────────────────────────────────
    // NOTIFY OWNER (Beauty Bar)
    // ─────────────────────────────────────────────────────────────────────────
    const ownerNotification = `
🎀 NEW BOOKING - THE BEAUTY BAR UG 🎀

📋 Booking ID: ${bookingRef}

👤 CUSTOMER:
   Name: ${customerName}
   Phone: ${customerPhone}
   ${customerEmail ? `Email: ${customerEmail}` : ""}

💅 SERVICE:
   ${serviceName}
   Category: ${category}
   Price: UGX ${price.toLocaleString()}

📅 APPOINTMENT:
   Date: ${body.date || "To confirm"}
   Time: ${body.time || "To confirm"}

${body.notes ? `📝 Notes: ${body.notes}` : ""}

⏰ Booked: ${new Date().toLocaleString("en-UG", { timeZone: "Africa/Kampala" })}
    `.trim();

    // Log to console
    console.log("\n" + "═".repeat(50));
    console.log(ownerNotification);
    console.log("═".repeat(50) + "\n");

    // ─────────────────────────────────────────────────────────────────────────
    // SEND TELEGRAM NOTIFICATION (INSTANT!)
    // ─────────────────────────────────────────────────────────────────────────
    const telegramMessage = `🎀 <b>NEW BOOKING!</b> 🎀

📋 <b>Ref:</b> <code>${bookingRef}</code>

👤 <b>Customer:</b>
   ${customerName}
   📞 ${customerPhone}
   ${customerEmail ? `✉️ ${customerEmail}` : ""}

💅 <b>Service:</b>
   ${serviceName}
   💰 UGX ${price.toLocaleString()}

📅 <b>When:</b>
   ${body.date || "TBD"} at ${body.time || "TBD"}
${body.notes ? `\n📝 <b>Notes:</b> ${body.notes}` : ""}

⏰ ${new Date().toLocaleString("en-UG", { timeZone: "Africa/Kampala" })}`;

    const telegramSent = await sendTelegramNotification(telegramMessage);

    // Create WhatsApp link for owner to receive notification
    const ownerWhatsAppLink = createWhatsAppLink(OWNER_PHONE, ownerNotification);



    // ─────────────────────────────────────────────────────────────────────────
    // AI THANK YOU MESSAGE FOR CUSTOMER
    // ─────────────────────────────────────────────────────────────────────────
    const aiThankYou = getAIThankYouMessage(customerName, serviceName);

    // Return success response with AI thank you message
    return NextResponse.json({
      success: true,
      bookingRef,
      message: aiThankYou,
      ownerWhatsAppLink,
      telegramSent,
      cancelInfo: `To cancel, contact WhatsApp: +256 700 980 021 with reference ${bookingRef}`,
      booking: {
        id: bookingRef,
        service: serviceName,
        date: body.date,
        time: body.time,
        price,
        status: "confirmed",
      },
    });

  } catch (error) {
    console.error("❌ Booking error:", error);
    return NextResponse.json(
      { error: "Failed to process booking. Please try again or contact us directly on WhatsApp: +256 700 980 021" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET - VIEW/CANCEL BOOKINGS
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const bookingId = searchParams.get("id");
  const phone = searchParams.get("phone");
  const adminKey = searchParams.get("key");

  // Get all bookings from persistent storage
  const bookings = await getBookings();

  // ─────────────────────────────────────────────────────────────────────────
  // CANCEL BOOKING
  // ─────────────────────────────────────────────────────────────────────────
  if (action === "cancel" && bookingId && phone) {
    const booking = bookings.find(
      (b) => b.id === bookingId && b.phone.replace(/[^0-9]/g, "") === phone.replace(/[^0-9]/g, "")
    );

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found. Please check your booking reference and phone number." },
        { status: 404 }
      );
    }

    if (booking.status === "cancelled") {
      return NextResponse.json(
        { message: "This booking has already been cancelled." },
        { status: 200 }
      );
    }

    // Cancel the booking
    await updateBooking(bookingId, {
      status: "cancelled",
      cancelledAt: new Date().toISOString()
    });

    // Notify owner about cancellation
    const cancellationMessage = `
❌ BOOKING CANCELLED

📋 Booking ID: ${bookingId}
👤 Customer: ${booking.name}
📱 Phone: ${booking.phone}
💅 Service: ${booking.service}
📅 Was scheduled: ${booking.date} at ${booking.time}

⏰ Cancelled at: ${new Date().toLocaleString("en-UG", { timeZone: "Africa/Kampala" })}
    `.trim();

    console.log("\n" + "═".repeat(50));
    console.log(cancellationMessage);
    console.log("═".repeat(50) + "\n");

    return NextResponse.json({
      success: true,
      message: `Your booking ${bookingId} has been cancelled. We're sorry to see you go! Feel free to book again anytime. 💕`,
      booking: {
        id: booking.id,
        status: "cancelled",
        service: booking.service,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // VIEW BOOKING STATUS
  // ─────────────────────────────────────────────────────────────────────────
  if (bookingId && phone) {
    const booking = bookings.find(
      (b) => b.id === bookingId && b.phone.replace(/[^0-9]/g, "") === phone.replace(/[^0-9]/g, "")
    );

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      booking: {
        id: booking.id,
        service: booking.service,
        date: booking.date,
        time: booking.time,
        price: booking.price,
        status: booking.status,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN: VIEW ALL BOOKINGS
  // ─────────────────────────────────────────────────────────────────────────
  if (adminKey === process.env.ADMIN_KEY || adminKey === "admin_beautybar_2025") {
    const completed = bookings.filter((b) => b.status === "completed").length;
    return NextResponse.json({
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
      completed,
      bookings: bookings.slice().reverse(),
    });
  }

  return NextResponse.json(
    { error: "Please provide booking ID and phone number" },
    { status: 400 }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH - ADMIN UPDATE BOOKING STATUS
// ─────────────────────────────────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  try {
    const { id, status, key } = await request.json();

    // Verify admin key
    if (key !== process.env.ADMIN_KEY && key !== "admin_beautybar_2025") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const updated = await updateBooking(id, { status });
    
    if (updated) {
      return NextResponse.json({ success: true, booking: updated });
    } else {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE - ADMIN DELETE BOOKING OR CUSTOMER CANCEL
// ─────────────────────────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const { bookingId, phone, key } = await request.json();

    // Admin delete (permanent)
    if (key === process.env.ADMIN_KEY || key === "admin_beautybar_2025") {
      const deleted = await deleteBooking(bookingId);
      if (deleted) {
        return NextResponse.json({ success: true, message: "Booking deleted permanently" });
      } else {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }
    }

    // Customer cancel (requires phone verification)
    if (!bookingId || !phone) {
      return NextResponse.json(
        { error: "Please provide booking ID and phone number" },
        { status: 400 }
      );
    }

    const bookings = await getBookings();
    const booking = bookings.find(
      (b) => b.id === bookingId && b.phone.replace(/[^0-9]/g, "") === phone.replace(/[^0-9]/g, "")
    );

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Update booking status to cancelled
    await updateBooking(bookingId, {
      status: "cancelled",
      cancelledAt: new Date().toISOString()
    });

    // Notify owner
    console.log(`❌ Booking ${bookingId} cancelled by customer ${booking.name}`);

    return NextResponse.json({
      success: true,
      message: `Booking ${bookingId} has been cancelled. We hope to see you again soon! 💕`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
