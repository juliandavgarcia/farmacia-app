import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { prisma } from "./lib/db";
import { obtenerUsuarioPorId } from "./logica/acciones/acciones-usuario";

/**
 * Configuración de NextAuth con autenticación basada en JWT y adaptador Prisma.
 * Se definen los callbacks para controlar el flujo de autenticación, sesión y token.
 */
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // Callbacks personalizados para el ciclo de autenticación
  callbacks: {
    /**
     * Callback que se ejecuta al iniciar sesión.
     * Verifica si el usuario existe en la base de datos antes de permitir el acceso.
     */
    async signIn({ user }) {
      if (!user.id) return false;

      const usuarioExistente = await obtenerUsuarioPorId(user.id);

      if (!usuarioExistente) {
        return false; // Bloquea el acceso si no existe el usuario
      }

      return true; // Permite el acceso
    },

    /**
     * Callback que modifica la sesión antes de devolverla al cliente.
     * Agrega el ID del usuario y el rol a `session.user`.
     */
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.rol = token.role;
      }

      return session;
    },

    /**
     * Callback que se ejecuta cada vez que se genera o actualiza el JWT.
     * Se usa para agregar información personalizada al token, como el rol.
     */
    async jwt({ token }) {
      if (!token.sub) return token;

      const usuarioExistente = await obtenerUsuarioPorId(token.sub);

      if (!usuarioExistente) return token;

      // Agrega el rol del usuario al token
      token.role = usuarioExistente.rol;

      return token;
    },
  },

  /**
   * Adaptador de Prisma que conecta NextAuth con la base de datos.
   */
  adapter: PrismaAdapter(prisma),

  /**
   * Configuración de la estrategia de sesión: se usa JWT.
   */
  session: { strategy: "jwt" },

  /**
   * Configuración externa importada, por ejemplo, proveedores.
   */
  ...authConfig,
});

/**
 * Exporta los handlers GET y POST de autenticación para usarlos en las rutas API.
 */
export const handlers = { GET, POST };
