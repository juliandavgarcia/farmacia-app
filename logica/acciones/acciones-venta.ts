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

    // Transform Decimal to Number and Date to ISO string for client-side compatibility
    const ventasFormateadas = historial.map((venta) => ({
      id: venta.id,
      numeroFactura: venta.numeroFactura,
      fecha: venta.fecha.toISOString(), // Convert Date object to ISO string
      cliente: venta.cliente?.nombre ?? "Cliente no registrado",
      total: venta.total.toNumber(), // Convert Decimal to Number
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
            inventario: {
              include: {
                producto: {
                  select: {
                    nombre: true,
                    descripcion: true,
                  },
                },
              },
            },
          },
        },
        usuario: {
          select: { nombre: true },
        },
      },
    });

    if (!venta) {
      return { error: MENSAJES.VENTA_NO_ENCONTRADA };
    }

    const serializedVenta = {
      ...venta,
      fecha: venta.fecha.toISOString(),
      subtotal: venta.subtotal.toNumber(),
      iva: venta.iva.toNumber(),
      total: venta.total.toNumber(),
      detalles: venta.detalles.map((detalle) => ({
        ...detalle,
        precioUnitario: detalle.precioUnitario.toNumber(),
        subtotal: detalle.subtotal.toNumber(),
        inventario: {
          ...detalle.inventario,
          producto: {
            ...detalle.inventario.producto,
          },
        },
      })),
      cliente: venta.cliente
        ? {
            ...venta.cliente,
            creadoEn: venta.cliente.creadoEn.toISOString(),
            actualizadoEn: venta.cliente.actualizadoEn.toISOString(),
          }
        : undefined,
      usuario: {
        ...venta.usuario,
      },
    };

    return { datos: serializedVenta };
  } catch (error: any) {
    console.error("Error al obtener la venta:", error);
    return { error: MENSAJES.ERROR_OBTENER_VENTA };
  }
};

import { revalidatePath } from "next/cache";
import { z } from "zod";

// Esquema de validación para los datos de la venta
const ventaSchema = z.object({
  clienteId: z.string().optional(),
  metodoPago: z.enum(["Efectivo", "Tarjeta"]),
  items: z
    .array(
      z.object({
        inventarioId: z.string(),
        productoId: z.string(),
        nombre: z.string(),
        cantidad: z.number().positive(),
        precioUnitario: z.number().positive(),
        subtotal: z.number().positive(),
      })
    )
    .min(1, "Debe agregar al menos un producto a la venta"),
  subtotal: z.number().positive(),
  iva: z.number().min(0),
  total: z.number().positive(),
});

type VentaData = z.infer<typeof ventaSchema>;

/**
 * Crea una nueva venta en el sistema
 * @param data Datos de la venta a crear
 * @returns Objeto con el resultado de la operación
 */
export async function crearVenta(data: VentaData) {
  try {
    // Validar los datos de entrada
    const validatedData = ventaSchema.parse(data);

    // Verificar que haya productos en la venta
    if (validatedData.items.length === 0) {
      return {
        error: "La venta debe contener al menos un producto",
      };
    }

    // Para desarrollo, usar un ID fijo
    const usuarioId = "clhz2kxu00000jz0g5rfmjpca";

    const fecha = new Date();
    const fechaStr = fecha.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const numeroFactura = `F-${fechaStr}-${random}`;

    // Iniciar una transacción para garantizar la integridad de los datos
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Verificar el stock de cada producto antes de proceder
      for (const item of validatedData.items) {
        const inventario = await tx.inventario.findUnique({
          where: { id: item.inventarioId },
        });

        if (!inventario) {
          throw new Error(
            `El inventario con ID ${item.inventarioId} no existe`
          );
        }

        if (inventario.cantidad < item.cantidad) {
          throw new Error(
            `Stock insuficiente para el producto ${item.nombre}. Disponible: ${inventario.cantidad}, Solicitado: ${item.cantidad}`
          );
        }
      }

      // 2. Crear la venta
      const venta = await tx.venta.create({
        data: {
          numeroFactura,
          subtotal: validatedData.subtotal,
          iva: validatedData.iva,
          total: validatedData.total,
          metodoPago: validatedData.metodoPago,
          estado: "COMPLETADA",
          clienteId: validatedData.clienteId || null,
          usuarioId,
        },
      });

      // 3. Crear los detalles de la venta y actualizar el inventario
      for (const item of validatedData.items) {
        // Crear el detalle de venta
        await tx.detalleVenta.create({
          data: {
            ventaId: venta.id,
            inventarioId: item.inventarioId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.subtotal,
          },
        });

        // Actualizar el inventario
        await tx.inventario.update({
          where: { id: item.inventarioId },
          data: {
            cantidad: {
              decrement: item.cantidad,
            },
          },
        });
      }

      return venta;
    });

    // Revalidar las rutas para actualizar la UI
    revalidatePath("/ventas");
    revalidatePath("/dashboard");
    revalidatePath(`/ventas/${resultado.id}`);

    // Registrar la actividad (opcional)
    await registrarActividad({
      tipo: "VENTA_CREADA",
      descripcion: `Venta creada: ${numeroFactura}`,
      usuarioId,
      referenciaId: resultado.id,
    }).catch(console.error); // No bloquear el flujo principal si falla

    return {
      success: true,
      id: resultado.id,
      numeroFactura: resultado.numeroFactura,
      fecha: resultado.fecha,
    };
  } catch (error) {
    console.error("Error al crear la venta:", error);

    // Determinar el tipo de error para dar un mensaje más específico
    if (error instanceof z.ZodError) {
      return {
        error:
          "Datos de venta inválidos: " +
          error.errors.map((e) => e.message).join(", "),
      };
    }

    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: "Ocurrió un error al procesar la venta. Intente nuevamente.",
    };
  }
}

