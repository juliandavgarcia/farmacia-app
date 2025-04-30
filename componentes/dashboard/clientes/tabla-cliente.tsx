"use client";

import GeneradorEliminar from "@/componentes/generadores/generador-eliminar";
import { GeneradorTabla } from "@/componentes/generadores/generador-tabla";
import {
  actualizarCliente,
  eliminarCliente,
  obtenerClientes,
} from "@/logica/acciones/acciones-cliente";
import { Cliente } from "@/logica/esquemas/cliente";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import GeneradorExcel from "@/componentes/generadores/generador-excel";
import ActualizarCliente from "./actualizar-cliente";

const clienteColumns = (fetchClientes: () => void): ColumnDef<Cliente>[] => [
  {
    accessorKey: "documento",
    header: "Documento",
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("documento")}</span>
    ),
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
  },
  {
    accessorKey: "direccion",
    header: "Dirección",
    cell: ({ row }) => {
      const direccion: string = row.getValue("direccion") as string;
      return <span>{direccion || "No registrada"}</span>;
    },
  },
  {
    accessorKey: "correo",
    header: "Correo",
    cell: ({ row }) => {
      const correo: string = row.getValue("correo") as string;
      return <span>{correo || "No registrado"}</span>;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const cliente = row.original;

      const handleUpdate = async (data: {
        documento: string;
        nombre: string;
        telefono: string;
        direccion?: string;
        correo?: string;
      }) => {
        return actualizarCliente(cliente.id || "", data);
      };

      return (
        <div className="flex space-x-2">
          <ActualizarCliente
            onUpdate={handleUpdate}
            initialValues={{
              documento: cliente.documento,
              nombre: cliente.nombre,
              telefono: cliente.telefono || "",
              direccion: cliente.direccion || "",
              correo: cliente.correo || "",
            }}
            refreshData={fetchClientes}
          />
          <GeneradorEliminar
            onDelete={async (id: string) => {
              const response = await eliminarCliente(id);
              return { success: response.exito, error: response.error };
            }}
            id={cliente.id || ""}
            itemName={cliente.nombre}
            refreshData={fetchClientes}
          />
        </div>
      );
    },
    enableHiding: false,
  },
];

const TablaCliente = () => {
  const [data, setData] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchClientes = async () => {
    try {
      const response = await obtenerClientes();
      if (response && Array.isArray(response)) {
        setData(response);
      } else if (response && response.datos) {
        setData(response.datos);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const columnasExcel = [
    { key: "documento", header: "Documento" },
    { key: "nombre", header: "Nombre" },
    { key: "telefono", header: "Teléfono" },
    { key: "direccion", header: "Dirección" },
    { key: "correo", header: "Correo" },
  ];

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <GeneradorTabla
        data={data}
        columns={clienteColumns(fetchClientes)}
        filterableColumns={["nombre", "documento"]}
      />

      <GeneradorExcel
        data={data}
        columns={columnasExcel}
        fileName="clientes"
        headerTitle="Listado de Clientes"
      />
    </div>
  );
};

export default TablaCliente;
