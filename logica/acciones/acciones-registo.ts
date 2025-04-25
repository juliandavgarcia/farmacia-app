"use server";

import * as z from "zod";
import { EsquemaUsuario } from "../esquemas/usuario";
import { crearUsuario, obtenerUsuarioPorCorreo } from "./acciones-usuario";

const MENSAJES = {
  CAMPOS_INVALIDOS: "¡Campos no válidos!",
  CORREO_ENVIADO: "Correo electrónico enviado!",
  CORREO_EN_USO: "El correo electrónico ya está en uso.",
  REGISTRO_EXITOSO: "Registro exitoso!",
  REGISTRO_ERRONEO: "Error en el registro.",
};

type RespuestaRegistrar = {
  exito?: string;
  error?: string;
};

export const registrarUsuario = async (
  values: z.infer<typeof EsquemaUsuario>
): Promise<RespuestaRegistrar> => {
  const validatedFields = EsquemaUsuario.safeParse(values);

  if (!validatedFields.success) {
    return { error: MENSAJES.CAMPOS_INVALIDOS };
  }

  const { correo, contrasena, nombre, rol } = validatedFields.data;
  try {
    const existingUser = await obtenerUsuarioPorCorreo(correo);

    if (existingUser) {
      return { error: MENSAJES.CORREO_EN_USO };
    }

    await crearUsuario({
      correo,
      contrasena,
      nombre,
      rol,
      estado: true,
    });

    return { exito: MENSAJES.REGISTRO_EXITOSO };
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: MENSAJES.REGISTRO_ERRONEO };
  }
};
