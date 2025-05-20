"use server";

import { InventarioFormValues } from "@/componentes/dashboard/inventario/formulario-inventario";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Agrega inventario a un producto existente
 * @param productoId ID del producto al que se agregará inventario
 * @param data Datos del inventario a agregar
 * @returns Objeto con el resultado de la operación
 */
export async function agregarInventario(
  productoId: string,
  data: InventarioFormValues
) {
  try {
    // Verificar que el producto exista
    const producto = await prisma.producto.findUnique({
      where: { id: productoId },
    });

    if (!producto) {
      return {
        error: "El producto no existe",
      };
    }

    // Verificar si ya existe un inventario con el mismo lote
    if (data.numeroLote) {
      const inventarioExistente = await prisma.inventario.findFirst({
        where: {
          productoId,
          numeroLote: data.numeroLote,
        },
      });

      if (inventarioExistente) {
        // Actualizar el inventario existente sumando la cantidad
        await prisma.inventario.update({
          where: { id: inventarioExistente.id },
          data: {
            cantidad: {
              increment: data.cantidad,
            },
          },
        });

        // Revalidar las rutas para actualizar la UI
        revalidatePath(`/productos/${productoId}`);

        return {
          success: true,
          message:
            "Se ha actualizado el inventario existente con el mismo lote",
        };
      }
    }

    // Crear nuevo inventario
    const inventario = await prisma.inventario.create({
      data: {
        productoId,
        cantidad: data.cantidad,
        numeroLote: data.numeroLote || null,
        fechaVencimiento: data.fechaVencimiento || null,
      },
    });

    // Revalidar las rutas para actualizar la UI
    revalidatePath(`/productos/${productoId}`);

    return {
      success: true,
      id: inventario.id,
    };
  } catch (error) {
    console.error("Error al agregar inventario:", error);

    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: "Ocurrió un error al agregar el inventario. Intente nuevamente.",
    };
  }
}

/**
 * Ajusta la cantidad de un inventario existente
 * @param inventarioId ID del inventario a ajustar
 * @param cantidad Nueva cantidad
 * @returns Objeto con el resultado de la operación
 */
export async function ajustarInventario(
  inventarioId: string,
  cantidad: number
) {
  try {
    // Verificar que el inventario exista
    const inventario = await prisma.inventario.findUnique({
      where: { id: inventarioId },
      include: {
        producto: true,
      },
    });

    if (!inventario) {
      return {
        error: "El inventario no existe",
      };
    }

    // Actualizar la cantidad del inventario
    await prisma.inventario.update({
      where: { id: inventarioId },
      data: {
        cantidad,
      },
    });

    // Revalidar las rutas para actualizar la UI
    revalidatePath(`/productos/${inventario.producto.id}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error al ajustar inventario:", error);

    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: "Ocurrió un error al ajustar el inventario. Intente nuevamente.",
    };
  }
}

/**
 * Registra un movimiento de inventario
 * @param inventarioId ID del inventario
 * @param tipo Tipo de movimiento (ENTRADA, SALIDA, AJUSTE)
 * @param cantidad Cantidad del movimiento
 * @param motivo Motivo del movimiento
 * @returns Objeto con el resultado de la operación
 */
export async function registrarMovimientoInventario(
  inventarioId: string,
  tipo: "ENTRADA" | "SALIDA" | "AJUSTE",
  cantidad: number
) {
  try {
    // Verificar que el inventario exista
    const inventario = await prisma.inventario.findUnique({
      where: { id: inventarioId },
      include: {
        producto: true,
      },
    });

    if (!inventario) {
      return {
        error: "El inventario no existe",
      };
    }

    // Aquí se implementaría la lógica para registrar el movimiento en una tabla de movimientos
    // Por ahora, solo actualizamos la cantidad del inventario
    let nuevaCantidad = inventario.cantidad;

    if (tipo === "ENTRADA") {
      nuevaCantidad += cantidad;
    } else if (tipo === "SALIDA") {
      if (inventario.cantidad < cantidad) {
        return {
          error: "No hay suficiente stock para realizar esta salida",
        };
      }
      nuevaCantidad -= cantidad;
    } else if (tipo === "AJUSTE") {
      nuevaCantidad = cantidad;
    }

    // Actualizar la cantidad del inventario
    await prisma.inventario.update({
      where: { id: inventarioId },
      data: {
        cantidad: nuevaCantidad,
      },
    });

    // Revalidar las rutas para actualizar la UI
    revalidatePath(`/productos/${inventario.producto.id}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error al registrar movimiento de inventario:", error);

    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: "Ocurrió un error al registrar el movimiento. Intente nuevamente.",
    };
  }
}
