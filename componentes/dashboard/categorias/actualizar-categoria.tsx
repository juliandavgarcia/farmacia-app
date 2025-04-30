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

interface CategoryUpdateProps {
  onUpdate: (data: { nombre: string; descripcion: string }) => Promise<{
    success?: string;
    error?: string;
  }>;
  initialName: string;
  initialDescription: string;
  refreshData: () => void;
}

const ActualizarCategoria = ({
  onUpdate,
  initialName,
  initialDescription,
  refreshData,
}: CategoryUpdateProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nombre, setNombre] = useState(initialName);
  const [descripcion, setDescription] = useState(initialDescription);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const response = await onUpdate({ nombre, descripcion });

    if (response.success) {
      setIsDialogOpen(false);
      refreshData();
      GeneradorAlerta({
        tipo: "success",
        texto: "Categoría actualizada",
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
          <DialogTitle>Actualizar Categoría</DialogTitle>
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
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción
            </label>
            <Input
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescription(e.target.value)}
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

export default ActualizarCategoria;
