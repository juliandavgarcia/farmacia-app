/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/auth";
import { PrismaClient, Producto, Proveedor } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

type MensajeRespuesta = {
  exito?: string;
  error?: string;
  datos?: any;
};

const MENSAJES = {
  HISTORIAL_NO_ENCONTRADO: "No se pudo obtener el historial de compras.",
};

function convertirDecimal(obj: any): any {
  if (obj === null || typeof obj !== "object") return obj;

  if (typeof obj.toNumber === "function") return obj.toNumber();

  for (const key in obj) {
    if (obj[key] && typeof obj[key].toNumber === "function") {
      obj[key] = obj[key].toNumber();
    } else if (typeof obj[key] === "object") {
      obj[key] = convertirDecimal(obj[key]);
    }
  }

  return obj;
}

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
      id: compra.id,
      numeroFactura: compra.numeroFactura,
      fecha: compra.fecha,
      proveedor: compra.proveedor.nombre,
      total: (compra.total as any).toNumber(),
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
    const compraRaw = await prisma.compra.findUnique({
      where: { id: compraId },
      include: {
        proveedor: true,
        usuario: true,
        detalles: {
          include: {
            inventario: {
              include: {
                producto: true,
              },
            },
          },
        },
      },
    });

    if (!compraRaw) {
      return { error: "Compra no encontrada" };
    }

    // Convertir Decimals a number
    const compra = {
      ...compraRaw,
      subtotal: compraRaw.subtotal.toNumber(),
      impuestos: compraRaw.impuestos.toNumber(),
      total: compraRaw.total.toNumber(),
      detalles: compraRaw.detalles.map((det) => ({
        ...det,
        precioUnitario: det.precioUnitario.toNumber(),
        subtotal: det.subtotal.toNumber(),
      })),
    };

    return { datos: compra };
  } catch (error) {
    console.error("Error al obtener la compra:", error);
    return { error: "Error al obtener la compra" };
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
    return { datos: comprasHoy.map(convertirDecimal) };
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

export async function obtenerProveedores(): Promise<Proveedor[]> {
  try {
    const proveedores = await prisma.proveedor.findMany({
      orderBy: {
        nombre: "asc",
      },
    });
    return proveedores;
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    return [];
  }
}

export async function obtenerProductos(): Promise<Producto[]> {
  try {
    const productos = await prisma.producto.findMany({
      where: {
        estado: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });
    return productos.map((p) => convertirDecimal(p));
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

// Función para generar un número de factura consecutivo
export async function generarNumeroFactura(): Promise<string> {
  try {
    // Obtener la última compra para determinar el último número de factura
    const ultimaCompra = await prisma.compra.findFirst({
      orderBy: {
        numeroFactura: "desc",
      },
      select: {
        numeroFactura: true,
      },
    });

    let nuevoNumero = 1;

    if (ultimaCompra) {
      // Extraer el número de la última factura (asumiendo formato FAC-XXXXXX)
      const match = ultimaCompra.numeroFactura.match(/FAC-(\d+)/);
      if (match && match[1]) {
        nuevoNumero = Number.parseInt(match[1], 10) + 1;
      }
    }

    // Formatear el nuevo número con ceros a la izquierda
    return `FAC-${nuevoNumero.toString().padStart(6, "0")}`;
  } catch (error) {
    console.error("Error al generar número de factura:", error);
    // En caso de error, generar un número basado en la fecha actual
    const timestamp = Date.now().toString().slice(-6);
    return `FAC-${timestamp}`;
  }
}

export async function crearCompra(data: any) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return { success: false, error: "No autorizado" };
    }

    // Asegurarse de que el usuarioId esté definido
    const usuarioId = session.user.id as string;

    if (!usuarioId) {
      return { success: false, error: "ID de usuario no disponible" };
    }

    // Crear la compra y sus detalles en una transacción
    const compra = await prisma.$transaction(async (tx) => {
      // 1. Crear la compra
      const nuevaCompra = await tx.compra.create({
        data: {
          numeroFactura: data.numeroFactura,
          fecha: data.fecha,
          subtotal: data.subtotal,
          impuestos: data.impuestos,
          total: data.total,
          estado: "COMPLETADA",
          // Usar relaciones correctas según el esquema de Prisma
          proveedor: {
            connect: { id: data.proveedorId },
          },
          usuario: {
            connect: { id: usuarioId },
          },
        },
      });

      // 2. Crear los detalles de la compra y actualizar el inventario
      for (const detalle of data.detalles) {
        // Crear o actualizar el registro de inventario
        const inventario = await tx.inventario.create({
          data: {
            producto: {
              connect: { id: detalle.productoId },
            },
            cantidad: detalle.cantidad,
            fechaVencimiento: detalle.fechaVencimiento || null,
            numeroLote: detalle.numeroLote || null,
          },
        });

        // Crear el detalle de la compra
        await tx.detalleCompra.create({
          data: {
            compra: {
              connect: { id: nuevaCompra.id },
            },
            inventario: {
              connect: { id: inventario.id },
            },
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario,
            subtotal: detalle.subtotal,
          },
        });
      }

      return nuevaCompra;
    });

    revalidatePath("/compras");
    return { success: true, compraId: compra.id };
  } catch (error: any) {
    console.error("Error al crear compra:", error);
    return {
      success: false,
      error: error.message || "Error al procesar la compra",
    };
  }
}

export async function obtenerCompras(limit = 10) {
  try {
    const compras = await prisma.compra.findMany({
      take: limit,
      orderBy: {
        fecha: "desc",
      },
      include: {
        proveedor: {
          select: {
            nombre: true,
          },
        },
      },
    });

    return compras;
  } catch (error) {
    console.error("Error al obtener compras:", error);
    return [];
  }
}

export async function getDailySalesCount() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await prisma.venta.count({
      where: {
        fecha: {
          gte: today,
          lt: tomorrow,
        },
        estado: "COMPLETADA",
      },
    });

    return count;
  } catch (error) {
    console.error("Error fetching daily sales count:", error);
    return 0;
  }
}

