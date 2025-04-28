/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { PrismaClient } from "@prisma/client";
import * as z from "zod";
import { EsquemaLote } from "../esquemas/lote";

const prisma = new PrismaClient();

type MensajeRespuesta = {
  exito?: string;
  error?: string;
  datos?: any;
};

const MENSAJES = {
  CAMPOS_INVALIDOS: "¡Campos no válidos!",
  LOTE_EXISTE: "Ya existe un lote con ese número.",
  CREACION_EXITOSA: "Lote creado exitosamente.",
  ERROR_CREACION: "Error al crear el lote.",
  ACTUALIZACION_EXITOSA: "Lote actualizado exitosamente.",
  ERROR_ACTUALIZACION: "Error al actualizar el lote.",
  ELIMINACION_EXITOSA: "Lote eliminado exitosamente.",
  ERROR_ELIMINACION: "Error al eliminar el lote.",
  NO_ENCONTRADO: "Lote no encontrado.",
  VIOLACION_RESTRICCION: "No se puede eliminar porque hay registros asociados.",
};

export const crearLote = async (
  valores: z.infer<typeof EsquemaLote>
): Promise<MensajeRespuesta> => {
  const camposValidados = EsquemaLote.safeParse(valores);

  if (!camposValidados.success) {
    return { error: MENSAJES.CAMPOS_INVALIDOS };
  }

  const { numeroLote, ...datos } = camposValidados.data;

  try {
    const loteExistente = await prisma.lote.findFirst({
      where: { numeroLote },
    });

    if (loteExistente) {
      return { error: MENSAJES.LOTE_EXISTE };
    }

    const nuevoLote = await prisma.lote.create({
      data: { ...datos, numeroLote },
    });

    return { exito: MENSAJES.CREACION_EXITOSA, datos: nuevoLote };
  } catch (error) {
    console.error("Error al crear el lote:", error);
    return { error: MENSAJES.ERROR_CREACION };
  }
};

export const actualizarLote = async (
  loteId: string,
  valores: z.infer<typeof EsquemaLote>
): Promise<MensajeRespuesta> => {
  const camposValidados = EsquemaLote.safeParse(valores);

  if (!camposValidados.success) {
    return { error: MENSAJES.CAMPOS_INVALIDOS };
  }

  const { numeroLote, ...datos } = camposValidados.data;

  try {
    const loteExistente = await prisma.lote.findFirst({
      where: { numeroLote },
    });

    if (loteExistente && loteExistente.id !== loteId) {
      return { error: MENSAJES.LOTE_EXISTE };
    }

    const loteActualizado = await prisma.lote.update({
      where: { id: loteId },
      data: {
        numeroLote: numeroLote,
        ...datos,
      },
    });

    return {
      exito: MENSAJES.ACTUALIZACION_EXITOSA,
      datos: loteActualizado,
    };
  } catch (error) {
    console.error("Error al actualizar el lote:", error);
    return { error: MENSAJES.ERROR_ACTUALIZACION };
  }
};

export const eliminarLote = async (
  loteId: string
): Promise<{ exito: boolean; error?: string }> => {
  try {
    await prisma.lote.delete({ where: { id: loteId } });
    return { exito: true };
  } catch (error) {
    console.error("Error al eliminar el lote:", error);

    if (typeof error === "object" && error !== null && "code" in error) {
      const errorPrisma = error as { code: string };
      if (errorPrisma.code === "P2003") {
        return { exito: false, error: MENSAJES.VIOLACION_RESTRICCION };
      }
    }

    return { exito: false, error: MENSAJES.ERROR_ELIMINACION };
  }
};

export const obtenerLotePorId = async (
  loteId: string
): Promise<MensajeRespuesta> => {
  try {
    const lote = await prisma.lote.findUnique({
      where: { id: loteId },
    });
    if (!lote) {
      return { error: MENSAJES.NO_ENCONTRADO };
    }
    return { datos: lote };
  } catch (error) {
    console.error("Error al obtener el lote:", error);
    return { error: MENSAJES.NO_ENCONTRADO };
  }
};

export const obtenerLotes = async (): Promise<MensajeRespuesta> => {
  try {
    const lotes = await prisma.lote.findMany();
    return { datos: lotes };
  } catch (error) {
    console.error("Error al obtener los lotes:", error);
    return { error: MENSAJES.NO_ENCONTRADO };
  }
};
