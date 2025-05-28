import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { getVentasRecientes } from "@/logica/acciones/acciones-inicio";
import { Clock, Receipt } from "lucide-react";

export default async function VentasRecientes() {
  const ventas = await getVentasRecientes();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Ventas Recientes (7 días)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ventas.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay ventas recientes
            </p>
          ) : (
            ventas.map((venta, index) => (
              <div
                key={`venta-reciente-${venta.id}-${index}`}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">
                      #{venta.numeroFactura}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {venta.cliente?.nombre || "Cliente general"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">
                    ${Number(venta.total).toLocaleString("es-CO")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(venta.fecha).toLocaleDateString("es-ES", {
                      month: "short",
                      day: "numeric",
                    })}
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
