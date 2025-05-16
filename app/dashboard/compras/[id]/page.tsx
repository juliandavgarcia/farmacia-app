"use client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, FileText, Package, User } from "lucide-react";

import { Badge } from "@/componentes/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/componentes/ui/table";
import FacturaPDF from "@/componentes/generadores/generador-factura-pdf";

export default function DemoFactura() {
  // Datos de ejemplo para la demostración
  const datosCompra = {
    id: "123456",
    numeroFactura: "FAC-0001",
    fecha: new Date(),
    estado: "COMPLETADA",
    subtotal: 150.0,
    impuestos: 19.5,
    total: 169.5,
    proveedor: {
      nombre: "Distribuidora Farmacéutica S.A.",
      nit: "900123456-7",
      telefono: "+57 1 234 5678",
      correo: "contacto@distribuidora.com",
    },
    usuario: {
      nombre: "Juan Pérez",
      correo: "juan.perez@farmacol.com",
      rol: "ADMINISTRADOR",
    },
    detalles: [
      {
        id: "1",
        cantidad: 10,
        precioUnitario: 5.0,
        subtotal: 50.0,
        inventario: {
          numeroLote: "L001",
          fechaVencimiento: new Date(2025, 11, 31),
          producto: { nombre: "Paracetamol 500mg" },
        },
      },
      {
        id: "2",
        cantidad: 5,
        precioUnitario: 12.0,
        subtotal: 60.0,
        inventario: {
          numeroLote: "L002",
          fechaVencimiento: new Date(2026, 5, 30),
          producto: { nombre: "Amoxicilina 250mg" },
        },
      },
      {
        id: "3",
        cantidad: 2,
        precioUnitario: 20.0,
        subtotal: 40.0,
        inventario: {
          numeroLote: "L003",
          fechaVencimiento: null,
          producto: { nombre: "Termómetro Digital" },
        },
      },
    ],
  };

  // Mapear estados a colores de badge
  const estadoBadgeVariant = {
    COMPLETADA: "default",
    PENDIENTE: "outline",
    CANCELADA: "destructive",
  }[datosCompra.estado] as "default" | "outline" | "destructive" | null;

  return (
    <div className="mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalle de Compra
          </h1>
          <p className="text-muted-foreground">
            Factura #{datosCompra.numeroFactura} -{" "}
            {format(datosCompra.fecha, "PPP", { locale: es })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FacturaPDF datos={datosCompra} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información de la compra */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información de la Compra
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Número de Factura:</span>
              <span className="font-medium">{datosCompra.numeroFactura}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha:</span>
              <span className="font-medium flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {format(datosCompra.fecha, "dd/MM/yyyy HH:mm", { locale: es })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <Badge variant={estadoBadgeVariant}>{datosCompra.estado}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Información del proveedor */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Proveedor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nombre:</span>
              <span className="font-medium">
                {datosCompra.proveedor.nombre}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">NIT:</span>
              <span className="font-medium">{datosCompra.proveedor.nit}</span>
            </div>
            {datosCompra.proveedor.telefono && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teléfono:</span>
                <span className="font-medium">
                  {datosCompra.proveedor.telefono}
                </span>
              </div>
            )}
            {datosCompra.proveedor.correo && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Correo:</span>
                <span className="font-medium">
                  {datosCompra.proveedor.correo}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información del usuario */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Registrado por
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nombre:</span>
              <span className="font-medium">
                {datosCompra.usuario.nombre || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Correo:</span>
              <span className="font-medium">
                {datosCompra.usuario.correo || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rol:</span>
              <Badge variant="outline">{datosCompra.usuario.rol}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles de la compra */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Compra</CardTitle>
          <CardDescription>
            Lista de productos incluidos en esta compra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio Unitario</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datosCompra.detalles.map((detalle) => (
                <TableRow key={detalle.id}>
                  <TableCell className="font-medium">
                    {detalle.inventario.producto.nombre}
                  </TableCell>
                  <TableCell>
                    {detalle.inventario.numeroLote || "N/A"}
                  </TableCell>
                  <TableCell>
                    {detalle.inventario.fechaVencimiento
                      ? format(
                          detalle.inventario.fechaVencimiento,
                          "dd/MM/yyyy",
                          { locale: es }
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    {detalle.cantidad}
                  </TableCell>
                  <TableCell className="text-right">
                    ${Number(detalle.precioUnitario).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${Number(detalle.subtotal).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="text-right">
                  Subtotal
                </TableCell>
                <TableCell className="text-right">
                  ${Number(datosCompra.subtotal).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="text-right">
                  Impuestos
                </TableCell>
                <TableCell className="text-right">
                  ${Number(datosCompra.impuestos).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="text-right font-bold">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  ${Number(datosCompra.total).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