export async function getTotalSalesAmount() {
  try {
    const result = await prisma.venta.aggregate({
      _sum: {
        total: true,
      },
      where: {
        estado: "COMPLETADA",
      },
    });

    return Number(result._sum.total) || 0;
  } catch (error) {
    console.error("Error fetching total sales amount:", error);
    return 0;
  }
}

export async function getTodaySalesAmount() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await prisma.venta.aggregate({
      _sum: {
        total: true,
      },
      where: {
        fecha: {
          gte: today,
          lt: tomorrow,
        },
        estado: "COMPLETADA",
      },
    });

    return Number(result._sum.total) || 0;
  } catch (error) {
    console.error("Error fetching today's sales amount:", error);
    return 0;
  }
}

export async function getTotalProductsCount() {
  try {
    const count = await prisma.producto.count({
      where: {
        estado: true,
      },
    });

    return count;
  } catch (error) {
    console.error("Error fetching total products count:", error);
    return 0;
  }
}

export async function getYesterdaySalesCount() {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await prisma.venta.count({
      where: {
        fecha: {
          gte: yesterday,
          lt: today,
        },
        estado: "COMPLETADA",
      },
    });

    return count;
  } catch (error) {
    console.error("Error fetching yesterday sales count:", error);
    return 0;
  }
}

export async function getYesterdaySalesAmount() {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await prisma.venta.aggregate({
      _sum: {
        total: true,
      },
      where: {
        fecha: {
          gte: yesterday,
          lt: today,
        },
        estado: "COMPLETADA",
      },
    });

    return Number(result._sum.total) || 0;
  } catch (error) {
    console.error("Error fetching yesterday sales amount:", error);
    return 0;
  }
}
