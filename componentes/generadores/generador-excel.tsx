"use client";

import * as XLSX from "xlsx";
import { Button } from "@/componentes/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps<T> {
  data: T[];
  columns: { key: string; header: string }[];
  fileName?: string;
  headerTitle?: string;
}

const GeneradorExcel = <T,>({
  data,
  columns,
  fileName = "data",
  headerTitle = "",
}: ExportButtonProps<T>) => {
  const exportToExcel = () => {
    const wsData = [
      headerTitle ? [headerTitle] : [], // Agregar título si está presente
      columns.map((col) => col.header),
      ...data.map((item) => columns.map((col) => item[col.key as keyof T])), // Datos
    ].filter((row) => row.length > 0); // Eliminar filas vacías

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Aplicar estilos
    const range = XLSX.utils.decode_range(ws["!ref"]!);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { bold: true },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
    }

    if (headerTitle) {
      const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
      ws[titleCell].s = {
        font: { bold: true, sz: 14 },
        alignment: { horizontal: "center" },
      };
    }

    // Calcular el ancho de las columnas
    const colWidths = columns.map((col) => {
      const headerLength = col.header.length;
      const maxDataLength = Math.max(
        ...data.map((item) => {
          const value = item[col.key as keyof T];
          return value ? value.toString().length : 0;
        })
      );
      return { wch: Math.max(headerLength, maxDataLength) + 2 }; // +2 para un poco de padding
    });

    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, fileName);

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <Button onClick={exportToExcel} variant="green" className="mt-4">
      <Download className="h-4 w-4" />
      Exportar a Excel
    </Button>
  );
};

export default GeneradorExcel;
