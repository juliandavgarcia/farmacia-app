/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { Progress } from "@/componentes/ui/progress";

interface InventarioStatsProps {
  producto: any;
}

export default function InventarioStats({ producto }: InventarioStatsProps) {
  // Calcular estadísticas
  const stockTotal = producto.inventarios.reduce(
    (total: number, inv: any) => total + inv.cantidad,
    0
  );
  const stockMinimo = 10;
  const stockBajo = stockTotal < stockMinimo;
  const porcentajeStock =
    stockMinimo > 0 ? Math.min((stockTotal / stockMinimo) * 100, 100) : 100;

  // Calcular productos próximos a vencer (simulado)
  const hoy = new Date();
  const treintaDias = new Date();
  treintaDias.setDate(hoy.getDate() + 30);

  const proximosAVencer = producto.inventarios.filter((inv: any) => {
    if (!inv.fechaVencimiento) return false;
    const fechaVencimiento = new Date(inv.fechaVencimiento);
    return fechaVencimiento > hoy && fechaVencimiento <= treintaDias;
  }).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Resumen de Inventario</CardTitle>
          <CardDescription>Estado actual del inventario</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Stock Actual</span>
              <span className="text-sm font-medium">{stockTotal} unidades</span>
            </div>
            <Progress
              value={porcentajeStock}
              className={stockBajo ? "bg-red-100" : ""}
            />
            {stockBajo && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Stock por debajo del mínimo recomendado ({stockMinimo})
              </p>
            )}
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium">Próximos a vencer</span>
            </div>
            <p className="text-2xl font-bold mt-1">{proximosAVencer}</p>
            <p className="text-xs text-muted-foreground">
              En los próximos 30 días
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Información de Precios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Precio de compra:
            </span>
            <span className="font-medium">
              ${Number(producto.precioCompra).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Precio de venta:
            </span>
            <span className="font-medium">
              ${Number(producto.precioVenta).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Margen de ganancia:
            </span>
            <span className="font-medium">
              {(
                ((Number(producto.precioVenta) -
                  Number(producto.precioCompra)) /
                  Number(producto.precioCompra)) *
                100
              ).toFixed(2)}
              %
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
