"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/componentes/ui/button";
import { Download } from "lucide-react";

/**
 * Props para el componente GeneradorPDF.
 * @template T Tipo genérico de los datos a exportar.
 */
interface ExportButtonProps<T> {
  data: T[]; // Datos a exportar
  columns: { key: string; header: string }[]; // Columnas a mostrar (clave y encabezado)
  fileName?: string; // Nombre del archivo PDF
  headerTitle?: string; // Título del reporte
}

/**
 * Componente que genera y descarga un archivo PDF a partir de una tabla de datos.
 * Utiliza jsPDF y autoTable para la generación.
 */
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

    // Información fija de la empresa
    const empresaNombre = "Farmacol";
    const empresaDireccion = "Calle Ficticia 123, Ciudad, País";
    const empresaContacto = "contacto@farmacol.com | +123 456 7890";

    // Fecha y hora actual para el reporte
    const fechaGeneracion = new Date().toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    /**
     * Agrega un encabezado con el nombre de la empresa, el título del reporte y la fecha.
     */
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

    /**
     * Agrega un pie de página con información de contacto y número de página.
     */
    const addFooter = () => {
      const pageNumber = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(empresaDireccion, margin, pageHeight - 15);
      doc.text(empresaContacto, margin, pageHeight - 10);
      doc.text(`Página ${pageNumber}`, pageWidth - margin, pageHeight - 10, {
        align: "right",
      });
    };

    // Cabecera de la tabla con numeración
    const tableHead = ["N°", ...columns.map((col) => col.header)];

    // Cuerpo de la tabla con datos
    const tableBody = data.map((item, index) => [
      (index + 1).toString(),
      ...columns.map((col) => {
        const value = item[col.key as keyof T];
        return value !== undefined && value !== null ? value.toString() : "";
      }),
    ]);

    // Generación de la tabla usando autoTable
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

    // Descarga el archivo PDF
    doc.save(`${fileName}.pdf`);
  };

  // Botón que dispara la generación del PDF
  return (
    <Button onClick={exportToPDF} variant="destructive" className="mt-4">
      <Download className="h-4 w-4" />
      Exportar a PDF
    </Button>
  );
};

export default GeneradorPDF;
