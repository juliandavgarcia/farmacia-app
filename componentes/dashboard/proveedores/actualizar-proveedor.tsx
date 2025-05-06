"use client";

import { useState } from "react";
import { Button } from "@/componentes/ui/button";
import { Input } from "@/componentes/ui/input";
import { FiEdit2 } from "react-icons/fi";
import GeneradorAlerta from "@/componentes/generadores/generador-alerta";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/componentes/ui/dialog";

interface ProveedorUpdateProps {
  onUpdate: (data: {
    nombre: string;
    contacto: string;
    correo: string;
    nit: string;
  }) => Promise<{
    success?: string;
    error?: string;
  }>;
  initialName: string;
  initialContacto: string;
  initialCorreo: string;
  initialNit: string;
  refreshData: () => void;
}

const ActualizarProveedor = ({
  onUpdate,
  initialName,
  initialContacto,
  initialCorreo,
  initialNit,
  refreshData,
}: ProveedorUpdateProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nombre, setNombre] = useState(initialName);
  const [contacto, setContacto] = useState(initialContacto);
  const [correo, setCorreo] = useState(initialCorreo);
  const [nit, setNit] = useState(initialNit);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const response = await onUpdate({ nombre, contacto, correo, nit });

    if (response.success) {
      setIsDialogOpen(false);
      refreshData();
      GeneradorAlerta({
        tipo: "success",
        texto: "Proveedor actualizado",
        descripcion: response.success,
      });
    } else if (response.error) {
      GeneradorAlerta({
        tipo: "error",
        texto: "Error al actualizar",
        descripcion: response.error,
      });
    }

    setIsUpdating(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="edit" className="h-8 w-8" size="icon">
          <FiEdit2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Proveedor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre
            </label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="contacto"
              className="block text-sm font-medium text-gray-700"
            >
              Contacto
            </label>
            <Input
              id="contacto"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="correo"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <Input
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="nit"
              className="block text-sm font-medium text-gray-700"
            >
              NIT
            </label>
            <Input
              id="nit"
              value={nit}
              onChange={(e) => setNit(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating} variant="edit">
              {isUpdating ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActualizarProveedor;
