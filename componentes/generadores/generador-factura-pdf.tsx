/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/componentes/ui/button";
import { FileText } from "lucide-react";
import QRCode from "qrcode";

interface DetalleProducto {
  id: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  inventario: {
    numeroLote: string;
    fechaVencimiento: Date | null;
    producto: {
      nombre: string;
    };
  };
}

interface Proveedor {
  nombre: string;
  nit: string;
}

interface Usuario {
  nombre: string;
  correo: string;
  rol: string;
}

interface DatosFactura {
  id: string;
  numeroFactura: string;
  fecha: Date;
  estado: string;
  subtotal: number;
  impuestos: number;
  total: number;
  proveedor: Proveedor;
  usuario: Usuario;
  detalles: DetalleProducto[];
}

interface FacturaPDFProps {
  datos: DatosFactura;
  titulo?: string;
}

const FacturaPDF = ({
  datos,
  titulo = "Factura de Compra",
}: FacturaPDFProps) => {
  const [generando, setGenerando] = useState(false);

  const generarPDF = async () => {
    try {
      setGenerando(true);

      // Crear documento PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15; // Aumentamos el margen para mejor espaciado

      // Datos de la empresa
      const empresaNombre = "Farmacol";
      const empresaDireccion = "Calle Ficticia 123, Ciudad, País";
      const empresaContacto = "contacto@farmacol.com | +123 456 7890";

      // Fecha de generación
      const fechaGeneracion = new Date().toLocaleString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Generar QR code con los datos de la factura
      const qrData = JSON.stringify({
        factura: datos.numeroFactura,
        fecha: datos.fecha,
        proveedor: datos.proveedor.nombre,
        total: datos.total,
        id: datos.id,
      });

      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 100,
        margin: 1,
      });

      // Función para agregar encabezado
      const agregarEncabezado = () => {
        // Logo o título de la empresa (izquierda)
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(empresaNombre, margin, 20);

        // Título del documento (centrado)
        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.text(titulo, pageWidth / 2, 20, { align: "center" });

        // Fecha de generación (centrado y debajo del título)
        doc.setFontSize(9);
        doc.text(`Generado: ${fechaGeneracion}`, pageWidth / 2, 26, {
          align: "center",
        });

        // Agregar línea divisoria horizontal
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, 30, pageWidth - margin, 30);

        // Información principal en formato de tabla estructurada
        const infoY = 40;
        const colMid = pageWidth / 2;

        // Crear un rectángulo para la información de la factura
        doc.setDrawColor(220, 220, 220);
        doc.setFillColor(252, 252, 252);
        doc.roundedRect(
          margin,
          infoY - 5,
          pageWidth - margin * 2,
          45,
          2,
          2,
          "FD"
        );

        // Línea divisoria vertical
        doc.setDrawColor(220, 220, 220);
        doc.line(colMid, infoY - 5, colMid, infoY + 40);

        // Columna izquierda - Información de factura
        doc.setFontSize(10);

        // FACTURA
        doc.setFont("helvetica", "bold");
        doc.text("FACTURA:", margin + 5, infoY + 5);
        doc.setFont("helvetica", "normal");
        doc.text(`#${datos.numeroFactura}`, margin + 35, infoY + 5);

        // FECHA
        doc.setFont("helvetica", "bold");
        doc.text("FECHA:", margin + 5, infoY + 15);
        doc.setFont("helvetica", "normal");
        doc.text(
          new Date(datos.fecha).toLocaleDateString("es-ES"),
          margin + 35,
          infoY + 15
        );

        // ESTADO
        doc.setFont("helvetica", "bold");
        doc.text("ESTADO:", margin + 5, infoY + 25);
        doc.setFont("helvetica", "normal");
        doc.text(datos.estado, margin + 35, infoY + 25);

        // PROVEEDOR
        doc.setFont("helvetica", "bold");
        doc.text("PROVEEDOR:", margin + 5, infoY + 35);
        doc.setFont("helvetica", "normal");
        doc.text(datos.proveedor.nombre, margin + 35, infoY + 35);

        // Columna derecha - Usuario registrador
        doc.setFont("helvetica", "bold");
        doc.text("REGISTRADO POR:", colMid + 5, infoY + 5);
        doc.setFont("helvetica", "normal");
        doc.text(datos.usuario.nombre, colMid + 5, infoY + 15);
        doc.text(datos.usuario.correo, colMid + 5, infoY + 25);
        doc.text(`Rol: ${datos.usuario.rol}`, colMid + 5, infoY + 35);

        // Agregar código QR (esquina superior derecha)
        doc.addImage(qrCodeDataURL, "PNG", pageWidth - margin - 25, 10, 25, 25);

        // Agregar línea divisoria antes de la tabla
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, infoY + 55, pageWidth - margin, infoY + 55);
      };

      // Función para agregar pie de página
      const agregarPieDePagina = () => {
        const pageNumber = doc.getNumberOfPages();

        // Agregar línea divisoria
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

        // Información de contacto
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(empresaDireccion, margin, pageHeight - 15);
        doc.text(empresaContacto, margin, pageHeight - 10);

        // Número de página
        doc.text(`Página ${pageNumber}`, pageWidth - margin, pageHeight - 10, {
          align: "right",
        });
      };

      // Agregar encabezado
      agregarEncabezado();

      // Preparar datos para la tabla
      const encabezadosTabla = [
        "Producto",
        "Lote",
        "Vencimiento",
        "Cantidad",
        "Precio Unit.",
        "Subtotal",
      ];

      const cuerpoTabla = datos.detalles.map((detalle) => [
        detalle.inventario.producto.nombre,
        detalle.inventario.numeroLote || "N/A",
        detalle.inventario.fechaVencimiento
          ? new Date(detalle.inventario.fechaVencimiento).toLocaleDateString(
              "es-ES"
            )
          : "N/A",
        detalle.cantidad.toString(),
        `$${Number(detalle.precioUnitario).toFixed(2)}`,
        `$${Number(detalle.subtotal).toFixed(2)}`,
      ]);

      // Configuración mejorada para la tabla
      autoTable(doc, {
        head: [encabezadosTabla],
        body: cuerpoTabla,
        startY: 100, // Actualizado para dar más espacio al encabezado
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        headStyles: {
          fillColor: [41, 128, 185], // Azul más profesional
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
        },
        columnStyles: {
          0: { cellWidth: "auto" },
          3: { halign: "center" },
          4: { halign: "right" },
          5: { halign: "right" },
        },
        didDrawPage: () => {
          agregarEncabezado();
          agregarPieDePagina();
        },
        foot: [
          [
            { content: "", colSpan: 4 },
            {
              content: "Subtotal:",
              styles: { halign: "right", fontStyle: "bold" },
            },
            {
              content: `$${Number(datos.subtotal).toFixed(2)}`,
              styles: { halign: "right" },
            },
          ],
          [
            { content: "", colSpan: 4 },
            {
              content: "Impuestos:",
              styles: { halign: "right", fontStyle: "bold" },
            },
            {
              content: `$${Number(datos.impuestos).toFixed(2)}`,
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
              content: `$${Number(datos.total).toFixed(2)}`,
              styles: { halign: "right", fontStyle: "bold" },
            },
          ],
        ],
      });

      // Agregar información adicional en un formato más profesional
      const finalY = (doc as any).lastAutoTable.finalY || 120;

      // Agregar línea divisoria antes de las notas
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, finalY + 5, pageWidth - margin, finalY + 5);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Notas:", margin, finalY + 15);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Este documento es un comprobante oficial de compra.",
        margin + 20,
        finalY + 15
      );
      doc.text(
        "Para cualquier consulta, por favor contacte con nuestro departamento de compras.",
        margin + 20,
        finalY + 22
      );

      // Guardar el PDF
      doc.save(`Factura-${datos.numeroFactura}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
    } finally {
      setGenerando(false);
    }
  };

  return (
    <Button onClick={generarPDF} disabled={generando} variant="green">
      {generando ? (
        "Generando..."
      ) : (
        <>
          <FileText className="h-4 w-4" />
          Generar Factura PDF
        </>
      )}
    </Button>
  );
};

export default FacturaPDF;
