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
import { Loader2 } from "lucide-react";
import { buscarClientes } from "./clientes";

interface Cliente {
  id: string;
  documento: string;
  nombre: string;
  telefono: string | null;
}

interface ClienteListProps {
  searchTerm: string;
  onClienteSeleccionado: (cliente: { id: string; nombre: string }) => void;
}

export function ClienteList({
  searchTerm,
  onClienteSeleccionado,
}: ClienteListProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoading(true);
      try {
        const data = await buscarClientes(searchTerm);
        setClientes(data);
      } catch (error) {
        console.error("Error al buscar clientes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientes();
  }, [searchTerm]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se encontraron clientes
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Documento</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="w-[100px]">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell>{cliente.documento}</TableCell>
              <TableCell>{cliente.nombre}</TableCell>
              <TableCell>
                <Button
                  variant="green"
                  size="icon"
                  onClick={() =>
                    onClienteSeleccionado({
                      id: cliente.id,
                      nombre: cliente.nombre,
                    })
                  }
                >
                  +
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
