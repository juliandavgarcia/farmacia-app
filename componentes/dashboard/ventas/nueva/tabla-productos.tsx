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
import { Trash2, AlertCircle } from "lucide-react";
import type { ProductoSeleccionado } from "./ventas-form";
import { Card, CardContent, CardFooter } from "@/componentes/ui/card";
import { Badge } from "@/componentes/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/componentes/ui/tooltip";

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
  // Calcular el total de la factura
  const calcularTotal = () => {
    return productos.reduce((total, producto) => total + producto.subtotal, 0);
  };

  if (productos.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
        <AlertCircle className="h-10 w-10 text-muted-foreground/50" />
        <p>No hay productos seleccionados</p>
        <p className="text-sm text-muted-foreground/70">
          Agregue productos para generar la factura
        </p>
      </div>
    );
  }

  return (
    <Card className="border rounded-md shadow-sm">
      <CardContent className="p-0 overflow-auto">
        <div className="w-full overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[30%] lg:w-[25%]">Producto</TableHead>
                <TableHead className="w-[15%] lg:w-[15%]">Lote</TableHead>
                <TableHead className="w-[15%] text-center">Cantidad</TableHead>
                <TableHead className="text-right w-[15%]">
                  Precio Unit.
                </TableHead>
                <TableHead className="text-right w-[15%]">Subtotal</TableHead>
                <TableHead className="w-[10%] text-center">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((producto) => (
                <TableRow key={producto.inventarioId} className="group">
                  <TableCell className="font-medium">
                    {producto.nombre}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {producto.lote}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <div className="relative w-24">
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-0 top-0 h-full rounded-r-none border-r-0 px-2"
                          onClick={() => {
                            const newValue = Math.max(1, producto.cantidad - 1);
                            onUpdateCantidad(producto.inventarioId, newValue);
                          }}
                          disabled={producto.cantidad <= 1}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={producto.cantidad}
                          onChange={(e) =>
                            onUpdateCantidad(
                              producto.inventarioId,
                              Math.max(1, Number.parseInt(e.target.value) || 1)
                            )
                          }
                          className="text-center pl-8 pr-8"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-0 top-0 h-full rounded-l-none border-l-0 px-2"
                          onClick={() => {
                            onUpdateCantidad(
                              producto.inventarioId,
                              producto.cantidad + 1
                            );
                          }}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    ${producto.precioUnitario.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${producto.subtotal.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemove(producto.inventarioId)}
                            className="h-8 w-8 opacity-70 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Eliminar producto</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 border-t bg-muted/20">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Resumen</span>
          <span className="text-lg font-semibold">
            {productos.length}{" "}
            {productos.length === 1 ? "producto" : "productos"}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm text-muted-foreground">Total a pagar</span>
          <span className="text-xl font-bold">
            ${calcularTotal().toFixed(2)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
