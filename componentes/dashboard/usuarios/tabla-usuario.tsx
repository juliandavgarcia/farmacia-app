"use client";

import GeneradorEliminar from "@/componentes/generadores/generador-eliminar";
import { GeneradorTabla } from "@/componentes/generadores/generador-tabla";
import { Usuario } from "@/logica/esquemas/usuario";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import GeneradorExcel from "@/componentes/generadores/generador-excel";
import GeneradorPDF from "@/componentes/generadores/generador-pdf";
import ActualizarUsuario from "./actualizar-usuario";
import {
  manejadorActualizarUsuario,
  manejadorEliminarUsuario,
  obtenerUsuarios,
} from "@/logica/acciones/acciones-usuario";

const usuarioColumns = (fetchUsuarios: () => void): ColumnDef<Usuario>[] => [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "correo",
    header: "Correo",
  },
  {
    accessorKey: "rol",
    header: "Rol",
    cell: ({ row }) => {
      const rol = row.getValue("rol") as string;
      return rol === "ADMIN" ? "Administrador" : "Usuario";
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado") as boolean;
      return estado ? "Activo" : "Inactivo";
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const usuario = row.original;

      const handleUpdate = async (data: {
        nombre: string;
        correo: string;
        rol: "ADMIN" | "USER";
        estado: boolean;
      }) => {
        return manejadorActualizarUsuario(usuario.id || "", data);
      };

      return (
        <div className="flex space-x-2">
          <ActualizarUsuario
            onUpdate={handleUpdate}
            initialValues={{
              nombre: usuario.nombre,
              correo: usuario.correo,
              rol: usuario.rol,
              estado: usuario.estado ?? true,
            }}
            refreshData={fetchUsuarios}
          />
          <GeneradorEliminar
            onDelete={async (id: string) => {
              const response = await manejadorEliminarUsuario(id);
              return { success: response.exito, error: response.error };
            }}
            id={usuario.id || ""}
            itemName={usuario.nombre}
            refreshData={fetchUsuarios}
          />
        </div>
      );
    },
    enableHiding: false,
  },
];

const TablaUsuario = () => {
  const [data, setData] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsuarios = async () => {
    try {
      const response = await obtenerUsuarios();
      if (response && Array.isArray(response)) {
        setData(response);
      } else if (response && response.datos) {
        setData(response.datos);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const columnasExcel = [
    { key: "nombre", header: "Nombre" },
    { key: "correo", header: "Correo" },
    { key: "rol", header: "Rol" },
    { key: "estado", header: "Estado" },
  ];

  const columnasPDF = [
    { key: "nombre", header: "Nombre" },
    { key: "correo", header: "Correo" },
  ];

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <GeneradorTabla
        data={data}
        columns={usuarioColumns(fetchUsuarios)}
        filterableColumns={["nombre", "correo"]}
      />
      <div className="flex space-x-4">
        <GeneradorExcel
          data={data}
          columns={columnasExcel}
          fileName="usuarios"
          headerTitle="Listado de Usuarios"
        />
        <GeneradorPDF
          data={data}
          columns={columnasPDF}
          fileName="usuarios"
          headerTitle="Listado de Usuarios"
        />
      </div>
    </div>
  );
};

export default TablaUsuario;