/**
 * Registra una actividad en el sistema (función auxiliar)
 */
async function registrarActividad({
  tipo,
  descripcion,
  usuarioId,
  referenciaId,
}: {
  tipo: string;
  descripcion: string;
  usuarioId: string;
  referenciaId?: string;
}) {
  console.log(
    `[ACTIVIDAD] ${tipo}: ${descripcion} (Usuario: ${usuarioId}, Ref: ${referenciaId})`
  );
}

/**
 * Anula una venta existente
 * @param ventaId ID de la venta a anular
 * @returns Objeto con el resultado de la operación
 */
export async function anularVenta(ventaId: string) {
  try {
    const usuarioId = "clhz2kxu00000jz0g5rfmjpca";

    // Verificar que la venta exista y no esté ya anulada
    const venta = await prisma.venta.findUnique({
      where: { id: ventaId },
      include: {
        detalles: {
          include: {
            inventario: true,
          },
        },
      },
    });

    if (!venta) {
      return {
        error: "La venta no existe",
      };
    }

    if (venta.estado === "ANULADA") {
      return {
        error: "La venta ya está anulada",
      };
    }

    // Iniciar una transacción para garantizar la integridad de los datos
    await prisma.$transaction(async (tx) => {
      // 1. Actualizar el estado de la venta
      await tx.venta.update({
        where: { id: ventaId },
        data: {
          estado: "ANULADA",
        },
      });

      // 2. Devolver los productos al inventario
      for (const detalle of venta.detalles) {
        await tx.inventario.update({
          where: { id: detalle.inventarioId },
          data: {
            cantidad: {
              increment: detalle.cantidad,
            },
          },
        });
      }
    });

    revalidatePath("/ventas");
    revalidatePath("/dashboard");
    revalidatePath(`/ventas/${ventaId}`);

    await registrarActividad({
      tipo: "VENTA_ANULADA",
      descripcion: `Venta anulada: ${venta.numeroFactura}`,
      usuarioId,
      referenciaId: ventaId,
    }).catch(console.error);

    return {
      success: true,
      message: "Venta anulada correctamente",
    };
  } catch (error) {
    console.error("Error al anular la venta:", error);

    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: "Ocurrió un error al anular la venta. Intente nuevamente.",
    };
  }
}

export const obtenerCantidadVentas = async (): Promise<MensajeRespuesta> => {
  try {
    const total = await prisma.venta.count({
      where: { estado: "COMPLETADA" },
    });
    return { datos: total };
  } catch (error) {
    console.error("Error al obtener la cantidad total de ventas:", error);
    return { error: "Error al obtener la cantidad total de ventas" };
  }
};

export const obtenerVentasHoy = async (): Promise<MensajeRespuesta> => {
  try {
    const inicioHoy = new Date();
    inicioHoy.setHours(0, 0, 0, 0);
    const finHoy = new Date();
    finHoy.setHours(23, 59, 59, 999);

    const totalHoy = await prisma.venta.count({
      where: {
        estado: "COMPLETADA",
        fecha: {
          gte: inicioHoy,
          lte: finHoy,
        },
      },
    });

    return { datos: totalHoy };
  } catch (error) {
    console.error("Error al obtener las ventas de hoy:", error);
    return { error: "Error al obtener las ventas de hoy" };
  }
};

export const obtenerVentasSemana = async (): Promise<MensajeRespuesta> => {
  try {
    const ahora = new Date();
    const primerDiaSemana = new Date(ahora);
    const dia = ahora.getDay(); // 0 domingo ... 6 sábado
    // Suponiendo que la semana inicia lunes
    const diff = dia === 0 ? 6 : dia - 1;
    primerDiaSemana.setDate(ahora.getDate() - diff);
    primerDiaSemana.setHours(0, 0, 0, 0);

    const ultimoDiaSemana = new Date(primerDiaSemana);
    ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);
    ultimoDiaSemana.setHours(23, 59, 59, 999);

    const totalSemana = await prisma.venta.count({
      where: {
        estado: "COMPLETADA",
        fecha: {
          gte: primerDiaSemana,
          lte: ultimoDiaSemana,
        },
      },
    });

    return { datos: totalSemana };
  } catch (error) {
    console.error("Error al obtener las ventas de la semana:", error);
    return { error: "Error al obtener las ventas de la semana" };
  }
};

export const obtenerVentasMes = async (): Promise<MensajeRespuesta> => {
  try {
    const ahora = new Date();
    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    primerDiaMes.setHours(0, 0, 0, 0);

    const ultimoDiaMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);
    ultimoDiaMes.setHours(23, 59, 59, 999);

    const totalMes = await prisma.venta.count({
      where: {
        estado: "COMPLETADA",
        fecha: {
          gte: primerDiaMes,
          lte: ultimoDiaMes,
        },
      },
    });

    return { datos: totalMes };
  } catch (error) {
    console.error("Error al obtener las ventas del mes:", error);
    return { error: "Error al obtener las ventas del mes" };
  }
};
