import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Store verification codes temporarily
const verificationCodes = new Map<string, { code: string; expires: Date; email: string }>();

// Generate a 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Generate verification code
    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store the code
    verificationCodes.set(email, { code, expires, email });

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send verification email
    await transporter.sendMail({
      from: `"The Beauty Bar UG" <${process.env.SMTP_USER || "noreply@beautybar.ug"}>`,
      to: email,
      subject: "🔐 Your Beauty Bar Verification Code",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1a365d; margin: 0;">The Beauty Bar UG</h1>
            <p style="color: #b8860b; margin: 5px 0;">Body Edit & Infusion Bar</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #fdf5e6 0%, #fff8dc 100%); padding: 30px; border-radius: 15px; text-align: center;">
            <p style="color: #1a365d; font-size: 16px; margin-bottom: 20px;">
              Your verification code is:
            </p>
            <div style="background: #1a365d; color: #b8860b; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 30px; border-radius: 10px; display: inline-block;">
              ${code}
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              This code expires in <strong>10 minutes</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #b8860b; font-size: 11px;">
              💅 The Beauty Bar UG • TikTok: @thebeautybarug0
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Verification code sent to your email" 
    });

  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code. Please try again." },
      { status: 500 }
    );
  }
}

// Export for verification
export { verificationCodes };
