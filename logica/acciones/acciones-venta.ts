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
  HISTORIAL_NO_ENCONTRADO: "No se pudo obtener el historial de ventas.",
  VENTA_NO_ENCONTRADA: "Venta no encontrada.",
  ERROR_OBTENER_VENTA: "Error al obtener la venta.",
};

export const obtenerHistorialVentas = async (): Promise<MensajeRespuesta> => {
  try {
    const historial = await prisma.venta.findMany({
      select: {
        id: true,
        numeroFactura: true,
        fecha: true,
        total: true,
        cliente: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    });

    const ventasFormateadas = historial.map((venta) => ({
      numeroFactura: venta.numeroFactura,
      fecha: venta.fecha,
      cliente: venta.cliente?.nombre ?? "Cliente no registrado",
      total: venta.total,
    }));

    return { datos: ventasFormateadas };
  } catch (error) {
    console.error("Error al obtener el historial de ventas:", error);
    return { error: MENSAJES.HISTORIAL_NO_ENCONTRADO };
  }
};

export const obtenerVentaPorId = async (
  ventaId: string
): Promise<MensajeRespuesta> => {
  try {
    const venta = await prisma.venta.findUnique({
      where: { id: ventaId },
      include: {
        cliente: true,
        detalles: {
          include: {
            producto: true,
            lote: true,
          },
        },
        usuario: true,
      },
    });

    if (!venta) {
      return { error: MENSAJES.VENTA_NO_ENCONTRADA };
    }

    return { datos: venta };
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    return { error: MENSAJES.ERROR_OBTENER_VENTA };
  }
};
