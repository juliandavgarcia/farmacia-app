"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/componentes/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps<T> {
  data: T[];
  columns: { key: string; header: string }[];
  fileName?: string;
  headerTitle?: string;
}

const GeneradorPDF = <T,>({
  data,
  columns,
  fileName = "data",
  headerTitle = "",
}: ExportButtonProps<T>) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    const empresaNombre = "Farmacol";
    const empresaDireccion = "Calle Ficticia 123, Ciudad, País";
    const empresaContacto = "contacto@farmacol.com | +123 456 7890";

    const fechaGeneracion = new Date().toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const addHeader = () => {
      doc.setFontSize(12);
      doc.text(empresaNombre, margin, 15);

      doc.setFontSize(10);
      doc.text(headerTitle || "Reporte", pageWidth / 2, 15, {
        align: "center",
      });

      doc.setFontSize(8);
      doc.text(`Fecha de generación: ${fechaGeneracion}`, pageWidth / 2, 20, {
        align: "center",
      });
    };

    const addFooter = () => {
      const pageNumber = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(empresaDireccion, margin, pageHeight - 15);
      doc.text(empresaContacto, margin, pageHeight - 10);
      doc.text(`Página ${pageNumber}`, pageWidth - margin, pageHeight - 10, {
        align: "right",
      });
    };

    const tableHead = ["N°", ...columns.map((col) => col.header)];

    const tableBody = data.map((item, index) => [
      (index + 1).toString(),
      ...columns.map((col) => {
        const value = item[col.key as keyof T];
        return value !== undefined && value !== null ? value.toString() : "";
      }),
    ]);

    autoTable(doc, {
      head: [tableHead],
      body: tableBody,
      startY: 30,
      margin: { top: 35 },
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: 255,
        halign: "center",
      },
      didDrawPage: () => {
        addHeader();
        addFooter();
      },
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <Button onClick={exportToPDF} variant="destructive" className="mt-4">
      <Download className="h-4 w-4" />
      Exportar a PDF
    </Button>
  );
};

export default GeneradorPDF;
