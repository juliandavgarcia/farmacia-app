import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/componentes/ui/button";
import { prisma } from "@/lib/db";
import InventarioForm from "@/componentes/dashboard/inventario/formulario-inventario";

export const metadata: Metadata = {
  title: "Agregar Inventario | Sistema de Farmacia",
  description: "Agregar inventario a un producto existente",
};

async function getProducto(id: string) {
  const producto = await prisma.producto.findUnique({
    where: { id },
  });

  if (!producto) {
    return null;
  }

  return {
    id: producto.id,
    nombre: producto.nombre,
  };
}

export default async function AgregarInventarioPage({
  params,
}: {
  params: { id: string };
}) {
  const producto = await getProducto(params.id);

  if (!producto) {
    notFound();
  }

  return (
    <div className="mx-auto p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/productos/${producto.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Agregar Inventario
          </h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Agregar inventario al producto: {producto.nombre}
        </p>
      </div>

      <InventarioForm producto={producto} />
    </div>
  );
}
