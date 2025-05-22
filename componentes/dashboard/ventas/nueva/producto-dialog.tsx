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
import { Search, Plus } from "lucide-react";
import { ProductoSeleccionado } from "./ventas-form";
import { ProductoList } from "./producto-list";

interface ProductoDialogProps {
  onProductoSeleccionado: (producto: ProductoSeleccionado) => void;
}

export function ProductoDialog({
  onProductoSeleccionado,
}: ProductoDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleProductoSeleccionado = (producto: ProductoSeleccionado) => {
    onProductoSeleccionado(producto);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Seleccionar Producto</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="Buscar por nombre o código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <ProductoList
          searchTerm={searchTerm}
          onProductoSeleccionado={handleProductoSeleccionado}
        />
      </DialogContent>
    </Dialog>
  );
}
