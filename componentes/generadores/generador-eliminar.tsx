"use client";

import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

import { Button } from "@/componentes/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import GeneradorAlerta from "./generador-alerta";

interface CustomDeleteProps {
  onDelete: (
    id: string
  ) => Promise<{ success: boolean | string; error?: string }>;
  id: string;
  itemName: string;
  refreshData: () => void;
}

const GeneradorEliminar = ({
  onDelete,
  id,
  itemName,
  refreshData,
}: CustomDeleteProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    const response = await onDelete(id);

    const isSuccess = response.success === true || response.success === "true";

    if (isSuccess) {
      setIsDeleteDialogOpen(false);
      refreshData();
      GeneradorAlerta({
        tipo: "success",
        texto: "Eliminación exitosa",
        descripcion: `${itemName} se ha eliminado correctamente.`,
      });
    } else {
      GeneradorAlerta({
        tipo: "error",
        texto: "Error al eliminar",
        descripcion: response.error || "No se pudo eliminar el registro.",
      });
    }
  };

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="h-8 w-8" size="icon">
          <AiOutlineDelete />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente:{" "}
            <strong className="text-red-600">{itemName}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="hover:bg-red-600/90 bg-red-600 text-white"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GeneradorEliminar;
