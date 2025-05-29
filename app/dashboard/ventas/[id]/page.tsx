/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { obtenerVentaPorId } from "@/logica/acciones/acciones-venta";
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
  Calendar,
  FileText,
  Package,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  CreditCard,
  ShoppingCart,
  ScanText,
} from "lucide-react";

type EstadoVenta = "COMPLETADA" | "ANULADA";
type MetodoPago = "Efectivo" | "Tarjeta";

type Cliente = {
  nombre: string;
  documento: string;
  telefono?: string;
  direccion?: string;
  correo?: string;
};

type Usuario = {
  nombre: string;
};

type DetalleVenta = {
  inventario: {
    producto: {
      nombre: string;
      descripcion?: string; // Made optional as per your schema
    };
  };
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
};

type Venta = {
  id: string;
  numeroFactura: string;
  fecha: string;
  estado: EstadoVenta;
  metodoPago: MetodoPago;
  cliente?: Cliente; // Cliente can be optional
  usuario: Usuario;
  detalles: DetalleVenta[];
  subtotal: number;
  iva: number;
  total: number;
};

const estadoConfig: Record<
  EstadoVenta,
  { color: string; icon: React.ComponentType<any>; label: string }
> = {
  COMPLETADA: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    label: "Completada",
  },
  ANULADA: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    label: "Anulada",
  },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

function VentaDetailSkeleton() {
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

export default function VentaDetallePage({ params }: PageProps) {
  const router = useRouter();
  const [venta, setVenta] = React.useState<Venta | null>(null);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  // Unwrap params using React.use()
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  React.useEffect(() => {
    async function fetchVenta() {
      try {
        setLoading(true);
        const respuesta = await obtenerVentaPorId(id);
        if ("error" in respuesta) {
          setError(true);
          console.error("Error fetching venta:", respuesta.error); // Log the specific error
        } else {
          setVenta(respuesta.datos as Venta);
        }
      } catch (err) {
        setError(true);
        console.error("Unexpected error during fetch:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVenta();
  }, [id]);

  if (error) {
    notFound(); // This will render Next.js's 404 page
  }

  if (loading) {
    return <VentaDetailSkeleton />;
  }

  if (!venta) {
    // This case should ideally be caught by `error` and `notFound()`
    // but as a fallback, show a message if `venta` is null but `error` is false.
    return (
      <div className="mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <p className="text-yellow-800">
            No se pudo cargar la información de la venta. Venta no encontrada o
            datos inválidos.
          </p>
        </div>
      </div>
    );
  }

  const EstadoIcon = estadoConfig[venta.estado].icon;

  return (
    <div className="mx-auto p-4 space-y-2">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/ventas")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Regresar a Ventas
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              Detalle de Venta
            </CardTitle>
            <span
              className={`${
                estadoConfig[venta.estado].color
              } flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium`}
            >
              <EstadoIcon className="h-3 w-3" />
              {estadoConfig[venta.estado].label}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                  <FileText className="h-4 w-4" />
                  Información de Venta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Número de Factura</p>
                  <p className="font-semibold">{venta.numeroFactura}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-semibold flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(venta.fecha).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Método de Pago</p>
                  <p className="font-semibold flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    {venta.metodoPago}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                  <User className="h-4 w-4" />
                  Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-semibold">
                    {venta.cliente?.nombre ?? "N/A (Consumidor Final)"}
                  </p>
                </div>
                {venta.cliente?.documento && (
                  <div>
                    <p className="text-sm text-gray-600">Documento</p>
                    <p className="text-sm flex items-center gap-1">
                      <ScanText className="h-3 w-3" />
                      {venta.cliente.documento}
                    </p>
                  </div>
                )}
                {venta.cliente?.telefono && (
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="text-sm">{venta.cliente.telefono}</p>
                  </div>
                )}
                {venta.cliente?.direccion && (
                  <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="text-sm">{venta.cliente.direccion}</p>
                  </div>
                )}
                {venta.cliente?.correo && (
                  <div>
                    <p className="text-sm text-gray-600">Correo</p>
                    <p className="text-sm">{venta.cliente.correo}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                  <User className="h-4 w-4" />
                  Usuario Vendedor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-semibold">{venta.usuario.nombre}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos Vendidos
            </h3>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableCaption className="py-4 text-gray-600">
                  Total de {venta.detalles.length} producto
                  {venta.detalles.length !== 1 ? "s" : ""} en esta venta
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
                  {venta.detalles.map((detalle, idx) => (
                    <TableRow
                      key={`detalle-${idx}-${
                        detalle.inventario?.producto?.nombre ??
                        "unknown-product"
                      }`}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">
                        {detalle.inventario?.producto?.nombre ??
                          "Producto Desconocido"}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {detalle.inventario?.producto?.descripcion ?? "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
                          {detalle.cantidad}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        L.{" "}
                        {(detalle.precioUnitario ?? 0).toLocaleString("es-HN", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        L.{" "}
                        {(detalle.subtotal ?? 0).toLocaleString("es-HN", {
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
                <CardTitle className="text-lg">Resumen de Venta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-mono">
                    L.{" "}
                    {venta.subtotal.toLocaleString("es-HN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">IVA:</span>
                  <span className="font-mono">
                    L.{" "}
                    {venta.iva.toLocaleString("es-HN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="font-mono text-primary">
                    L.{" "}
                    {venta.total.toLocaleString("es-HN", {
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
