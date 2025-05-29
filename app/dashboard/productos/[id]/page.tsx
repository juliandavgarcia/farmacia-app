import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Barcode, Package } from "lucide-react";

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
  TableHead,
  TableHeader,
  TableRow,
} from "@/componentes/ui/table";
import { prisma } from "@/lib/db";
import InventarioStats from "@/componentes/dashboard/inventario/estadisticas-inventario";

async function getProducto(id: string) {
  const producto = await prisma.producto.findUnique({
    where: { id },
    include: {
      categoria: true,
      inventarios: {
        orderBy: {
          fechaVencimiento: "asc",
        },
      },
    },
  });

  if (!producto) {
    return null;
  }

  return producto;
}

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params Promise
  const { id } = await params;
  const producto = await getProducto(id);

  if (!producto) {
    notFound();
  }

  // Calcular stock total
  const stockTotal = producto.inventarios.reduce(
    (total, inv) => total + inv.cantidad,
    0
  );

  return (
    <div className="mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/productos">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {producto.nombre}
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Detalle del producto e inventario
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Información del producto */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
              <CardDescription>Detalles generales del producto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Nombre
                    </h3>
                    <p className="text-base">{producto.nombre}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Descripción
                    </h3>
                    <p className="text-base">
                      {producto.descripcion || "Sin descripción"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Categoría
                    </h3>
                    <Badge variant="outline">{producto.categoria.nombre}</Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Estado
                    </h3>
                    <Badge variant={producto.estado ? "default" : "secondary"}>
                      {producto.estado ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Código de Barras
                    </h3>
                    <div className="flex items-center gap-1">
                      <Barcode className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">
                        {producto.codigoBarras || "No registrado"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Registro INVIMA
                    </h3>
                    <p className="text-base">
                      {producto.registroInvima || "No registrado"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Unidad de Medida
                    </h3>
                    <p className="text-base">{producto.unidadMedida}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Precio de Compra
                      </h3>
                      <p className="text-base font-medium">
                        ${Number(producto.precioCompra).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Precio de Venta
                      </h3>
                      <p className="text-base font-medium">
                        ${Number(producto.precioVenta).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventario del producto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventario
              </CardTitle>
              <CardDescription>
                Detalle del inventario disponible
              </CardDescription>
            </CardHeader>
            <CardContent>
              {producto.inventarios.length === 0 ? (
                <div className="text-center py-6">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">
                    No hay inventario registrado para este producto
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lote</TableHead>
                      <TableHead>Fecha de Vencimiento</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {producto.inventarios.map((inventario) => (
                      <TableRow key={inventario.id}>
                        <TableCell>
                          {inventario.numeroLote || "Sin lote"}
                        </TableCell>
                        <TableCell>
                          {inventario.fechaVencimiento
                            ? format(
                                new Date(inventario.fechaVencimiento),
                                "dd/MM/yyyy",
                                { locale: es }
                              )
                            : "No aplica"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {inventario.cantidad}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Stock total: <span className="font-medium">{stockTotal}</span>{" "}
                unidades
              </p>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Estadísticas de inventario */}
          <InventarioStats producto={producto} />
        </div>
      </div>
    </div>
  );
}
