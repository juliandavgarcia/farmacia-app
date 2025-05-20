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
        detalles: true,
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

export const obtenerCompras = async (): Promise<MensajeRespuesta> => {
  try {
    const compras = await prisma.compra.findMany();
    return { datos: compras };
  } catch (error) {
    console.error("Error al obtener las compras:", error);
    return { error: "Error al obtener las compras." };
  }
};

export const obtenerCantidadCompras = async (): Promise<MensajeRespuesta> => {
  try {
    const cantidad = await prisma.compra.count();
    return { datos: cantidad };
  } catch (error) {
    console.error("Error al obtener la cantidad de compras:", error);
    return { error: "Error al obtener la cantidad de compras." };
  }
};

export const obtenerComprasHoy = async (): Promise<MensajeRespuesta> => {
  const hoy = new Date();
  const inicioDia = new Date(hoy.setHours(0, 0, 0, 0));

  try {
    const comprasHoy = await prisma.compra.findMany({
      where: {
        fecha: {
          gte: inicioDia,
        },
      },
    });
    return { datos: comprasHoy };
  } catch (error) {
    console.error("Error al obtener las compras de hoy:", error);
    return { error: "Error al obtener las compras de hoy." };
  }
};

export const obtenerComprasSemana = async (): Promise<MensajeRespuesta> => {
  const hoy = new Date();
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - hoy.getDay());

  try {
    const comprasSemana = await prisma.compra.findMany({
      where: {
        fecha: {
          gte: inicioSemana,
        },
      },
    });
    return { datos: comprasSemana };
  } catch (error) {
    console.error("Error al obtener las compras de la semana:", error);
    return { error: "Error al obtener las compras de la semana." };
  }
};

export const obtenerComprasMes = async (): Promise<MensajeRespuesta> => {
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  try {
    const comprasMes = await prisma.compra.findMany({
      where: {
        fecha: {
          gte: inicioMes,
        },
      },
    });
    return { datos: comprasMes };
  } catch (error) {
    console.error("Error al obtener las compras del mes:", error);
    return { error: "Error al obtener las compras del mes." };
  }
};
