import NuevaVentaForm from "@/componentes/dashboard/ventas/nueva/nueva-venta-form";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nueva Venta | Sistema de Farmacia",
  description: "Crear una nueva venta en el sistema",
};

async function getClientes() {
  return await prisma.cliente.findMany({
    orderBy: {
      nombre: "asc",
    },
  });
}

async function getProductos() {
  const productos = await prisma.producto.findMany({
    where: {
      estado: true,
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
      categoria: true,
    },
    orderBy: {
      nombre: "asc",
    },
  });

  return productos.map((producto) => ({
    ...producto,
    precioVenta: Number(producto.precioVenta),
  }));
}

export default async function NuevaVentaPage() {
  const [clientes, productos] = await Promise.all([
    getClientes(),
    getProductos(),
  ]);

  const productosConInventario = productos.filter(
    (producto) => producto.inventarios.length > 0
  );

  return (
    <div className="mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Nueva Venta</h1>
        <p className="text-muted-foreground">
          Crear una nueva venta en el sistema
        </p>
      </div>

      <NuevaVentaForm clientes={clientes} productos={productosConInventario} />
    </div>
  );
}
