"use server";

import * as z from "zod";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { esquemaFormularioLogin } from "../esquemas/login";

const MENSAJES = {
  CAMPOS_INVALIDOS: "¡Campos no válidos!",
  CREDENCIALES_INVALIDAS: "Correo electrónico o contraseña incorrectos.",
  CORREO_ENVIADO: "Correo electrónico enviado!",
  ERROR_PREDETERMINADO: "Algo salió mal. Por favor, inténtalo de nuevo.",
};

export const iniciarSesionUsuario = async (
  datos: z.infer<typeof esquemaFormularioLogin>
) => {
  const camposValidados = esquemaFormularioLogin.safeParse(datos);

  if (!camposValidados.success) {
    return { error: MENSAJES.CAMPOS_INVALIDOS, exito: "" };
  }

  const { correo, contrasena } = camposValidados.data;

  try {
    await signIn("credentials", {
      correo,
      contrasena,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { error: "", exito: MENSAJES.CORREO_ENVIADO };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.message) {
        case "CredentialsSignin":
          return { error: MENSAJES.CREDENCIALES_INVALIDAS, exito: "" };
        default:
          return { error: MENSAJES.ERROR_PREDETERMINADO, exito: "" };
      }
    }
    throw error;
  }
};

export async function cerrarSesionUsuario() {
  await signOut();
}
