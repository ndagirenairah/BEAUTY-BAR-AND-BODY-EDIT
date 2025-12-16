import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend the Session type
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Store verification codes temporarily (in production use Redis/database)
const verificationCodes = new Map<string, { code: string; expires: Date; email: string }>();

const handler = NextAuth({
  providers: [
    // Google OAuth Provider - Easy one-click login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // Email verification with code
    CredentialsProvider({
      id: "email-code",
      name: "Email Code",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) {
          return null;
        }

        const stored = verificationCodes.get(credentials.email);
        if (!stored) {
          return null;
        }

        if (stored.code !== credentials.code) {
          return null;
        }

        if (new Date() > stored.expires) {
          verificationCodes.delete(credentials.email);
          return null;
        }

        // Code is valid - delete it and return user
        verificationCodes.delete(credentials.email);
        
        return {
          id: credentials.email,
          email: credentials.email,
          name: credentials.email.split("@")[0],
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };

// Export verification codes map for use in send-code API
export { verificationCodes };
