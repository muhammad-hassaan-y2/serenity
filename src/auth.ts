import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { sendVerificationCode } from "@/utils/email";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user && user.password === credentials?.password) {
          return user;
        }

        if (!user) {
          const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

          await prisma.verificationCode.create({
            data: {
              email: credentials?.email,
              code: verificationCode,
              expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
          });

          await sendVerificationCode(credentials?.email, verificationCode);
          throw new Error("Verification code sent. Please check your email.");
        }

        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET!,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
