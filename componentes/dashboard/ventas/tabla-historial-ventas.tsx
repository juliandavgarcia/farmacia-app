/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { GeneradorTabla } from "@/componentes/generadores/generador-tabla";
import { Button } from "@/componentes/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/componentes/ui/dropdown-menu";
import { obtenerHistorialVentas } from "@/logica/acciones/acciones-venta";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type HistorialVenta = {
  id: string;
  numeroFactura: string;
  fecha: string;
  cliente: string;
  total: number;
};

// Definición de columnas
const historialVentaColumns: ColumnDef<HistorialVenta>[] = [
  {
    accessorKey: "numeroFactura",
    header: "Factura",
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("numeroFactura")}</span>
    ),
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => {
      const fecha = new Date(row.getValue("fecha"));
      return <span>{fecha.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
    cell: ({ row }) => <span>{row.getValue("cliente")}</span>,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = row.getValue("total");
      return <span>${Number(total).toFixed(2)}</span>;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const router = useRouter();
      const venta = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/ventas/${venta.id}`)}
            >
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.print()}>
              Imprimir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
  },
];

const TablaHistorialVentas = () => {
  const [data, setData] = useState<HistorialVenta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistorial = async () => {
    try {
      const response = await obtenerHistorialVentas();
      if (response.datos) {
        setData(response.datos);
      }
    } catch (error) {
      console.error("Error al obtener historial de ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  if (loading) return <div>Cargando historial de ventas...</div>;

  return (
    <div>
      <GeneradorTabla
        data={data}
        columns={historialVentaColumns}
        filterableColumns={["numeroFactura", "cliente"]}
      />
    </div>
  );
};

export default TablaHistorialVentas;
