import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowLeft,
  CalendarIcon,
  CreditCard,
  Download,
  FileText,
  Printer,
  User,
  Users,
} from "lucide-react";

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
import Link from "next/link";

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
    COMPLETADA: "default",
    ANULADA: "destructive",
  }[venta.estado] as "default" | "destructive" | "outline" | "secondary";

  // Mapear métodos de pago a nombres más amigables
  const metodoPagoLabel =
    {
      Efectivo: "Efectivo",
      Tarjeta: "Tarjeta de crédito/débito",
    }[venta.metodoPago] || venta.metodoPago;

  return (
    <div className="mx-auto p-4 space-y-4">
      {/* Breadcrumb and header */}
      <div className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Link
            href="/ventas"
            className="flex items-center hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a Ventas
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Factura #{venta.numeroFactura}
            </h1>
            <p className="text-muted-foreground mt-1">
              {format(venta.fecha, "PPP", { locale: es })}
            </p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button variant="outline" size="sm" className="gap-1">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar PDF</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Información de la venta */}
        <Card className="overflow-hidden border-l-4 border-l-primary">
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Información de la Venta
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <dl className="space-y-4">
              <div className="flex justify-between items-center">
                <dt className="text-sm font-medium text-muted-foreground">
                  Estado:
                </dt>
                <dd>
                  <Badge
                    variant={estadoBadgeVariant}
                    className="rounded-md px-2 py-1 font-medium"
                  >
                    {venta.estado}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-sm font-medium text-muted-foreground">
                  Número de Factura:
                </dt>
                <dd className="font-medium">{venta.numeroFactura}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-sm font-medium text-muted-foreground">
                  Fecha:
                </dt>
                <dd className="font-medium flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  {format(venta.fecha, "dd/MM/yyyy HH:mm", { locale: es })}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-sm font-medium text-muted-foreground">
                  Método de Pago:
                </dt>
                <dd className="font-medium flex items-center gap-1">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  {metodoPagoLabel}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Información del cliente */}
        <Card className="overflow-hidden border-l-4 border-l-secondary">
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-secondary" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {venta.cliente ? (
              <dl className="space-y-4">
                <div className="flex justify-between items-center">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Nombre:
                  </dt>
                  <dd className="font-medium">{venta.cliente.nombre}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Documento:
                  </dt>
                  <dd className="font-medium">{venta.cliente.documento}</dd>
                </div>
                {venta.cliente.telefono && (
                  <div className="flex justify-between items-center">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Teléfono:
                    </dt>
                    <dd className="font-medium">{venta.cliente.telefono}</dd>
                  </div>
                )}
                {venta.cliente.correo && (
                  <div className="flex justify-between items-center">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Correo:
                    </dt>
                    <dd className="font-medium">{venta.cliente.correo}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <div className="text-muted-foreground italic flex items-center justify-center h-24">
                Cliente no registrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información del usuario */}
        <Card className="overflow-hidden border-l-4 border-l-muted">
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-muted-foreground" />
              Registrado por
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <dl className="space-y-4">
              <div className="flex justify-between items-center">
                <dt className="text-sm font-medium text-muted-foreground">
                  Nombre:
                </dt>
                <dd className="font-medium">{venta.usuario.nombre || "N/A"}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-sm font-medium text-muted-foreground">
                  Correo:
                </dt>
                <dd className="font-medium">{venta.usuario.correo || "N/A"}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-sm font-medium text-muted-foreground">
                  Rol:
                </dt>
                <dd>
                  <Badge variant="outline" className="rounded-md px-2 py-1">
                    {venta.usuario.rol}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Detalles de la venta */}
      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/30">
          <CardTitle>Detalles de la Venta</CardTitle>
          <CardDescription>
            Lista de productos incluidos en esta venta
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Producto</TableHead>
                  <TableHead className="font-semibold">Lote</TableHead>
                  <TableHead className="text-right font-semibold">
                    Cantidad
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Precio Unitario
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Subtotal
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venta.detalles.map((detalle, index) => (
                  <TableRow
                    key={detalle.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}
                  >
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
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableCell colSpan={4} className="text-right">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right">
                    ${Number(venta.subtotal).toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableCell colSpan={4} className="text-right">
                    IVA
                  </TableCell>
                  <TableCell className="text-right">
                    ${Number(venta.iva).toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-primary/5 hover:bg-primary/5">
                  <TableCell
                    colSpan={4}
                    className="text-right font-bold text-lg"
                  >
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    ${Number(venta.total).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 py-6 bg-muted/10">
          <Link href="/ventas">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Ventas
            </Button>
          </Link>
          {venta.estado === "COMPLETADA" && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive hover:bg-destructive/10 w-full sm:w-auto"
            >
              Anular Venta
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
