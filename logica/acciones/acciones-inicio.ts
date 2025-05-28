"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUltimasVentas() {
  try {
    const ventas = await prisma.venta.findMany({
      take: 5,
      orderBy: {
        fecha: "desc",
      },
      include: {
        cliente: true,
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
    return ventas;
  } catch (error) {
    console.error("Error fetching últimas ventas:", error);
    return [];
  }
}

export async function getClientesFieles() {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        ventas: {
          where: {
            estado: "COMPLETADA",
          },
        },
      },
    });

    const clientesConEstadisticas = clientes
      .map((cliente) => ({
        ...cliente,
        totalCompras: cliente.ventas.length,
        totalGastado: cliente.ventas.reduce(
          (sum, venta) => sum + Number(venta.total),
          0
        ),
      }))
      .filter((cliente) => cliente.totalCompras > 0)
      .sort((a, b) => b.totalCompras - a.totalCompras)
      .slice(0, 5);

    return clientesConEstadisticas;
  } catch (error) {
    console.error("Error fetching clientes fieles:", error);
    return [];
  }
}

export async function getProductosMasVendidos() {
  try {
    const productosVendidos = await prisma.detalleVenta.groupBy({
      by: ["inventarioId"],
      _sum: {
        cantidad: true,
      },
      orderBy: {
        _sum: {
          cantidad: "desc",
        },
      },
      take: 5,
    });

    const productosConDetalles = await Promise.all(
      productosVendidos.map(async (item) => {
        const inventario = await prisma.inventario.findUnique({
          where: { id: item.inventarioId },
          include: {
            producto: true,
          },
        });
        return {
          producto: inventario?.producto,
          cantidadVendida: item._sum.cantidad || 0,
        };
      })
    );

    return productosConDetalles.filter(
      (item) => item.producto && item.producto.id
    );
  } catch (error) {
    console.error("Error fetching productos más vendidos:", error);
    return [];
  }
}

export async function getVentasRecientes() {
  try {
    const hoy = new Date();
    const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

    const ventasRecientes = await prisma.venta.findMany({
      where: {
        fecha: {
          gte: hace7Dias,
        },
        estado: "COMPLETADA",
      },
      orderBy: {
        fecha: "desc",
      },
      take: 10,
      include: {
        cliente: true,
        usuario: true,
      },
    });

    return ventasRecientes;
  } catch (error) {
    console.error("Error fetching ventas recientes:", error);
    return [];
  }
}

export async function getInventarioBajo() {
  try {
    const inventarioBajo = await prisma.inventario.findMany({
      where: {
        cantidad: {
          lte: 10,
        },
      },
      include: {
        producto: true,
      },
      orderBy: {
        cantidad: "asc",
      },
      take: 5,
    });

    return inventarioBajo;
  } catch (error) {
    console.error("Error fetching inventario bajo:", error);
    return [];
  }
}
