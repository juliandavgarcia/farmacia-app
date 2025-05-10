import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, FileText, Package, User } from "lucide-react";

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

interface DetalleCompraPageProps {
  params: {
    id: string;
  };
}

async function getCompra(id: string) {
  if (id === "test") {
    return {
      numeroFactura: "TEST-0001",
      fecha: new Date(),
      estado: "COMPLETADA",
      subtotal: 50,
      impuestos: 10,
      total: 60,
      proveedor: {
        nombre: "Proveedor Test",
        nit: "00000000",
        telefono: null,
        correo: null,
      },
      usuario: {
        nombre: "Usuario Test",
        correo: "test@correo.com",
        rol: "OPERADOR",
      },
      detalles: [
        {
          id: "1",
          cantidad: 1,
          precioUnitario: 50,
          subtotal: 50,
          inventario: {
            numeroLote: "L000",
            fechaVencimiento: null,
            producto: { nombre: "Producto Test" },
          },
        },
      ],
    };
  }

  return await prisma.compra.findUnique({
    where: { id },
    include: {
      proveedor: true,
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


export default async function DetalleCompraPage({
  params,
}: DetalleCompraPageProps) {
  const compra = await getCompra(params.id);

  if (!compra) {
    notFound();
  }

  // Mapear estados a colores de badge
  const estadoBadgeVariant = {
    COMPLETADA: "default",
    PENDIENTE: "outline",
    CANCELADA: "destructive",
  }[compra.estado] as "default" | "outline" | "destructive" | null;

  return (
    <div className="mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalle de Compra
          </h1>
          <p className="text-muted-foreground">
            Factura #{compra.numeroFactura} -{" "}
            {format(compra.fecha, "PPP", { locale: es })}
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
              <span className="font-medium">{compra.numeroFactura}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha:</span>
              <span className="font-medium flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {format(compra.fecha, "dd/MM/yyyy HH:mm", { locale: es })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <Badge variant={estadoBadgeVariant}>{compra.estado}</Badge>
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
              <span className="font-medium">{compra.proveedor.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">NIT:</span>
              <span className="font-medium">{compra.proveedor.nit}</span>
            </div>
            {compra.proveedor.telefono && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teléfono:</span>
                <span className="font-medium">{compra.proveedor.telefono}</span>
              </div>
            )}
            {compra.proveedor.correo && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Correo:</span>
                <span className="font-medium">{compra.proveedor.correo}</span>
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
                {compra.usuario.nombre || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Correo:</span>
              <span className="font-medium">
                {compra.usuario.correo || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rol:</span>
              <Badge variant="outline">{compra.usuario.rol}</Badge>
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
              {compra.detalles.map((detalle) => (
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
                  ${Number(compra.subtotal).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="text-right">
                  Impuestos
                </TableCell>
                <TableCell className="text-right">
                  ${Number(compra.impuestos).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="text-right font-bold">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  ${Number(compra.total).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            Volver a Compras
          </Button>
          {compra.estado === "PENDIENTE" && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-destructive">
                Cancelar Compra
              </Button>
              <Button size="sm">Completar Compra</Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
