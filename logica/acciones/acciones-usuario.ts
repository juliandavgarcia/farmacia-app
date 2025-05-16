/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { EsquemaUsuarioActualizacion, Usuario } from "../esquemas/usuario";

const prisma = new PrismaClient();

type MensajeRespuesta<T = any> = {
  exito?: string;
  error?: string;
  datos?: T;
};

const MENSAJES = {
  CAMPOS_INVALIDOS: "¡Campos no válidos!",
  USUARIO_EXISTE: "Ya existe un usuario con ese correo electrónico.",
  CREACION_EXITOSA: "Usuario creado exitosamente.",
  ERROR_CREACION: "Error al crear el usuario.",
  ACTUALIZACION_EXITOSA: "Usuario actualizado exitosamente.",
  ERROR_ACTUALIZACION: "Error al actualizar el usuario.",
  ELIMINACION_EXITOSA: "Usuario eliminado exitosamente.",
  ERROR_ELIMINACION: "Error al eliminar el usuario.",
  NO_ENCONTRADO: "Usuario no encontrado.",
};

export const crearUsuario = async (
  datosUsuario: Usuario
): Promise<MensajeRespuesta> => {
  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo: datosUsuario.correo },
    });

    if (usuarioExistente) {
      return { error: MENSAJES.USUARIO_EXISTE };
    }

    const contrasenaEncriptada = await bcrypt.hash(datosUsuario.contrasena, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: datosUsuario.nombre,
        correo: datosUsuario.correo,
        contrasena: contrasenaEncriptada,
        rol: datosUsuario.rol || "USER",
        estado: true,
      },
    });

    return { exito: MENSAJES.CREACION_EXITOSA, datos: nuevoUsuario };
  } catch (error) {
    console.error("Error al crear el usuario:", error);

    return { error: MENSAJES.ERROR_CREACION };
  }
};

export const manejadorActualizarUsuario = async (
  idUsuario: string,
  valores: z.infer<typeof EsquemaUsuarioActualizacion>
): Promise<MensajeRespuesta> => {
  const camposValidados = EsquemaUsuarioActualizacion.safeParse(valores);

  if (!camposValidados.success) {
    return { error: MENSAJES.CAMPOS_INVALIDOS };
  }

  const { correo, ...datos } = camposValidados.data;

  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (usuarioExistente && usuarioExistente.id !== idUsuario) {
      return { error: MENSAJES.USUARIO_EXISTE };
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: idUsuario },
      data: {
        correo,
        ...datos,
      },
    });

    return { exito: MENSAJES.ACTUALIZACION_EXITOSA, datos: usuarioActualizado };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return { error: MENSAJES.ERROR_ACTUALIZACION };
  }
};

export const manejadorEliminarUsuario = async (
  idUsuario: string
): Promise<{ exito: boolean; error?: string }> => {
  try {
    await prisma.usuario.delete({ where: { id: idUsuario } });
    return { exito: true };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return { exito: false, error: MENSAJES.ERROR_ELIMINACION };
  }
};

export const obtenerUsuarioPorId = async (idUsuario: string) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: idUsuario },
    });

    return usuario;
  } catch {
    return null;
  }
};

export const obtenerUsuarioPorCorreo = async (correo: string) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { correo },
    });

    return usuario;
  } catch {
    return null;
  }
};

export const obtenerUsuarios = async (): Promise<MensajeRespuesta> => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        estado: true,
        creadoEn: true,
        actualizadoEn: true,
      },
    });
    return { datos: usuarios };
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return { error: MENSAJES.NO_ENCONTRADO };
  }
};

export const obtenerTotalUsuarios = async () => {
  try {
    const usuarios = await prisma.usuario.count();
    return usuarios;
  } catch (error) {
    console.error("Error al obtener total de usuarios:", error);
    return 0;
  }
};
