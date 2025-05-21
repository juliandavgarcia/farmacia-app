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
import { Search, Building, Phone, Mail } from "lucide-react";
import { Proveedor } from "@prisma/client";

export function SelectorProveedor({
  proveedores = [],
  onSelect,
  selectedProveedor,
}: {
  proveedores: Proveedor[];
  onSelect: (proveedor: Proveedor) => void;
  selectedProveedor: Proveedor | null;
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProveedores = proveedores.filter(
    (proveedor) =>
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.nit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (proveedor: Proveedor) => {
    onSelect(proveedor);
    setOpen(false);
  };

  if (proveedores.length === 0) {
    return (
      <Input
        readOnly
        value="Registre proveedores primero"
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
          {selectedProveedor ? (
            <div className="flex items-center text-left">
              <Building className="h-4 w-4 mr-2 text-slate-500" />
              <span className="truncate">{selectedProveedor.nombre}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Seleccionar proveedor</span>
          )}
          <Search className="ml-2 h-4 w-4 text-slate-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar Proveedor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o NIT..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-[350px] overflow-y-auto border rounded-md">
            {filteredProveedores.length === 0 ? (
              <p className="p-4 text-center text-muted-foreground">
                No se encontraron proveedores
              </p>
            ) : (
              <ul className="divide-y">
                {filteredProveedores.map((proveedor) => (
                  <li
                    key={proveedor.id}
                    className="p-3 hover:bg-slate-100 cursor-pointer transition-colors"
                    onClick={() => handleSelect(proveedor)}
                  >
                    <div className="flex items-center">
                      <Building className="h-5 w-5 mr-2 text-slate-500" />
                      <div>
                        <div className="font-medium">{proveedor.nombre}</div>
                        <div className="text-sm text-muted-foreground">
                          NIT: {proveedor.nit}
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-500">
                      {proveedor.telefono && (
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {proveedor.telefono}
                        </div>
                      )}
                      {proveedor.correo && (
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {proveedor.correo}
                        </div>
                      )}
                    </div>
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
