"use client";

import { Trash, Plus, Minus, ShoppingCart } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { Button } from "@/componentes/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/componentes/ui/table";
import { ScrollArea } from "@/componentes/ui/scroll-area";
import type { ItemCarrito } from "./nueva-venta-form";

interface CarritoVentaProps {
  items: ItemCarrito[];
  eliminarProducto: (inventarioId: string) => void;
  actualizarCantidad: (inventarioId: string, cantidad: number) => void;
}

export default function CarritoVenta({
  items,
  eliminarProducto,
  actualizarCantidad,
}: CarritoVentaProps) {
  // Calcular totales
  const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
  const iva = Number((subtotal * 0.19).toFixed(2)); // 19% de IVA
  const total = Number((subtotal + iva).toFixed(2));

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Carrito de Venta
        </CardTitle>
        <CardDescription>Productos agregados a la venta actual</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-2 text-muted-foreground">El carrito está vacío</p>
            <p className="text-sm text-muted-foreground">
              Agregue productos desde la pestaña de productos
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.inventarioId}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.nombre}</p>
                        {item.lote && (
                          <p className="text-xs text-muted-foreground">
                            Lote: {item.lote}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.precioUnitario.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            actualizarCantidad(
                              item.inventarioId,
                              item.cantidad - 1
                            )
                          }
                          disabled={item.cantidad <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            actualizarCantidad(
                              item.inventarioId,
                              item.cantidad + 1
                            )
                          }
                          disabled={item.cantidad >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${item.subtotal.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => eliminarProducto(item.inventarioId)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-right">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right">
                    ${subtotal.toFixed(2)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right">
                    IVA (19%)
                  </TableCell>
                  <TableCell className="text-right">
                    ${iva.toFixed(2)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ${total.toFixed(2)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "producto" : "productos"} en el
          carrito
        </p>
      </CardFooter>
    </>
  );
}
