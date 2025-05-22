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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/componentes/ui/tabs";
import { Search } from "lucide-react";
import { ClienteForm } from "./cliente-form";
import { ClienteList } from "./cliente-list";

interface ClienteDialogProps {
  onClienteSeleccionado: (cliente: { id: string; nombre: string }) => void;
}

export function ClienteDialog({ onClienteSeleccionado }: ClienteDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClienteSeleccionado = (cliente: {
    id: string;
    nombre: string;
  }) => {
    onClienteSeleccionado(cliente);
    setOpen(false);
  };

  const handleClienteCreado = (cliente: { id: string; nombre: string }) => {
    onClienteSeleccionado(cliente);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Seleccionar Cliente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gestión de Clientes</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="buscar">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buscar">Buscar Cliente</TabsTrigger>
            <TabsTrigger value="crear">Crear Cliente</TabsTrigger>
          </TabsList>
          <TabsContent value="buscar" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Buscar por nombre o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <ClienteList
              searchTerm={searchTerm}
              onClienteSeleccionado={handleClienteSeleccionado}
            />
          </TabsContent>
          <TabsContent value="crear">
            <ClienteForm onClienteCreado={handleClienteCreado} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
