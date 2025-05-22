"use server";

import { prisma } from "@/lib/db";

export async function buscarProductosConInventario(searchTerm: string) {
  try {
    const productos = await prisma.producto.findMany({
      where: {
        AND: [
          {
            estado: true,
          },
          {
            OR: [
              {
                nombre: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              {
                codigoBarras: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
      include: {
        inventarios: {
          where: {
            cantidad: {
              gt: 0,
            },
          },
          orderBy: {
            fechaVencimiento: "asc",
          },
        },
      },
      orderBy: {
        nombre: "asc",
      },
      take: 20,
    });

    // Convertir los valores Decimal a number y Date a string antes de enviarlos al cliente
    return productos.map((producto) => ({
      id: producto.id,
      nombre: producto.nombre,
      codigoBarras: producto.codigoBarras,
      precioVenta: Number(producto.precioVenta),
      inventarios: producto.inventarios.map((inv) => ({
        id: inv.id,
        cantidad: inv.cantidad,
        numeroLote: inv.numeroLote,
        fechaVencimiento: inv.fechaVencimiento
          ? inv.fechaVencimiento.toISOString()
          : null,
      })),
    }));
  } catch (error) {
    console.error("Error al buscar productos:", error);
    return [];
  }
}
