/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/componentes/ui/button";
import { FileText } from "lucide-react";
import QRCode from "qrcode";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DetalleProducto {
  id: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto: { nombre: string; unidadMedida: string };
  lote?: { numeroLote: string; fechaVencimiento: Date | null };
}

interface Cliente {
  nombre: string;
  documento: string;
  telefono?: string;
  direccion?: string;
  correo?: string;
}

interface DatosFactura {
  id: string;
  numeroFactura: string;
  fecha: Date;
  estado: string;
  metodoPago: string;
  subtotal: number;
  iva: number;
  total: number;
  cliente: Cliente | null;
  detalles: DetalleProducto[];
}

interface FacturaVentaPDFProps {
  datos: DatosFactura;
  titulo?: string;
}

const FacturaVentaPDF = ({
  datos,
  titulo = "Factura de Venta",
}: FacturaVentaPDFProps) => {
  const [generando, setGenerando] = useState(false);

  // Validar si un valor es un objeto Date válido
  const esFechaValida = (fecha: any): fecha is Date =>
    fecha instanceof Date && !isNaN(fecha.getTime());

  const generarPDF = async () => {
    setGenerando(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const colMid = pageWidth / 2;
      const fechaGeneracion = new Date().toLocaleString("es-ES");

      const qrCodeDataURL = await QRCode.toDataURL(
        JSON.stringify({
          factura: datos.numeroFactura,
          fecha: datos.fecha,
          cliente: datos.cliente?.nombre || "Cliente General",
          total: datos.total,
          id: datos.id,
        })
      );

      const agregarTexto = (
        texto: string,
        x: number,
        y: number,
        negrita = false,
        tamaño = 10
      ) => {
        doc.setFont("helvetica", negrita ? "bold" : "normal");
        doc.setFontSize(tamaño);
        doc.text(texto, x, y);
      };

      const formatearFecha = (fecha: Date | null | undefined): string => {
        return fecha != null && esFechaValida(fecha)
          ? format(fecha, "dd/MM/yyyy", { locale: es })
          : "N/A";
      };

      const encabezado = () => {
        agregarTexto("Farmacol", margin, 20, true, 18);
        agregarTexto(titulo, pageWidth / 2, 20, false, 16);
        agregarTexto(
          `Generado: ${fechaGeneracion}`,
          pageWidth / 2,
          26,
          false,
          9
        );
        doc.line(margin, 30, pageWidth - margin, 30);
        doc.addImage(qrCodeDataURL, "PNG", pageWidth - margin - 25, 10, 25, 25);

        doc.roundedRect(margin, 35, pageWidth - margin * 2, 45, 2, 2, "FD");
        doc.line(colMid, 35, colMid, 80);

        agregarTexto("FACTURA:", margin + 5, 45, true);
        agregarTexto(`#${datos.numeroFactura}`, margin + 35, 45);
        agregarTexto("FECHA:", margin + 5, 53, true);

        // Aquí validamos la fecha para evitar el error
        const fechaFormateada = esFechaValida(datos.fecha)
          ? format(datos.fecha, "dd/MM/yyyy", { locale: es })
          : "N/A";
        agregarTexto(fechaFormateada, margin + 35, 53);

        agregarTexto("ESTADO:", margin + 5, 61, true);
        agregarTexto(datos.estado, margin + 35, 61);
        agregarTexto("MÉTODO DE PAGO:", margin + 5, 69, true);
        agregarTexto(datos.metodoPago, margin + 45, 69);

        agregarTexto("CLIENTE:", colMid + 5, 45, true);
        if (datos.cliente) {
          agregarTexto(datos.cliente.nombre, colMid + 5, 53);
          agregarTexto(`Documento: ${datos.cliente.documento}`, colMid + 5, 61);
          if (datos.cliente.telefono)
            agregarTexto(`Tel: ${datos.cliente.telefono}`, colMid + 5, 69);
        } else {
          agregarTexto("Cliente General", colMid + 5, 53);
        }

        doc.line(margin, 85, pageWidth - margin, 85);
      };

      const pieDePagina = () => {
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageNumber = doc.getNumberOfPages();
        doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
        agregarTexto(
          "Calle Ficticia 123, Ciudad, País",
          margin,
          pageHeight - 15,
          false,
          8
        );
        agregarTexto(
          "contacto@farmacol.com | +123 456 7890",
          margin,
          pageHeight - 10,
          false,
          8
        );
        agregarTexto(
          `Página ${pageNumber}`,
          pageWidth - margin,
          pageHeight - 10,
          false,
          8
        );
      };

      const cuerpoTabla = (datos.detalles ?? []).map((d) => [
        d.producto.nombre,
        d.lote?.numeroLote || "Sin lote",
        formatearFecha(d.lote?.fechaVencimiento),
        `${d.cantidad} ${d.producto.unidadMedida}`,
        `$${d.precioUnitario}`,
        `$${d.subtotal}`,
      ]);

      autoTable(doc, {
        startY: 90,
        head: [
          [
            "Producto",
            "Lote",
            "Vencimiento",
            "Cantidad",
            "Precio Unit.",
            "Subtotal",
          ],
        ],
        body: cuerpoTabla,
        margin: { left: margin, right: margin },
        styles: { fontSize: 9, cellPadding: 3 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          3: { halign: "center" },
          4: { halign: "right" },
          5: { halign: "right" },
        },
        didDrawPage: () => {
          encabezado();
          pieDePagina();
        },
        foot: [
          [
            { content: "", colSpan: 4 },
            {
              content: "Subtotal:",
              styles: { halign: "right", fontStyle: "bold" },
            },
            {
              content: `$${datos.subtotal}`,
              styles: { halign: "right" },
            },
          ],
          [
            { content: "", colSpan: 4 },
            {
              content: "IVA (19%):",
              styles: { halign: "right", fontStyle: "bold" },
            },
            {
              content: `$${datos.iva}`,
              styles: { halign: "right" },
            },
          ],
          [
            { content: "", colSpan: 4 },
            {
              content: "TOTAL:",
              styles: { halign: "right", fontStyle: "bold" },
            },
            {
              content: `$${datos.total}`,
              styles: { halign: "right", fontStyle: "bold" },
            },
          ],
        ],
      });

      const finalY = (doc as any).lastAutoTable.finalY || 120;
      doc.line(margin, finalY + 5, pageWidth - margin, finalY + 5);
      agregarTexto("Notas:", margin, finalY + 15, true);
      agregarTexto(
        "Este documento es un comprobante oficial de venta.",
        margin + 20,
        finalY + 15
      );
      agregarTexto("Gracias por su compra.", margin + 20, finalY + 22);

      doc.save(`Factura-${datos.numeroFactura}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF:", err);
    } finally {
      setGenerando(false);
    }
  };

  return (
    <Button
      onClick={generarPDF}
      disabled={generando}
      className="w-full bg-green-600 hover:bg-green-700"
    >
      {generando ? (
        "Generando..."
      ) : (
        <>
          <FileText className="h-4 w-4 mr-2" />
          Descargar Factura PDF
        </>
      )}
    </Button>
  );
};

export default FacturaVentaPDF;
