import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, User as NextAuthUser } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          // Use the BACKEND URL configured in env
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
          const res = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const response = await res.json();

          if (!res.ok || !response.success) {
            throw new Error(response?.message || "Invalid credentials");
          }

          const { accessToken, user } = response?.data || {};

          if (!user?._id || !accessToken) {
            throw new Error("Invalid server response");
          }

          // Ensure only admin role can log in
          if (user.role !== "admin") {
            throw new Error("Access denied. Admin role required.");
          }

          // Return the user object that matches the extended User type
          return {
            id: user._id,
            fullName: user.fullName || "",
            email: user.email,
            role: user.role,
            status: user.status,
            accessToken: accessToken,
          } as NextAuthUser;
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Login failed");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fullName = user.fullName;
        token.email = user.email;
        token.role = user.role;
        token.status = user.status;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        fullName: token.fullName as string,
        email: token.email as string,
        role: token.role as string,
        status: token.status as string,
        accessToken: token.accessToken as string,
      };
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
