"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function generarNumeroFactura(): Promise<string> {
  try {
    // Obtener la última venta para determinar el último número de factura
    const ultimaVenta = await prisma.venta.findFirst({
      orderBy: {
        numeroFactura: "desc",
      },
      select: {
        numeroFactura: true,
      },
    });

    let nuevoNumero = 1;

    if (ultimaVenta) {
      // Extraer el número de la última factura (asumiendo formato VNT-XXXXXX)
      const match = ultimaVenta.numeroFactura.match(/VNT-(\d+)/);
      if (match && match[1]) {
        nuevoNumero = Number.parseInt(match[1], 10) + 1;
      }
    }

    // Formatear el nuevo número con ceros a la izquierda
    return `VNT-${nuevoNumero.toString().padStart(6, "0")}`;
  } catch (error) {
    console.error("Error al generar número de factura:", error);
    // En caso de error, generar un número basado en la fecha actual
    const timestamp = Date.now().toString().slice(-6);
    return `VNT-${timestamp}`;
  }
}

interface DetalleVenta {
  inventarioId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface VentaData {
  numeroFactura: string;
  clienteId: string;
  metodoPago: string;
  subtotal: number;
  iva: number;
  total: number;
  detalles: DetalleVenta[];
}

export async function registrarVenta(data: VentaData) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return { success: false, error: "No autorizado" };
    }

    const usuarioId = session.user.id as string;

    if (!usuarioId) {
      return { success: false, error: "ID de usuario no disponible" };
    }

    // Crear la venta y sus detalles en una transacción
    const venta = await prisma.$transaction(async (tx) => {
      // 1. Crear la venta
      const nuevaVenta = await tx.venta.create({
        data: {
          numeroFactura: data.numeroFactura,
          clienteId: data.clienteId,
          usuarioId: usuarioId,
          metodoPago: data.metodoPago,
          subtotal: data.subtotal,
          iva: data.iva,
          total: data.total,
          detalles: {
            create: data.detalles.map((detalle) => ({
              inventarioId: detalle.inventarioId,
              cantidad: detalle.cantidad,
              precioUnitario: detalle.precioUnitario,
              subtotal: detalle.subtotal,
            })),
          },
        },
      });

      // 2. Actualizar el inventario para cada detalle
      for (const detalle of data.detalles) {
        await tx.inventario.update({
          where: { id: detalle.inventarioId },
          data: {
            cantidad: {
              decrement: detalle.cantidad,
            },
          },
        });
      }

      return nuevaVenta;
    });

    revalidatePath("/ventas");
    return {
      ...venta,
      subtotal: Number(venta.subtotal),
      iva: Number(venta.iva),
      total: Number(venta.total),
    };
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    throw new Error("No se pudo registrar la venta");
  }
}
