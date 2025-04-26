"use client";

import GeneradorEliminar from "@/componentes/generadores/generador-eliminar";
import { GeneradorTabla } from "@/componentes/generadores/generador-tabla";
import {
  actualizarCategoria,
  eliminarCategoria,
  obtenerCategorias,
} from "@/logica/acciones/acciones-categoria";
import { Categoria } from "@/logica/esquemas/categoria";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { GoQuestion } from "react-icons/go";
import ActualizarCategoria from "./actualizar-categoria";

const categoryColumns = (
  fetchCategories: () => void
): ColumnDef<Categoria>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: ({ row }) => (
      <span>
        {row.getValue("createdAt") ? (
          new Date(row.getValue("createdAt")).toLocaleDateString()
        ) : (
          <GoQuestion className="text-red-700 h-5 w-5" />
        )}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Actualizado",
    cell: ({ row }) => (
      <span>
        {row.getValue("updatedAt") ? (
          new Date(row.getValue("updatedAt")).toLocaleDateString()
        ) : (
          <GoQuestion className="text-red-700 h-5 w-5" />
        )}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const categoria = row.original;

      const handleUpdate = async (data: { nombre: string }) => {
        return actualizarCategoria(categoria.id || "", {
          nombre: data.nombre,
          esMedicamento: categoria.esMedicamento,
          descripcion: categoria.descripcion,
        });
      };

      return (
        <div className="flex space-x-2">
          <ActualizarCategoria
            onUpdate={handleUpdate}
            initialName={categoria.nombre}
            refreshData={fetchCategories}
          />
          <GeneradorEliminar
            onDelete={async (id: string) => {
              const response = await eliminarCategoria(id);
              return { success: response.exito, error: response.error };
            }}
            id={categoria.id || ""}
            itemName={categoria.nombre}
            refreshData={fetchCategories}
          />
        </div>
      );
    },
    enableHiding: false,
  },
];

const TablaCategoria = () => {
  const [data, setData] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCategories = async () => {
    try {
      const response = await obtenerCategorias();
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <GeneradorTabla
        data={data}
        columns={categoryColumns(fetchCategories)}
        filterableColumns={["name"]}
      />
    </div>
  );
};

export default TablaCategoria;
