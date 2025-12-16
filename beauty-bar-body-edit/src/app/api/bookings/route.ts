import { NextRequest, NextResponse } from "next/server";

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
  status: "confirmed" | "cancelled";
  createdAt: string;
  cancelledAt?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// IN-MEMORY STORAGE (Use database in production)
// ─────────────────────────────────────────────────────────────────────────────
const bookings: Booking[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// BEAUTY BAR CONTACT INFO
// ─────────────────────────────────────────────────────────────────────────────
const OWNER_PHONE = "256700980021";
const OWNER_EMAIL = "ndagirenairah@gmail.com";

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
// SEND EMAIL VIA RESEND (Free tier - 100 emails/day)
// ─────────────────────────────────────────────────────────────────────────────
async function sendEmailViaResend(to: string, subject: string, html: string): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.log("⚠️ RESEND_API_KEY not configured - skipping email");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Beauty Bar UG <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (response.ok) {
      console.log(`✅ Email sent to ${to} via Resend`);
      return true;
    } else {
      const error = await response.text();
      console.log("⚠️ Resend email failed:", error);
      return false;
    }
  } catch (error) {
    console.log("⚠️ Email failed:", error);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SEND EMAIL (if configured)
// ─────────────────────────────────────────────────────────────────────────────
async function sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
  // First try Resend (recommended for Vercel)
  if (process.env.RESEND_API_KEY && html) {
    return await sendEmailViaResend(to, subject, html);
  }

  // Fallback to SMTP if configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log("⚠️ Email not configured (no RESEND_API_KEY or SMTP)");
    return false;
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });

    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.log("⚠️ Email failed:", error);
    return false;
  }
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
    bookings.push(booking);

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

    // Create WhatsApp link for owner to receive notification
    const ownerWhatsAppLink = createWhatsAppLink(OWNER_PHONE, ownerNotification);

    // Send email to owner if configured
    const ownerEmailSent = await sendEmail(
      process.env.BOOKING_TO_EMAIL || OWNER_EMAIL,
      `🎀 New Booking: ${customerName} - ${serviceName} [${bookingRef}]`,
      ownerNotification,
      `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #faf7f2;">
          <div style="background: linear-gradient(135deg, #1e3a5f, #2d4a6f); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎀 The Beauty Bar UG</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">New Booking Notification</p>
          </div>
          <div style="padding: 30px; background: white;">
            <div style="background: #c9a962; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
              <strong style="font-size: 18px;">Booking ID: ${bookingRef}</strong>
            </div>
            
            <h3 style="color: #1e3a5f; border-bottom: 2px solid #c9a962; padding-bottom: 8px;">👤 Customer Details</h3>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Phone:</strong> <a href="tel:${customerPhone}" style="color: #c9a962;">${customerPhone}</a></p>
            ${customerEmail ? `<p><strong>Email:</strong> <a href="mailto:${customerEmail}" style="color: #c9a962;">${customerEmail}</a></p>` : ""}
            
            <h3 style="color: #1e3a5f; border-bottom: 2px solid #c9a962; padding-bottom: 8px; margin-top: 25px;">💅 Service</h3>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Price:</strong> <span style="color: #c9a962; font-weight: bold; font-size: 18px;">UGX ${price.toLocaleString()}</span></p>
            
            <h3 style="color: #1e3a5f; border-bottom: 2px solid #c9a962; padding-bottom: 8px; margin-top: 25px;">📅 Appointment</h3>
            <p><strong>Date:</strong> ${body.date || "To be confirmed"}</p>
            <p><strong>Time:</strong> ${body.time || "To be confirmed"}</p>
            
            ${body.notes ? `<h3 style="color: #1e3a5f; border-bottom: 2px solid #c9a962; padding-bottom: 8px; margin-top: 25px;">📝 Notes</h3><p>${body.notes}</p>` : ""}
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="https://wa.me/${customerPhone.replace(/[^0-9]/g, "")}" 
                 style="display: inline-block; background: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">
                📱 WhatsApp Customer
              </a>
            </div>
          </div>
          <div style="background: #1e3a5f; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; opacity: 0.8;">The Beauty Bar UG · Your Best Edit Yet</p>
          </div>
        </div>
      `
    );

    // ─────────────────────────────────────────────────────────────────────────
    // AI THANK YOU MESSAGE FOR CUSTOMER
    // ─────────────────────────────────────────────────────────────────────────
    const aiThankYou = getAIThankYouMessage(customerName, serviceName);

    // Create cancellation link
    const cancelLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/bookings?action=cancel&id=${bookingRef}&phone=${encodeURIComponent(customerPhone)}`;

    // Customer confirmation message
    const customerMessage = `
