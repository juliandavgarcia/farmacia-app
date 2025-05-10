import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, CreditCard, FileText, User, Users } from "lucide-react";

import { Badge } from "@/componentes/ui/badge";
import { Button } from "@/componentes/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { prisma } from "@/lib/db";

interface DetalleVentaPageProps {
  params: {
    id: string;
  };
}

async function getVenta(id: string) {
  if (id === "test") {
    return {
      id: "test",
      numeroFactura: "TEST-0001",
      fecha: new Date(),
      estado: "COMPLETADA",
      metodoPago: "Efectivo",
      subtotal: 100,
      iva: 19,
      total: 119,
      cliente: {
        nombre: "Cliente Test",
        documento: "00000000",
        telefono: null,
        correo: null,
      },
      usuario: {
        nombre: "Usuario Test",
        correo: "test@correo.com",
        rol: "ADMIN",
      },
      detalles: [
        {
          id: "1",
          cantidad: 2,
          precioUnitario: 50,
          subtotal: 100,
          inventario: {
            numeroLote: "LT-001",
            producto: {
              nombre: "Producto Test",
            },
          },
        },
      ],
    };
  }

  return await prisma.venta.findUnique({
    where: { id },
    include: {
      cliente: true,
      usuario: true,
      detalles: {
        include: {
          inventario: {
            include: {
              producto: true,
            },
          },
        },
      },
    },
  });
}

export default async function DetalleVentaPage({
  params,
}: DetalleVentaPageProps) {
  const venta = await getVenta(params.id);

  if (!venta) {
    notFound();
  }

  // Mapear estados a colores de badge
  const estadoBadgeVariant = {
    COMPLETADA: "outline", // Map "success" to a supported variant
    ANULADA: "destructive",
  }[venta.estado] as "default" | "destructive" | "outline" | "secondary";

  // Mapear métodos de pago a nombres más amigables
  const metodoPagoLabel =
    {
      Efectivo: "Efectivo",
      Tarjeta: "Tarjeta de crédito/débito",
    }[venta.metodoPago] || venta.metodoPago;

  return (
    <div className="mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalle de Venta
          </h1>
          <p className="text-muted-foreground">
            Factura #{venta.numeroFactura} -{" "}
            {format(venta.fecha, "PPP", { locale: es })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información de la venta */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información de la Venta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Número de Factura:</span>
              <span className="font-medium">{venta.numeroFactura}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha:</span>
              <span className="font-medium flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {format(venta.fecha, "dd/MM/yyyy HH:mm", { locale: es })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <Badge variant={estadoBadgeVariant}>{venta.estado}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Método de Pago:</span>
              <span className="font-medium flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                {metodoPagoLabel}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Información del cliente */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {venta.cliente ? (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre:</span>
                  <span className="font-medium">{venta.cliente.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documento:</span>
                  <span className="font-medium">{venta.cliente.documento}</span>
                </div>
                {venta.cliente.telefono && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Teléfono:</span>
                    <span className="font-medium">
                      {venta.cliente.telefono}
                    </span>
                  </div>
                )}
                {venta.cliente.correo && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Correo:</span>
                    <span className="font-medium">{venta.cliente.correo}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-muted-foreground italic">
                Cliente no registrado
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
                {venta.usuario.nombre || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Correo:</span>
              <span className="font-medium">
                {venta.usuario.correo || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rol:</span>
              <Badge variant="outline">{venta.usuario.rol}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles de la venta */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Venta</CardTitle>
          <CardDescription>
            Lista de productos incluidos en esta venta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio Unitario</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venta.detalles.map((detalle) => (
                <TableRow key={detalle.id}>
                  <TableCell className="font-medium">
                    {detalle.inventario.producto.nombre}
                  </TableCell>
                  <TableCell>
                    {detalle.inventario.numeroLote || "N/A"}
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
                <TableCell colSpan={4} className="text-right">
                  Subtotal
                </TableCell>
                <TableCell className="text-right">
                  ${Number(venta.subtotal).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} className="text-right">
                  IVA
                </TableCell>
                <TableCell className="text-right">
                  ${Number(venta.iva).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} className="text-right font-bold">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  ${Number(venta.total).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            Volver a Ventas
          </Button>
          {venta.estado === "COMPLETADA" && (
            <Button variant="outline" size="sm" className="text-destructive">
              Anular Venta
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
