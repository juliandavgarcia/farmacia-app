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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentes/ui/select";
import { Switch } from "@/componentes/ui/switch";

interface UsuarioUpdateProps {
  onUpdate: (data: {
    nombre: string;
    correo: string;
    rol: "ADMIN" | "USER";
    estado: boolean;
  }) => Promise<{
    success?: string;
    error?: string;
  }>;
  initialValues: {
    nombre: string;
    correo: string;
    rol: "ADMIN" | "USER";
    estado: boolean;
  };
  refreshData: () => void;
}

const ActualizarUsuario = ({
  onUpdate,
  initialValues,
  refreshData,
}: UsuarioUpdateProps) => {
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
        texto: "Usuario actualizado",
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
          <DialogTitle>Actualizar Usuario</DialogTitle>
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
              value={formData.nombre}
              onChange={(e) => handleChange(e, "nombre")}
              required
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
              value={formData.correo}
              onChange={(e) => handleChange(e, "correo")}
              required
            />
          </div>
          <div>
            <label
              htmlFor="rol"
              className="block text-sm font-medium text-gray-700"
            >
              Rol
            </label>
            <Select
              value={formData.rol}
              onValueChange={(value: "ADMIN" | "USER") =>
                setFormData({ ...formData, rol: value })
              }
            >
              <SelectTrigger id="rol">
                <SelectValue placeholder="Seleccione un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">Usuario</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="estado"
              className="text-sm font-medium text-gray-700"
            >
              Estado
            </label>
            <Switch
              id="estado"
              checked={formData.estado}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, estado: checked })
              }
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

export default ActualizarUsuario;
