/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import GeneradorExcel from "@/componentes/generadores/generador-excel";
import GeneradorPDF from "@/componentes/generadores/generador-pdf";
import { GeneradorTabla } from "@/componentes/generadores/generador-tabla";
import { Button } from "@/componentes/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/componentes/ui/dropdown-menu";
import { obtenerHistorialCompras } from "@/logica/acciones/acciones-compra";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type HistorialCompra = {
  id: string;
  numeroFactura: string;
  fecha: string;
  proveedor: string;
  total: number;
};

// Definición de columnas
const historialCompraColumns: ColumnDef<HistorialCompra>[] = [
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
    accessorKey: "proveedor",
    header: "Proveedor",
    cell: ({ row }) => <span>{row.getValue("proveedor")}</span>,
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
      const compra = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/compras/${compra.id}`)}
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

const TablaHistorialCompras = () => {
  const [data, setData] = useState<HistorialCompra[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistorial = async () => {
    try {
      const response = await obtenerHistorialCompras();
      if (response.datos) {
        setData(response.datos);
      }
    } catch (error) {
      console.error("Error al obtener historial de compras:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  const excelColumns = [
    { key: "numeroFactura", header: "Factura" },
    { key: "fecha", header: "Fecha" },
    { key: "proveedor", header: "Proveedor" },
    { key: "total", header: "Total" },
  ];

  if (loading) return <div>Cargando historial de compras...</div>;

  return (
    <div>
      <GeneradorTabla
        data={data}
        columns={historialCompraColumns}
        filterableColumns={["numeroFactura", "proveedor"]}
      />
      <div className="flex space-x-2">
        <GeneradorExcel
          data={data}
          columns={excelColumns}
          fileName="historial_compras"
          headerTitle="Historial de Compras"
        />
        <GeneradorPDF
          data={data}
          columns={excelColumns}
          fileName="historial_compras"
          headerTitle="Historial de Compras"
        />
      </div>
    </div>
  );
};

export default TablaHistorialCompras;
