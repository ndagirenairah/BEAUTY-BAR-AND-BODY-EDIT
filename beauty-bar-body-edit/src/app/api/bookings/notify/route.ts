import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP NOTIFICATION API
// Sends booking notifications to the Beauty Bar owner via WhatsApp
// ─────────────────────────────────────────────────────────────────────────────

const OWNER_PHONE = "256700980021"; // Your WhatsApp number +256 700 980021

// CallMeBot API Key - Get yours FREE at https://www.callmebot.com/blog/free-api-whatsapp-messages/
// Just send "I allow callmebot to send me messages" to +34 644 51 95 23 on WhatsApp
// They'll reply with your API key
const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY || "";

// Alternative: Use WhatsApp Cloud API (Meta) - requires business account
// Or use Twilio WhatsApp API

type NotifyPayload = {
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  service: string;
  date: string;
  time: string;
  price: number;
  notes?: string;
};

// Format price with commas
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-UG").format(price);
}

// Send WhatsApp message via CallMeBot (FREE)
async function sendWhatsAppViaCallMeBot(phone: string, message: string): Promise<boolean> {
  if (!CALLMEBOT_API_KEY) {
    console.log("⚠️ CALLMEBOT_API_KEY not configured");
    return false;
  }

  try {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${CALLMEBOT_API_KEY}`;
    
    const response = await fetch(url);
    
    if (response.ok) {
      console.log(`✅ WhatsApp sent to ${phone}`);
      return true;
    } else {
      console.log("⚠️ CallMeBot failed:", await response.text());
      return false;
    }
  } catch (error) {
    console.log("⚠️ WhatsApp notification error:", error);
    return false;
  }
}

// Alternative: Send via WhatsApp Business Cloud API
async function sendWhatsAppViaCloudAPI(phone: string, message: string): Promise<boolean> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    return false;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (response.ok) {
      console.log(`✅ WhatsApp Cloud API sent to ${phone}`);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as NotifyPayload;

    const { bookingRef, customerName, customerPhone, service, date, time, price, notes } = body;

    // Create beautiful notification message
    const notificationMessage = `🎀 *NEW BOOKING* 🎀

━━━━━━━━━━━━━━━━
📋 *Ref:* ${bookingRef}
━━━━━━━━━━━━━━━━

👤 *Customer:*
   ${customerName}
   📞 ${customerPhone}

💅 *Service:*
   ${service}
   💰 UGX ${formatPrice(price)}

📅 *When:*
   ${date} at ${time}
${notes ? `\n📝 *Notes:* ${notes}` : ""}

━━━━━━━━━━━━━━━━
⏰ ${new Date().toLocaleString("en-UG", { timeZone: "Africa/Kampala" })}
━━━━━━━━━━━━━━━━

✨ Tap to call: tel:${customerPhone}`;

    // Try CallMeBot first (FREE)
    let sent = await sendWhatsAppViaCallMeBot(OWNER_PHONE, notificationMessage);

    // If CallMeBot fails, try WhatsApp Cloud API
    if (!sent) {
      sent = await sendWhatsAppViaCloudAPI(OWNER_PHONE, notificationMessage);
    }

    // Log to console regardless (always works)
    console.log("\n" + "🔔".repeat(25));
    console.log("📱 WHATSAPP NOTIFICATION:");
    console.log(notificationMessage);
    console.log("🔔".repeat(25) + "\n");

    return NextResponse.json({
      success: true,
      notificationSent: sent,
      message: sent ? "WhatsApp notification sent!" : "Notification logged (WhatsApp API not configured)",
    });

  } catch (error) {
    console.error("❌ Notification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
