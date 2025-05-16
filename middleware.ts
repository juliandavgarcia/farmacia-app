import NextAuth from "next-auth";
import authConfig from "./auth.config";

import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  // Ignora rutas de autenticación de API
  if (path.startsWith(apiAuthPrefix)) return;

  // Ya está logueado e intenta entrar a /login o similares
  if (authRoutes.includes(path) && isLoggedIn) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // No logueado y no es ruta pública
  const isPublic = publicRoutes.includes(path) || authRoutes.includes(path);
  if (!isLoggedIn && !isPublic) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return; // permitir acceso
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
