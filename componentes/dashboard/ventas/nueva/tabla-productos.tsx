"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/componentes/ui/table";
import { Button } from "@/componentes/ui/button";
import { Input } from "@/componentes/ui/input";
import { Trash2 } from "lucide-react";
import { ProductoSeleccionado } from "./ventas-form";
import { Card, CardContent } from "@/componentes/ui/card";

interface TablaProductosProps {
  productos: ProductoSeleccionado[];
  onRemove: (inventarioId: string) => void;
  onUpdateCantidad: (inventarioId: string, cantidad: number) => void;
}

export function TablaProductos({
  productos,
  onRemove,
  onUpdateCantidad,
}: TablaProductosProps) {
  if (productos.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center text-muted-foreground">
        No hay productos seleccionados
      </div>
    );
  }

  return (
    <Card className="border rounded-md">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead className="w-[100px] text-center">Cantidad</TableHead>
              <TableHead className="text-right">Precio Unit.</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.inventarioId}>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.lote}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    value={producto.cantidad}
                    onChange={(e) =>
                      onUpdateCantidad(
                        producto.inventarioId,
                        Number.parseInt(e.target.value) || 1
                      )
                    }
                    className="w-20 mx-auto text-center"
                  />
                </TableCell>
                <TableCell className="text-right">
                  ${producto.precioUnitario.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  ${producto.subtotal.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(producto.inventarioId)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
