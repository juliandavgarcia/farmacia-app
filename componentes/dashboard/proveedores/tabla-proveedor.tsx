"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import GeneradorEliminar from "@/componentes/generadores/generador-eliminar";
import { GeneradorTabla } from "@/componentes/generadores/generador-tabla";
import GeneradorExcel from "@/componentes/generadores/generador-excel";

import {
  obtenerProveedores,
  actualizarProveedor,
  eliminarProveedor,
} from "@/logica/acciones/acciones-proveedor";
import { Proveedor } from "@/logica/esquemas/proveedor";

import ActualizarProveedor from "./actualizar-proveedor";

const proveedorColumns = (
  fetchProveedores: () => void
): ColumnDef<Proveedor>[] => [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("nombre")}</span>
    ),
  },
  {
    accessorKey: "contacto",
    header: "Contacto",
    cell: ({ row }) => {
      const contacto: string = row.getValue("contacto") as string;
      return <span>{contacto || "Sin contacto"}</span>;
    },
  },
  {
    accessorKey: "correo",
    header: "Correo Electrónico",
    cell: ({ row }) => {
      const correo: string = row.getValue("correo") as string;
      return <span>{correo}</span>;
    },
  },
  {
    accessorKey: "nit",
    header: "NIT",
    cell: ({ row }) => {
      const nit: string = row.getValue("nit") as string;
      return <span>{nit}</span>;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const proveedor = row.original;

      const handleUpdate = async (data: {
        nombre: string;
        contacto: string;
        nit: string;
      }) => {
        return actualizarProveedor(proveedor.id || "", {
          nombre: data.nombre,
          contacto: data.contacto,
          nit: data.nit,
        });
      };

      return (
        <div className="flex space-x-2">
          <ActualizarProveedor
            onUpdate={handleUpdate}
            initialName={proveedor.nombre}
            initialContacto={proveedor.contacto || ""}
            initialCorreo={proveedor.correo || ""}
            initialNit={proveedor.nit}
            refreshData={fetchProveedores}
          />
          <GeneradorEliminar
            onDelete={async (id: string) => {
              const response = await eliminarProveedor(id);
              return { success: response.exito, error: response.error };
            }}
            id={proveedor.id || ""}
            itemName={proveedor.nombre}
            refreshData={fetchProveedores}
          />
        </div>
      );
    },
    enableHiding: false,
  },
];

const TablaProveedor = () => {
  const [data, setData] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProveedores = async () => {
    try {
      const response = await obtenerProveedores();
      if (response?.data && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        console.error("Formato inesperado en la respuesta:", response);
        setData([]);
      }
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const columnasExcel = [
    { key: "nombre", header: "Nombre" },
    { key: "contacto", header: "Contacto" },
  ];

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <GeneradorTabla
        data={data}
        columns={proveedorColumns(fetchProveedores)}
        filterableColumns={["nombre"]}
      />

      <GeneradorExcel
        data={data}
        columns={columnasExcel}
        fileName="proveedores"
        headerTitle="Listado de Proveedores"
      />
    </div>
  );
};

export default TablaProveedor;
