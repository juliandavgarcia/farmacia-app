import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { Badge } from "@/componentes/ui/badge";
import { Avatar, AvatarFallback } from "@/componentes/ui/avatar";
import { Crown, ShoppingBag, DollarSign } from "lucide-react";
import { getClientesFieles } from "@/logica/acciones/acciones-inicio";

export default async function ClientesFieles() {
  const clientes = await getClientesFieles();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Clientes Más Fieles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clientes.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay datos de clientes
            </p>
          ) : (
            clientes.map((cliente, index) => (
              <div
                key={`cliente-${cliente.id}-${index}`}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10">
                        {cliente.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {index === 0 && (
                      <Crown className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{cliente.nombre}</div>
                    <div className="text-sm text-muted-foreground">
                      Doc: {cliente.documento}
                    </div>
                    {cliente.telefono && (
                      <div className="text-xs text-muted-foreground">
                        Tel: {cliente.telefono}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <ShoppingBag className="h-3 w-3" />
                    <span className="font-medium">{cliente.totalCompras}</span>
                    <span className="text-muted-foreground">compras</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-medium">
                      ${cliente.totalGastado.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <Badge
                    variant={index === 0 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
