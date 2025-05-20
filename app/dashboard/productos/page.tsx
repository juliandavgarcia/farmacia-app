import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/componentes/ui/button";
import { prisma } from "@/lib/db";
import ProductosStats from "@/componentes/dashboard/productos/estadisticas-producto";
import TablaProducto from "@/componentes/dashboard/productos/tabla-producto";

export const dynamic = "force-dynamic";

async function getProductos() {
  return await prisma.producto.findMany({
    include: {
      categoria: true,
      inventarios: true,
    },
    orderBy: {
      nombre: "asc",
    },
  });
}

async function getCategorias() {
  return await prisma.categoria.findMany({
    orderBy: {
      nombre: "asc",
    },
  });
}

export default async function ProductosPage() {
  const [productos] = await Promise.all([getProductos(), getCategorias()]);

  // Calcular estadísticas
  const totalProductos = productos.length;
  const productosActivos = productos.filter(
    (producto) => producto.estado
  ).length;
  const productosInactivos = totalProductos - productosActivos;
  const sinStock = productos.filter(
    (producto) =>
      producto.inventarios.reduce((total, inv) => total + inv.cantidad, 0) === 0
  ).length;

  return (
    <div className="mx-auto p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            Gestión de productos e inventario
          </p>
        </div>
        <Button asChild>
          <Link
            href="/dashboard/productos/nuevo"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Nuevo Producto
          </Link>
        </Button>
      </div>

      <ProductosStats
        totalProductos={totalProductos}
        productosActivos={productosActivos}
        productosInactivos={productosInactivos}
        sinStock={sinStock}
      />
      <TablaProducto />
    </div>
  );
}
