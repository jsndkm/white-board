import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import type { DefaultJWT } from "next-auth/jwt";
import { LoginEndpoint } from "@/lib/api/endpoint";


declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    username?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize(credentials) {
        const { username, password } = credentials as { username: string; password: string };

        const res = await fetch(LoginEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        if (!res.ok) return null;

        const json= await res.json();
        const user = json.data;
        return { id: user.id, username: user.username };
      }
    })

  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.username = user.username as string;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username as string;
      }

      return session;
    }
  }
});