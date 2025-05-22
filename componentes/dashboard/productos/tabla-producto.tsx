"use client";

import { useEffect, useState } from "react";
import { GeneradorTabla } from "@/componentes/generadores/generador-tabla";
import GeneradorEliminar from "@/componentes/generadores/generador-eliminar";
import type { ColumnDef } from "@tanstack/react-table";
import {
  obtenerProductosActivos,
  eliminarProducto,
  actualizarProducto,
} from "@/logica/acciones/acciones-producto";
import type { Producto } from "@/logica/esquemas/producto"; // Asegúrate que este esquema incluya `categoriaNombre`
import ActualizarProducto from "./actualizar-producto";
import GeneradorExcel from "@/componentes/generadores/generador-excel";
import GeneradorPDF from "@/componentes/generadores/generador-pdf";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/componentes/ui/dropdown-menu";
import Link from "next/link";
import { MoreHorizontal, Package } from "lucide-react";
import { Button } from "@/componentes/ui/button";
import { Badge } from "@/componentes/ui/badge";

const TablaProducto = () => {
  const [productoToDelete, setProductoToDelete] = useState<string | null>(null);

  const [data, setData] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const productColumns = (
    fetchProductos: () => void
  ): ColumnDef<Producto>[] => [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <span className="font-semibold">{row.getValue("nombre")}</span>
      ),
    },
    {
      accessorKey: "categoriaNombre",
      header: "Categoría",
      cell: ({ row }) => {
        return (
          <Badge variant="outline">{row.getValue("categoriaNombre")}</Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const producto = row.original;

        const handleUpdate = async (data: Partial<Producto>) => {
          if (
            !data.nombre ||
            data.precioVenta === undefined ||
            !producto.unidadMedida ||
            !producto.categoriaId ||
            producto.estado === undefined
          ) {
            return {
              error: "Faltan campos requeridos para actualizar el producto",
            };
          }

          return actualizarProducto(producto.id || "", {
            ...producto,
            ...data,
          });
        };

        return (
          <div className="flex items-center space-x-2">
            <ActualizarProducto
              onUpdate={handleUpdate}
              initialData={producto}
              refreshData={fetchProductos}
            />
            <GeneradorEliminar
              onDelete={async (id: string) => {
                const response = await eliminarProducto(id);
                return { success: response.success, error: response.error };
              }}
              id={producto.id || ""}
              itemName={producto.nombre}
              refreshData={fetchProductos}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="done" size={"icon"}>
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>

                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/productos/${producto.id}`}>
                    <Package className="h-4 w-4" />
                    Ver inventario
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      enableHiding: false,
    },
  ];

  const fetchProductos = async () => {
    try {
      const response = await obtenerProductosActivos();
      if (response && response.datos) {
        setData(response.datos);
      } else {
        console.error("Formato de respuesta inesperado:", response);
        setData([]);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const columnasExcel = [
    { key: "nombre", header: "Nombre" },
    { key: "descripcion", header: "Descripción" },
    { key: "precioVenta", header: "Precio de Venta" },
    { key: "categoriaNombre", header: "Categoría" },
  ];

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <GeneradorTabla
        data={data}
        columns={productColumns(fetchProductos)}
        filterableColumns={["nombre", "categoriaNombre"]}
      />

      <div className="flex space-x-4">
        <GeneradorExcel
          data={data}
          columns={columnasExcel}
          fileName="productos"
          headerTitle="Listado de Productos"
        />

        <GeneradorPDF
          data={data}
          columns={columnasExcel}
          fileName="productos"
          headerTitle="Listado de Productos"
        />
      </div>
      {productoToDelete && (
        <GeneradorEliminar
          id={productoToDelete}
          itemName="Producto"
          onDelete={eliminarProducto}
          refreshData={() => {
            fetchProductos();
            setProductoToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default TablaProducto;
