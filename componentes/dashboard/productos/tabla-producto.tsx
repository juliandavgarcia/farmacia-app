/* eslint-disable @typescript-eslint/no-explicit-any */
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/componentes/ui/dropdown-menu";
import Link from "next/link";
import { MoreHorizontal, Package } from "lucide-react";
import { toast } from "sonner";
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
      accessorKey: "codigoBarras",
      header: "Código de Barras",
      cell: ({ row }) => {
        return <span>{row.getValue("codigoBarras") || "N/A"}</span>;
      },
    },
    {
      accessorKey: "precioCompra",
      header: "Precio Compra",
      cell: ({ row }) => {
        const valor = row.getValue("precioCompra") as number;
        return (
          <span className="text-right">
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 2,
            }).format(valor)}
          </span>
        );
      },
    },
    {
      accessorKey: "precioVenta",
      header: "Precio de Venta",
      cell: ({ row }) => {
        const valor = row.getValue("precioVenta") as number;
        return (
          <span className="text-right">
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
            }).format(valor)}
          </span>
        );
      },
    },
    {
      accessorKey: "inventarios",
      header: "Stock",
      cell: ({ row }) => {
        const inventarios = row.getValue("inventarios") as any[];
        const total =
          inventarios?.reduce((acc, inv) => acc + inv.cantidad, 0) || 0;
        const variant = total === 0 ? "destructive" : "outline";
        return (
          <Badge variant={variant} className="ml-auto">
            {total}
          </Badge>
        );
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.getValue("estado");
        return (
          <Badge variant={estado ? "default" : "secondary"}>
            {estado ? "Activo" : "Inactivo"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: ({ row }) => {
        const descripcion: string = row.getValue("descripcion") as string;
        return <span>{descripcion || "No hay descripción"}</span>;
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
                    Ver detalles
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/productos/${producto.id}/inventario`}
                    className="flex items-center"
                  >
                    <Package className="h-4 w-4" />
                    Gestionar inventario
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => {
                    if (producto.id) {
                      navigator.clipboard.writeText(
                        producto.codigoBarras || "No disponible"
                      );
                      toast("ID copiado");
                    } else {
                      toast.error("ID no disponible");
                    }
                  }}
                >
                  Copiar Código de Barras
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
