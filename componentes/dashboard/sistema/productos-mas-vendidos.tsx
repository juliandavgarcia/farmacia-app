import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { Progress } from "@/componentes/ui/progress";
import { getProductosMasVendidos } from "@/logica/acciones/acciones-inicio";
import { TrendingUp, Package } from "lucide-react";

export default async function ProductosMasVendidos() {
  const productos = await getProductosMasVendidos();
  const maxCantidad =
    productos.length > 0
      ? Math.max(...productos.map((p) => p.cantidadVendida))
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Productos Más Vendidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {productos.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay datos de ventas
            </p>
          ) : (
            productos.map((item, index) => (
              <div key={`${item.producto?.id}-${index}`} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      {item.producto?.nombre}
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                    {item.cantidadVendida} unidades
                  </div>
                </div>
                <Progress
                  value={(item.cantidadVendida / maxCantidad) * 100}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>#{index + 1} más vendido</span>
                  <span>
                    $
                    {Number(item.producto?.precioVenta || 0).toLocaleString(
                      "es-CO"
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
