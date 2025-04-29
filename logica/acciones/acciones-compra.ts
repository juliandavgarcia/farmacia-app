/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type MensajeRespuesta = {
  exito?: string;
  error?: string;
  datos?: any;
};

const MENSAJES = {
  HISTORIAL_NO_ENCONTRADO: "No se pudo obtener el historial de compras.",
};

export const obtenerHistorialCompras = async (): Promise<MensajeRespuesta> => {
  try {
    const historial = await prisma.compra.findMany({
      select: {
        id: true,
        numeroFactura: true,
        fecha: true,
        total: true,
        proveedor: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    });

    const comprasFormateadas = historial.map((compra) => ({
      numeroFactura: compra.numeroFactura,
      fecha: compra.fecha,
      proveedor: compra.proveedor.nombre,
      total: compra.total,
    }));

    return { datos: comprasFormateadas };
  } catch (error) {
    console.error("Error al obtener el historial de compras:", error);
    return { error: MENSAJES.HISTORIAL_NO_ENCONTRADO };
  }
};

export const obtenerCompraPorId = async (
  compraId: string
): Promise<MensajeRespuesta> => {
  try {
    const compra = await prisma.compra.findUnique({
      where: { id: compraId },
      include: {
        proveedor: true,
        detalles: {
          include: { producto: true },
        },
      },
    });

    if (!compra) {
      return { error: "Compra no encontrada" };
    }

    return { datos: compra };
  } catch (error) {
    console.error("Error al obtener la compra:", error);
    return { error: "Error al obtener la compra" };
  }
};
