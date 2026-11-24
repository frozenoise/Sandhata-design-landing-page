import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Azure AD / Entra ID SSO. Register the app as the "Web" platform with
    // redirect URI <origin>/api/auth/callback/microsoft-entra-id.
    // Sole provider per the 6 Nov ARB decision: internal launch is SSO-only,
    // Google/GitHub sign-in is removed now that this is integrated.
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      // Single-tenant: only accounts from this directory can sign in.
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
    }),
  ],
  session: { strategy: "database" },
  pages: {
    signIn: "/builder",   // redirect back to builder after sign-in
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
});
