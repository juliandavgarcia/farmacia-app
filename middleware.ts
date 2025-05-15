import NextAuth from "next-auth";
import authConfig from "./auth.config";

import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from "./routes";
import { roleProtectedRoutes } from "./role-protected";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const userRole = req.auth?.user?.rol;

  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // No logueado y ruta privada
  if (!isLoggedIn && !isPublicRoute && nextUrl.pathname !== "/auth/login") {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  // Verificación de rol
  for (const [pathPrefix, allowedRoles] of Object.entries(
    roleProtectedRoutes
  )) {
    if (nextUrl.pathname.startsWith(pathPrefix)) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        return Response.redirect(new URL("/dashboard/no-autorizado", nextUrl));
      }
    }
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
