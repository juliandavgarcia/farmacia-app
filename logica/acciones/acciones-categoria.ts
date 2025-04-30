/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { PrismaClient } from "@prisma/client";
import * as z from "zod";
import { EsquemaCategoria } from "../esquemas/categoria";

const prisma = new PrismaClient();

type MensajeRespuesta = {
  success?: string;
  error?: string;
  data?: any;
};

const MENSAJES = {
  CAMPOS_INVALIDOS: "¡Campos no válidos!",
  CATEGORIA_EXISTE: "Ya existe una categoría con ese nombre.",
  CREACION_EXITOSA: "Categoría creada exitosamente.",
  ERROR_CREACION: "Error al crear la categoría.",
  ACTUALIZACION_EXITOSA: "Categoría actualizada exitosamente.",
  ERROR_ACTUALIZACION: "Error al actualizar la categoría.",
  ELIMINACION_EXITOSA: "Categoría eliminada exitosamente.",
  ERROR_ELIMINACION: "Error al eliminar la categoría.",
  NO_ENCONTRADA: "Categoría no encontrada.",
  VIOLACION_RESTRICCION: "No se puede eliminar porque hay registros asociados.",
};

export const crearCategoria = async (
  valores: z.infer<typeof EsquemaCategoria>
): Promise<MensajeRespuesta> => {
  const camposValidados = EsquemaCategoria.safeParse(valores);

  if (!camposValidados.success) {
    return { error: MENSAJES.CAMPOS_INVALIDOS };
  }

  const { nombre, ...datos } = camposValidados.data;

  try {
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { nombre },
    });

    if (categoriaExistente) {
      return { error: MENSAJES.CATEGORIA_EXISTE };
    }

    const nuevaCategoria = await prisma.categoria.create({
      data: { ...datos, nombre },
    });

    return { success: MENSAJES.CREACION_EXITOSA, datos: nuevaCategoria };

  } catch (error) {
    console.error("Error al crear la categoría:", error);
    return { error: MENSAJES.ERROR_CREACION };
  }
};

export const actualizarCategoria = async (
  categoriaId: string,
  valores: z.infer<typeof EsquemaCategoria>
): Promise<MensajeRespuesta> => {
  const camposValidados = EsquemaCategoria.safeParse(valores);

  if (!camposValidados.success) {
    return { error: MENSAJES.CAMPOS_INVALIDOS };
  }

  const { nombre, ...datos } = camposValidados.data;

  try {
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { nombre },
    });

    if (categoriaExistente && categoriaExistente.id !== categoriaId) {
      return { error: MENSAJES.CATEGORIA_EXISTE };
    }

    const categoriaActualizada = await prisma.categoria.update({
      where: { id: categoriaId },
      data: {
        nombre: nombre,
        ...datos,
      },
    });

    return {
      success: MENSAJES.ACTUALIZACION_EXITOSA,
      datos: categoriaActualizada,
    };
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    return { error: MENSAJES.ERROR_ACTUALIZACION };
  }
};

export const eliminarCategoria = async (
  categoriaId: string
): Promise<{ exito: boolean; error?: string }> => {
  try {
    await prisma.categoria.delete({ where: { id: categoriaId } });
    return { exito: true };
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);

    if (typeof error === "object" && error !== null && "code" in error) {
      const errorPrisma = error as { code: string };
      if (errorPrisma.code === "P2003") {
        return { exito: false, error: MENSAJES.VIOLACION_RESTRICCION };
      }
    }

    return { exito: false, error: MENSAJES.ERROR_ELIMINACION };
  }
};

export const obtenerCategoriaPorId = async (
  categoriaId: string
): Promise<MensajeRespuesta> => {
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: categoriaId },
    });
    if (!categoria) {
      return { error: MENSAJES.NO_ENCONTRADA };
    }
    return { data: categoria };
  } catch (error) {
    console.error("Error al obtener la categoría:", error);
    return { error: MENSAJES.NO_ENCONTRADA };
  }
};

export const obtenerCategorias = async (): Promise<MensajeRespuesta> => {
  try {
    const categorias = await prisma.categoria.findMany();
    return { data: categorias };
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return { error: MENSAJES.NO_ENCONTRADA };
  }
};
