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
import ActualizarCategoria from "./actualizar-categoria";
import GeneradorExcel from "@/componentes/generadores/generador-excel";

const categoryColumns = (
  fetchCategories: () => void
): ColumnDef<Categoria>[] => [
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
      return <span>{descripcion ? descripcion : "No hay descripción"}</span>;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const categoria = row.original;

      const handleUpdate = async (data: {
        nombre: string;
        descripcion: string;
      }) => {
        return actualizarCategoria(categoria.id || "", {
          nombre: data.nombre,
          descripcion: data.descripcion,
        });
      };

      return (
        <div className="flex space-x-2">
          <ActualizarCategoria
            onUpdate={handleUpdate}
            initialName={categoria.nombre}
            initialDescription={categoria.descripcion || ""}
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
      if (response && Array.isArray(response)) {
        setData(response);
      } else if (response && response.data) {
        setData(response.data);
      } else if (response) {
        setData(response.data);
      } else {
        console.error("Unexpected response format:", response);
        setData([]);
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columnasExcel = [
    { key: "nombre", header: "Nombre" },
    { key: "descripcion", header: "Descripción" },
  ];

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <GeneradorTabla
        data={data}
        columns={categoryColumns(fetchCategories)}
        filterableColumns={["nombre"]}
      />

      <GeneradorExcel
        data={data}
        columns={columnasExcel}
        fileName="categorias"
        headerTitle="Listado de Categorías"
      />
    </div>
  );
};

export default TablaCategoria;
