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

interface ClienteUpdateProps {
  onUpdate: (data: {
    documento: string;
    nombre: string;
    telefono: string;
    direccion?: string;
    correo?: string;
  }) => Promise<{
    success?: string;
    error?: string;
  }>;
  initialValues: {
    documento: string;
    nombre: string;
    telefono: string;
    direccion?: string;
    correo?: string;
  };
  refreshData: () => void;
}

const ActualizarCliente = ({
  onUpdate,
  initialValues,
  refreshData,
}: ClienteUpdateProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(initialValues);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const response = await onUpdate(formData);

    if (response.success) {
      setIsDialogOpen(false);
      refreshData();
      GeneradorAlerta({
        tipo: "success",
        texto: "Cliente actualizado",
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
          <DialogTitle>Actualizar Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="documento"
              className="block text-sm font-medium text-gray-700"
            >
              Documento
            </label>
            <Input
              id="documento"
              value={formData.documento}
              onChange={(e) => handleChange(e, "documento")}
              required
            />
          </div>
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre
            </label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange(e, "nombre")}
              required
            />
          </div>
          <div>
            <label
              htmlFor="telefono"
              className="block text-sm font-medium text-gray-700"
            >
              Teléfono
            </label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => handleChange(e, "telefono")}
              required
            />
          </div>
          <div>
            <label
              htmlFor="direccion"
              className="block text-sm font-medium text-gray-700"
            >
              Dirección
            </label>
            <Input
              id="direccion"
              value={formData.direccion || ""}
              onChange={(e) => handleChange(e, "direccion")}
            />
          </div>
          <div>
            <label
              htmlFor="correo"
              className="block text-sm font-medium text-gray-700"
            >
              Correo
            </label>
            <Input
              id="correo"
              type="email"
              value={formData.correo || ""}
              onChange={(e) => handleChange(e, "correo")}
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

export default ActualizarCliente;
