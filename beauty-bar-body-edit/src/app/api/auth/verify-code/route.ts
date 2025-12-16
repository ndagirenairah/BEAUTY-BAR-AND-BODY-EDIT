import { NextRequest, NextResponse } from "next/server";

// Import the verification codes from send-code route
// In production, use a shared database/Redis
const verificationCodes = new Map<string, { code: string; expires: Date; email: string }>();

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    const stored = verificationCodes.get(email);
    
    if (!stored) {
      return NextResponse.json(
        { error: "No verification code found. Please request a new code." },
        { status: 400 }
      );
    }

    if (new Date() > stored.expires) {
      verificationCodes.delete(email);
      return NextResponse.json(
        { error: "Code expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (stored.code !== code) {
      return NextResponse.json(
        { error: "Invalid code. Please try again." },
        { status: 400 }
      );
    }

    // Code is valid - delete it
    verificationCodes.delete(email);

    return NextResponse.json({ 
      success: true, 
      verified: true,
      email: email
    });

  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}

// Export for sharing
export { verificationCodes };
