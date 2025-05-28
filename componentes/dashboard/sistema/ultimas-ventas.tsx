import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { Badge } from "@/componentes/ui/badge";
import { ShoppingCart, User, Calendar } from "lucide-react";
import { getUltimasVentas } from "@/logica/acciones/acciones-inicio";

export default async function UltimasVentas() {
  const ventas = await getUltimasVentas();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Últimas Ventas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ventas.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay ventas recientes
            </p>
          ) : (
            ventas.map((venta, index) => (
              <div
                key={`venta-${venta.id}-${index}`}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">#{venta.numeroFactura}</span>
                    <Badge
                      variant={
                        venta.estado === "COMPLETADA"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {venta.estado}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {venta.cliente?.nombre || "Cliente general"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(venta.fecha).toLocaleDateString("es-ES")}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {venta.detalles.length} producto(s) • Vendido por:{" "}
                    {venta.usuario.nombre}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    ${Number(venta.total).toLocaleString("es-CO")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {venta.metodoPago}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
