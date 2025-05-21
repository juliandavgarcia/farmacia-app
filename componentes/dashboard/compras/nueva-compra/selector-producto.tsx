"use client";

import { useState } from "react";
import { Button } from "@/componentes/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/componentes/ui/dialog";
import { Input } from "@/componentes/ui/input";
import { Search, Package, Barcode, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Producto } from "@prisma/client";

export function SelectorProducto({
  productos = [],
  onSelect,
  selectedProducto,
}: {
  productos: Producto[];
  onSelect: (producto: Producto) => void;
  selectedProducto: Producto | null;
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProductos = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (producto.codigoBarras &&
        producto.codigoBarras.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (producto: Producto) => {
    onSelect(producto);
    setOpen(false);
  };

  if (productos.length === 0) {
    return (
      <Input
        readOnly
        value="Registre productos primero"
        className="cursor-not-allowed text-muted-foreground bg-slate-100"
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-white border-slate-200 hover:bg-slate-50"
        >
          {selectedProducto ? (
            <div className="flex items-center text-left">
              <Package className="h-4 w-4 mr-2 text-slate-500" />
              <span className="truncate">{selectedProducto.nombre}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Seleccionar producto</span>
          )}
          <Search className="ml-2 h-4 w-4 text-slate-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar Producto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o código de barras..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-[350px] overflow-y-auto border rounded-md">
            {filteredProductos.length === 0 ? (
              <p className="p-4 text-center text-muted-foreground">
                No se encontraron productos
              </p>
            ) : (
              <ul className="divide-y">
                {filteredProductos.map((producto) => (
                  <li
                    key={producto.id}
                    className="p-3 hover:bg-slate-100 cursor-pointer transition-colors"
                    onClick={() => handleSelect(producto)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 mr-2 text-slate-500" />
                        <div className="font-medium">{producto.nombre}</div>
                      </div>
                      <div className="font-medium text-primary">
                        {formatCurrency(Number(producto.precioCompra))}
                      </div>
                    </div>
                    <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-500">
                      {producto.codigoBarras && (
                        <div className="flex items-center">
                          <Barcode className="h-3 w-3 mr-1" />
                          {producto.codigoBarras}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {producto.unidadMedida}
                      </div>
                    </div>
                    {producto.descripcion && (
                      <div className="mt-1 text-xs text-slate-600 line-clamp-1">
                        {producto.descripcion}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
