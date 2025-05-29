/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { obtenerCompraPorId } from "@/logica/acciones/acciones-compra";
import { notFound } from "next/navigation";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/componentes/ui/table";
import { Button } from "@/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { Separator } from "@/componentes/ui/separator";

import {
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  Package,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

type EstadoCompra = "COMPLETADA" | "PENDIENTE" | "CANCELADA";

type Proveedor = {
  nombre: string;
  direccion: string;
  telefono: string;
};

type Usuario = {
  nombre: string;
};

type DetalleCompra = {
  inventario: {
    producto: {
      nombre: string;
      descripcion: string;
    };
  };
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
};

type Compra = {
  id: string;
  numeroFactura: string;
  fecha: string;
  estado: EstadoCompra;
  proveedor: Proveedor;
  usuario: Usuario;
  detalles: DetalleCompra[];
  subtotal: number;
  impuestos: number;
  total: number;
};

const estadoConfig: Record<
  EstadoCompra,
  { color: string; icon: React.ComponentType<any>; label: string }
> = {
  COMPLETADA: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    label: "Completada",
  },
  PENDIENTE: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    label: "Pendiente",
  },
  CANCELADA: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    label: "Cancelada",
  },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

function CompraDetailSkeleton() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
      </div>

      <Card>
        <CardHeader>
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 w-full bg-gray-200 animate-pulse rounded"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CompraDetallePage({ params }: PageProps) {
  const router = useRouter();
  const [compra, setCompra] = React.useState<Compra | null>(null);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  // Unwrap params using React.use()
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  React.useEffect(() => {
    async function fetchCompra() {
      try {
        setLoading(true);
        const respuesta = await obtenerCompraPorId(id);
        if ("error" in respuesta) {
          setError(true);
        } else {
          setCompra(respuesta.datos as Compra);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCompra();
  }, [id]);

  if (error) {
    notFound();
  }

  if (loading) {
    return <CompraDetailSkeleton />;
  }

  if (!compra) {
    return (
      <div className="mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <p className="text-yellow-800">
            No se pudo cargar la información de la compra.
          </p>
        </div>
      </div>
    );
  }

  const EstadoIcon = estadoConfig[compra.estado].icon;

  return (
    <div className="mx-auto p-4 space-y-2">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/compras")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Regresar a Compras
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Detalle de Compra
            </CardTitle>
            <span
              className={`${
                estadoConfig[compra.estado].color
              } flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium`}
            >
              <EstadoIcon className="h-3 w-3" />
              {estadoConfig[compra.estado].label}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                  <FileText className="h-4 w-4" />
                  Información de Compra
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Número de Factura</p>
                  <p className="font-semibold">{compra.numeroFactura}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-semibold flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(compra.fecha).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                  <Building2 className="h-4 w-4" />
                  Proveedor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-semibold">{compra.proveedor.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dirección</p>
                  <p className="text-sm">{compra.proveedor.direccion}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="text-sm">{compra.proveedor.telefono}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                  <User className="h-4 w-4" />
                  Usuario Responsable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-semibold">{compra.usuario.nombre}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos Comprados
            </h3>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableCaption className="py-4 text-gray-600">
                  Total de {compra.detalles.length} producto
                  {compra.detalles.length !== 1 ? "s" : ""} en esta compra
                </TableCaption>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Producto</TableHead>
                    <TableHead className="font-semibold">Descripción</TableHead>
                    <TableHead className="text-right font-semibold">
                      Cantidad
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Precio Unit.
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Subtotal
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compra.detalles.map((detalle, idx) => (
                    <TableRow
                      key={`detalle-${idx}-${detalle.inventario.producto.nombre}`}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">
                        {detalle.inventario.producto.nombre}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {detalle.inventario.producto.descripcion}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
                          {detalle.cantidad}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        L.{" "}
                        {detalle.precioUnitario.toLocaleString("es-HN", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        L.{" "}
                        {detalle.subtotal.toLocaleString("es-HN", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Card className="w-full max-w-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Resumen de Compra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-mono">
                    L.{" "}
                    {compra.subtotal.toLocaleString("es-HN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Impuestos:</span>
                  <span className="font-mono">
                    L.{" "}
                    {compra.impuestos.toLocaleString("es-HN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="font-mono text-primary">
                    L.{" "}
                    {compra.total.toLocaleString("es-HN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
