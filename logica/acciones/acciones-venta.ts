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

import { revalidatePath } from "next/cache"
import { z } from "zod"

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
      }),
    )
    .min(1, "Debe agregar al menos un producto a la venta"),
  subtotal: z.number().positive(),
  iva: z.number().min(0),
  total: z.number().positive(),
})

type VentaData = z.infer<typeof ventaSchema>

/**
 * Crea una nueva venta en el sistema
 * @param data Datos de la venta a crear
 * @returns Objeto con el resultado de la operación
 */
export async function crearVenta(data: VentaData) {
  try {
    // Validar los datos de entrada
    const validatedData = ventaSchema.parse(data)

    // Verificar que haya productos en la venta
    if (validatedData.items.length === 0) {
      return {
        error: "La venta debe contener al menos un producto",
      }
    }

    // Obtener el usuario actual (en producción)
    // const session = await auth()
    // if (!session || !session.user) {
    //   return {
    //     error: "No se ha iniciado sesión",
    //   }
    // }
    // const usuarioId = session.user.id

    // Para desarrollo, usar un ID fijo
    const usuarioId = "clhz2kxu00000jz0g5rfmjpca"

    // Generar número de factura único
    // Formato: F-YYYYMMDD-XXXX (donde XXXX es un número secuencial)
    const fecha = new Date()
    const fechaStr = fecha.toISOString().slice(0, 10).replace(/-/g, "")
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    const numeroFactura = `F-${fechaStr}-${random}`

    // Iniciar una transacción para garantizar la integridad de los datos
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Verificar el stock de cada producto antes de proceder
      for (const item of validatedData.items) {
        const inventario = await tx.inventario.findUnique({
          where: { id: item.inventarioId },
        })

        if (!inventario) {
          throw new Error(`El inventario con ID ${item.inventarioId} no existe`)
        }

        if (inventario.cantidad < item.cantidad) {
          throw new Error(
            `Stock insuficiente para el producto ${item.nombre}. Disponible: ${inventario.cantidad}, Solicitado: ${item.cantidad}`,
          )
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
      })

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
        })

        // Actualizar el inventario
        await tx.inventario.update({
          where: { id: item.inventarioId },
          data: {
            cantidad: {
              decrement: item.cantidad,
            },
          },
        })
      }

      return venta
    })

    // Revalidar las rutas para actualizar la UI
    revalidatePath("/ventas")
    revalidatePath("/dashboard")
    revalidatePath(`/ventas/${resultado.id}`)

    // Registrar la actividad (opcional)
    await registrarActividad({
      tipo: "VENTA_CREADA",
      descripcion: `Venta creada: ${numeroFactura}`,
      usuarioId,
      referenciaId: resultado.id,
    }).catch(console.error) // No bloquear el flujo principal si falla

    return {
      success: true,
      id: resultado.id,
      numeroFactura: resultado.numeroFactura,
      fecha: resultado.fecha,
    }
  } catch (error) {
    console.error("Error al crear la venta:", error)

    // Determinar el tipo de error para dar un mensaje más específico
    if (error instanceof z.ZodError) {
      return {
        error: "Datos de venta inválidos: " + error.errors.map((e) => e.message).join(", "),
      }
    }

    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }

    return {
      error: "Ocurrió un error al procesar la venta. Intente nuevamente.",
    }
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
  tipo: string
  descripcion: string
  usuarioId: string
  referenciaId?: string
}) {
  // Esta función podría implementarse para registrar actividades en una tabla de auditoría
  // Por ahora, solo registramos en la consola
  console.log(`[ACTIVIDAD] ${tipo}: ${descripcion} (Usuario: ${usuarioId}, Ref: ${referenciaId})`)
}

/**
 * Anula una venta existente
 * @param ventaId ID de la venta a anular
 * @returns Objeto con el resultado de la operación
 */
export async function anularVenta(ventaId: string) {
  try {
    // Obtener el usuario actual (en producción)
    // const session = await auth()
    // if (!session || !session.user) {
    //   return {
    //     error: "No se ha iniciado sesión",
    //   }
    // }
    // const usuarioId = session.user.id

    // Para desarrollo, usar un ID fijo
    const usuarioId = "clhz2kxu00000jz0g5rfmjpca"

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
    })

    if (!venta) {
      return {
        error: "La venta no existe",
      }
    }

    if (venta.estado === "ANULADA") {
      return {
        error: "La venta ya está anulada",
      }
    }

    // Iniciar una transacción para garantizar la integridad de los datos
    await prisma.$transaction(async (tx) => {
      // 1. Actualizar el estado de la venta
      await tx.venta.update({
        where: { id: ventaId },
        data: {
          estado: "ANULADA",
        },
      })

      // 2. Devolver los productos al inventario
      for (const detalle of venta.detalles) {
        await tx.inventario.update({
          where: { id: detalle.inventarioId },
          data: {
            cantidad: {
              increment: detalle.cantidad,
            },
          },
        })
      }
    })

    revalidatePath("/ventas")
    revalidatePath("/dashboard")
    revalidatePath(`/ventas/${ventaId}`)

    await registrarActividad({
      tipo: "VENTA_ANULADA",
      descripcion: `Venta anulada: ${venta.numeroFactura}`,
      usuarioId,
      referenciaId: ventaId,
    }).catch(console.error)

    return {
      success: true,
      message: "Venta anulada correctamente",
    }
  } catch (error) {
    console.error("Error al anular la venta:", error)

    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }

    return {
      error: "Ocurrió un error al anular la venta. Intente nuevamente.",
    }
  }
}
