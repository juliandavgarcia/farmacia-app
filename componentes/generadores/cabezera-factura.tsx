"use client";

import { Card, CardContent } from "@/componentes/ui/card";
import { Separator } from "@/componentes/ui/separator";

interface FacturaHeaderProps {
  numeroFactura: string;
  fecha: string;
  estado: string;
  proveedor: {
    nombre: string;
  };
  usuario: {
    nombre: string;
    correo: string;
    rol: string;
  };
}

export function FacturaHeader({
  numeroFactura,
  fecha,
  estado,
  proveedor,
  usuario,
}: FacturaHeaderProps) {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-4">
          {/* Columna izquierda - Información de factura */}
          <div className="p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-semibold">FACTURA:</div>
              <div>{numeroFactura}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="font-semibold">FECHA:</div>
              <div>{fecha}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="font-semibold">ESTADO:</div>
              <div>{estado}</div>
            </div>
            <Separator className="my-2" />
            <div className="grid grid-cols-2 gap-2">
              <div className="font-semibold">PROVEEDOR:</div>
              <div>{proveedor.nombre}</div>
            </div>
          </div>

          {/* Columna derecha - Información del usuario */}
          <div className="p-4 space-y-2 border-l border-gray-200">
            <div className="font-semibold">REGISTRADO POR:</div>
            <div>{usuario.nombre}</div>
            <div>{usuario.correo}</div>
            <div>Rol: {usuario.rol}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
