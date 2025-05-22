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
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/componentes/ui/dialog";
import { buscarProductosConInventario } from "./productos";
import { ProductoSeleccionado } from "./ventas-form";

interface Producto {
  id: string;
  nombre: string;
  codigoBarras: string | null;
  precioVenta: number; // Asegurarse de que esto sea number, no Decimal
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

  useEffect(() => {
    const fetchProductos = async () => {
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

    fetchProductos();
  }, [searchTerm]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se encontraron productos
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Stock Total</TableHead>
              <TableHead className="w-[100px]">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => {
              const stockTotal = producto.inventarios.reduce(
                (total, inv) => total + inv.cantidad,
                0
              );
              return (
                <TableRow key={producto.id}>
                  <TableCell>{producto.codigoBarras || "-"}</TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell className="text-right">
                    ${producto.precioVenta.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">{stockTotal}</TableCell>
                  <TableCell>
                    <Button
                      variant="sky"
                      size="sm"
                      onClick={() => handleSeleccionarProducto(producto)}
                      disabled={stockTotal === 0}
                    >
                      Seleccionar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seleccionar Lote</DialogTitle>
          </DialogHeader>
          {selectedProducto && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{selectedProducto.nombre}</h3>
                <p className="text-sm text-muted-foreground">
                  Precio: ${selectedProducto.precioVenta.toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Seleccionar Lote</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={inventarioSeleccionado}
                  onChange={(e) => setInventarioSeleccionado(e.target.value)}
                >
                  <option value="">Seleccione un lote</option>
                  {selectedProducto.inventarios
                    .filter((inv) => inv.cantidad > 0)
                    .map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.numeroLote || "Sin lote"} - Stock: {inv.cantidad} -{" "}
                        {inv.fechaVencimiento
                          ? `Vence: ${new Date(
                              inv.fechaVencimiento
                            ).toLocaleDateString()}`
                          : "Sin fecha de vencimiento"}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cantidad</label>
                <Input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) =>
                    setCantidad(Number.parseInt(e.target.value) || 1)
                  }
                  max={
                    inventarioSeleccionado
                      ? selectedProducto.inventarios.find(
                          (inv) => inv.id === inventarioSeleccionado
                        )?.cantidad || 1
                      : 1
                  }
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmarSeleccion}
                  disabled={!inventarioSeleccionado || cantidad < 1}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
