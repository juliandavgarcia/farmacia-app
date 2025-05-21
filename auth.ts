import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { prisma } from "./lib/db";
import { obtenerUsuarioPorId } from "./logica/acciones/acciones-usuario";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async signIn({ user }) {
      if (!user.id) return false;
      const usuarioExistente = await obtenerUsuarioPorId(user.id);

      if (!usuarioExistente) {
        return false;
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.rol = token.role;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const usuarioExistente = await obtenerUsuarioPorId(token.sub);

      if (!usuarioExistente) return token;

      token.role = usuarioExistente.rol;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});

// Exporta handlers directamente
export const handlers = { GET, POST };
