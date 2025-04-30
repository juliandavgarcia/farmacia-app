"use client";

import { useEffect, useState } from "react";
import { GeneradorTabla } from "@/componentes/generadores/generador-tabla";
import GeneradorEliminar from "@/componentes/generadores/generador-eliminar";
import { ColumnDef } from "@tanstack/react-table";
import {
  obtenerProductosActivos,
  eliminarProducto,
  actualizarProducto,
} from "@/logica/acciones/acciones-producto";
import { Producto } from "@/logica/esquemas/producto"; // Asegúrate que este esquema incluya `categoriaNombre`
import ActualizarProducto from "./actualizar-producto";

const productColumns = (fetchProductos: () => void): ColumnDef<Producto>[] => [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("nombre")}</span>
    ),
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
    accessorKey: "precioVenta",
    header: "Precio de Venta",
    cell: ({ row }) => {
      const valor = row.getValue("precioVenta") as number;
      const valorFormateado = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(valor);
      return <span>{valorFormateado}</span>;
    },
  },
  {
    accessorKey: "categoriaNombre",
    header: "Categoría",
    cell: ({ row }) => {
      return <span>{row.getValue("categoriaNombre")}</span>;
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
        <div className="flex space-x-2">
          <ActualizarProducto
            onUpdate={handleUpdate}
            initialData={producto}
            refreshData={fetchProductos}
          />
          <GeneradorEliminar
            onDelete={async (id: string) => {
              const response = await eliminarProducto(id);
              return { success: response.exito, error: response.error };
            }}
            id={producto.id || ""}
            itemName={producto.nombre}
            refreshData={fetchProductos}
          />
        </div>
      );
    },
    enableHiding: false,
  },
];

const TablaProducto = () => {
  const [data, setData] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <GeneradorTabla
        data={data}
        columns={productColumns(fetchProductos)}
        filterableColumns={["nombre", "categoriaNombre"]}
      />
    </div>
  );
};

export default TablaProducto;
