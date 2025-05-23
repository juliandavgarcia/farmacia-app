"use client";

import { useEffect, useState } from "react";
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
import { Loader2, Package, Calendar, Tag, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/componentes/ui/dialog";
import { Card, CardContent } from "@/componentes/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentes/ui/select";
import { Badge } from "@/componentes/ui/badge";
import { buscarProductosConInventario } from "./productos";
import type { ProductoSeleccionado } from "./ventas-form";
import { cn } from "@/lib/utils";

interface Producto {
  id: string;
  nombre: string;
  codigoBarras: string | null;
  precioVenta: number;
  inventarios: {
    id: string;
    cantidad: number;
    numeroLote: string | null;
    fechaVencimiento: string | null;
  }[];
}

interface ProductoListProps {
  searchTerm: string;
  onProductoSeleccionado: (producto: ProductoSeleccionado) => void;
}

export function ProductoList({
  searchTerm,
  onProductoSeleccionado,
}: ProductoListProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );
  const [cantidad, setCantidad] = useState(1);
  const [inventarioSeleccionado, setInventarioSeleccionado] =
    useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [maxCantidad, setMaxCantidad] = useState(1);

  useEffect(() => {
    const fetchProductos = async () => {
      if (!searchTerm.trim()) return;

      setIsLoading(true);
      try {
        const data = await buscarProductosConInventario(searchTerm);
        setProductos(data);
      } catch (error) {
        console.error("Error al buscar productos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProductos();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    if (inventarioSeleccionado && selectedProducto) {
      const inventario = selectedProducto.inventarios.find(
        (inv) => inv.id === inventarioSeleccionado
      );
      if (inventario) {
        setMaxCantidad(inventario.cantidad);
        setCantidad(1);
      }
    }
  }, [inventarioSeleccionado, selectedProducto]);

  const handleSeleccionarProducto = (producto: Producto) => {
    setSelectedProducto(producto);
    setInventarioSeleccionado("");
    setCantidad(1);
    setDialogOpen(true);
  };

  const handleConfirmarSeleccion = () => {
    if (!selectedProducto || !inventarioSeleccionado) return;

    const inventario = selectedProducto.inventarios.find(
      (inv) => inv.id === inventarioSeleccionado
    );
    if (!inventario) return;

    onProductoSeleccionado({
      id: selectedProducto.id,
      inventarioId: inventarioSeleccionado,
      nombre: selectedProducto.nombre,
      lote: inventario.numeroLote || "Sin lote",
      cantidad: cantidad,
      precioUnitario: selectedProducto.precioVenta,
      subtotal: selectedProducto.precioVenta * cantidad,
    });

    setDialogOpen(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">
          Buscando productos...
        </span>
      </div>
    );
  }

  if (productos.length === 0 && searchTerm.trim()) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <Package className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">No se encontraron productos</p>
          <p className="text-xs text-muted-foreground mt-1">
            Intente con otro término de búsqueda
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((producto) => {
                const stockTotal = producto.inventarios.reduce(
                  (total, inv) => total + inv.cantidad,
                  0
                );
                return (
                  <TableRow key={producto.id} className="group">
                    <TableCell className="font-mono text-xs">
                      {producto.codigoBarras || "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {producto.nombre}
                    </TableCell>
                    <TableCell className="text-right">
                      ${producto.precioVenta.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          stockTotal > 10
                            ? "outline"
                            : stockTotal > 0
                            ? "secondary"
                            : "destructive"
                        }
                        className="ml-auto"
                      >
                        {stockTotal}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        onClick={() => handleSeleccionarProducto(producto)}
                        disabled={stockTotal === 0}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Seleccionar Lote y Cantidad</DialogTitle>
            <DialogDescription>
              Elija el lote específico y la cantidad que desea agregar a la
              venta
            </DialogDescription>
          </DialogHeader>

          {selectedProducto && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{selectedProducto.nombre}</h3>
                  <p className="text-sm text-muted-foreground">
                    Código: {selectedProducto.codigoBarras || "Sin código"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-primary">
                    ${selectedProducto.precioVenta.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Lote disponible
                </label>

                <Select
                  value={inventarioSeleccionado}
                  onValueChange={setInventarioSeleccionado}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un lote" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProducto.inventarios
                      .filter((inv) => inv.cantidad > 0)
                      .map((inv) => (
                        <SelectItem key={inv.id} value={inv.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{inv.numeroLote || "Sin lote"}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              Stock: {inv.cantidad}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {inventarioSeleccionado && (
                <div className="space-y-1 text-sm">
                  {selectedProducto.inventarios
                    .filter(
                      (inv) =>
                        inv.id === inventarioSeleccionado &&
                        inv.fechaVencimiento
                    )
                    .map((inv) => (
                      <div
                        key={inv.id}
                        className="flex items-center text-amber-600"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Vence: {formatDate(inv.fechaVencimiento)}</span>
                      </div>
                    ))}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Cantidad</label>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    disabled={cantidad <= 1}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) =>
                      setCantidad(
                        Math.min(
                          maxCantidad,
                          Math.max(1, Number.parseInt(e.target.value) || 1)
                        )
                      )
                    }
                    max={maxCantidad}
                    className="h-8 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    onClick={() =>
                      setCantidad(Math.min(maxCantidad, cantidad + 1))
                    }
                    disabled={cantidad >= maxCantidad}
                  >
                    +
                  </Button>
                </div>
              </div>

              {inventarioSeleccionado && (
                <div className="bg-muted/50 p-3 rounded-md flex justify-between items-center">
                  <span className="text-sm">Subtotal:</span>
                  <span className="font-semibold">
                    ${(selectedProducto.precioVenta * cantidad).toFixed(2)}
                  </span>
                </div>
              )}

              <DialogFooter className="sm:justify-end">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmarSeleccion}
                  disabled={!inventarioSeleccionado || cantidad < 1}
                  className={cn(
                    "transition-all",
                    inventarioSeleccionado
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  Agregar a la venta
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