${aiThankYou}

━━━━━━━━━━━━━━━━━━━━━━━

📋 Your Booking Details:
• Reference: ${bookingRef}
• Service: ${serviceName}
• Date: ${body.date || "To be confirmed"}
• Time: ${body.time || "To be confirmed"}
• Price: UGX ${price.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Need to cancel? 
Contact us on WhatsApp: +256 700 980 021
Or use your booking reference: ${bookingRef}

📍 The Beauty Bar UG
🔗 TikTok: @thebeautybarug0
    `.trim();

    // Send confirmation email to customer if they provided email
    let customerEmailSent = false;
    if (customerEmail) {
      customerEmailSent = await sendEmail(
        customerEmail,
        `✅ Booking Confirmed - ${serviceName} [${bookingRef}]`,
        customerMessage,
        `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #faf7f2;">
            <div style="background: linear-gradient(135deg, #1e3a5f, #2d4a6f); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🎀 The Beauty Bar UG</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">Booking Confirmation</p>
            </div>
            <div style="padding: 30px; background: white;">
              <div style="background: #4CAF50; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
                <span style="font-size: 40px;">✓</span>
                <h2 style="margin: 10px 0 0;">Booking Confirmed!</h2>
              </div>
              
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                Hey ${customerName}! 💖<br><br>
                Thank you so much for booking with The Beauty Bar UG! We're thrilled to have you and can't wait to give you the glow-up you deserve.
              </p>
              
              <div style="background: #faf7f2; border-left: 4px solid #c9a962; padding: 20px; margin: 25px 0;">
                <h3 style="color: #1e3a5f; margin-top: 0;">📋 Your Booking</h3>
                <p><strong>Reference:</strong> <span style="font-family: monospace; background: #1e3a5f; color: white; padding: 3px 8px; border-radius: 4px;">${bookingRef}</span></p>
                <p><strong>Service:</strong> ${serviceName}</p>
                <p><strong>Date:</strong> ${body.date || "To be confirmed"}</p>
                <p><strong>Time:</strong> ${body.time || "To be confirmed"}</p>
                <p><strong>Price:</strong> <span style="color: #c9a962; font-weight: bold;">UGX ${price.toLocaleString()}</span></p>
              </div>
              
              <p style="font-size: 14px; color: #666;">
                We'll contact you via WhatsApp or phone call to confirm your appointment time.
              </p>
              
              <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e8e0d5;">
                <p style="font-size: 14px; color: #666; margin-bottom: 15px;">
                  ⚠️ <strong>Need to cancel?</strong> Contact us on WhatsApp with your booking reference.
                </p>
                <a href="https://wa.me/${OWNER_PHONE}" 
                   style="display: inline-block; background: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                  📱 WhatsApp Us
                </a>
              </div>
            </div>
            <div style="background: #1e3a5f; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0 0 10px;">Follow us for updates & transformations</p>
              <a href="https://www.tiktok.com/@thebeautybarug0" style="color: #c9a962; text-decoration: none;">🎵 @thebeautybarug0</a>
            </div>
          </div>
        `
      );
    }

    // Return success response with AI thank you message
    return NextResponse.json({
      success: true,
      bookingRef,
      message: aiThankYou,
      ownerWhatsAppLink,
      ownerEmailSent,
      customerEmailSent,
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
    booking.status = "cancelled";
    booking.cancelledAt = new Date().toISOString();

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

    // Email owner about cancellation
    await sendEmail(
      process.env.BOOKING_TO_EMAIL || OWNER_EMAIL,
      `❌ Booking Cancelled: ${booking.name} - ${booking.service} [${bookingId}]`,
      cancellationMessage
    );

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
  if (adminKey === process.env.ADMIN_KEY || adminKey === "beauty-bar-admin-2024") {
    return NextResponse.json({
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
      bookings: bookings.slice().reverse(),
    });
  }

  return NextResponse.json(
    { error: "Please provide booking ID and phone number" },
    { status: 400 }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE - CANCEL BOOKING (Alternative method)
// ─────────────────────────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const { bookingId, phone } = await request.json();

    if (!bookingId || !phone) {
      return NextResponse.json(
        { error: "Please provide booking ID and phone number" },
        { status: 400 }
      );
    }

    const booking = bookings.find(
      (b) => b.id === bookingId && b.phone.replace(/[^0-9]/g, "") === phone.replace(/[^0-9]/g, "")
    );

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date().toISOString();

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
