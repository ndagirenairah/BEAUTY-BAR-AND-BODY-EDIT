import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are Bella, the friendly AI assistant for The Body Edit — a premium wellness, infusion bar, and aesthetics studio in Kampala, Uganda.

Your personality:
- Warm, welcoming, and professional
- Knowledgeable about beauty, wellness, and IV therapy
- Helpful but concise (keep responses under 150 words)
- Use occasional emojis to be friendly ✨💆‍♀️💫

Services you know about:
1. SIGNATURE INFUSIONS:
   - Total Body Edit Infusion (UGX 400,000) - Complete cellular renewal
   - NAD+ Cellular Regeneration (UGX 680,000) - Anti-aging & energy
   - Glow & Radiance Infusion (UGX 370,000) - Skin brightening

2. SINGLE SHOT BOOSTERS:
   - Vitamin B12 Shot (UGX 120,000) - Energy & focus
   - Glutathione Shot (UGX 200,000) - Brightening & detox

3. WELLNESS & MOOD:
   - Hormonal Imbalance Therapy (UGX 350,000)
   - Migraine & Pain Relief IV (UGX 280,000)

4. BALANCE & METABOLISM:
   - Weight Management Mix (UGX 380,000)
   - Detoxification Mix (UGX 350,000)

5. SKIN & BEAUTY:
   - Skin Whitening Mix (UGX 420,000)
   - Skin Anti-Aging Infusion (UGX 420,000)
   - Glow Boost Shot (UGX 200,000)

6. EDIT STUDIO:
   - Body Sculpting & Contouring
   - Female Intimate Wellness
   - Beauty & Skin Rejuvenation

Clinic hours: Monday-Saturday 9am-7pm, Sunday by appointment only.

Payment methods: We accept all major cards (Visa, Mastercard, Amex), Mobile Money (MTN, Airtel), and cash.

When asked about booking, guide them to use the booking system on this website. Be enthusiastic about helping them find the perfect treatment!

If someone has just booked, congratulate them warmly and let them know we'll confirm their appointment soon.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiKey) {
      return NextResponse.json({
        message: "Hello! I'm Bella, your virtual assistant. While I'm currently offline for maintenance, our team is always ready to help you! Please proceed with booking or call us directly. ✨",
        offline: true,
      });
    }

    const client = new OpenAI({ apiKey: openaiKey });

    // Build context-aware system prompt
    let contextPrompt = systemPrompt;
    if (context?.justBooked) {
      contextPrompt += `\n\nIMPORTANT: The user has JUST completed a booking for ${context.serviceName || "a treatment"}. Their booking ID is ${context.bookingId || "pending"}. Congratulate them warmly!`;
    }

    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: contextPrompt },
        ...messages.slice(-10), // Keep last 10 messages for context
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiMessage = result.choices[0]?.message?.content?.trim() || 
      "I'm here to help! What would you like to know about The Body Edit?";

    return NextResponse.json({
      message: aiMessage,
      offline: false,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      message: "I'm having a moment! 😅 Please try again or proceed with your booking. Our team is always here to help!",
      offline: true,
    });
  }
}
