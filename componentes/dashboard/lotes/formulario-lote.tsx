// src/componentes/formularios/formulario-lote.tsx

"use client";

import GeneradorAlerta from "@/componentes/generadores/generador-alerta";
import GeneradorFormulario, {
  FieldConfig,
} from "@/componentes/generadores/generador-formulario";
import { crearLote } from "@/logica/acciones/acciones-lote";
import { EsquemaLote } from "@/logica/esquemas/lote";
import { startTransition, useState } from "react";
import { z } from "zod";

const FormularioLote = () => {
  const [restablecerFormulario, setRestablecerFormulario] =
    useState<boolean>(false);

  const formFields: FieldConfig[] = [
    {
      nombre: "productoId",
      label: "ID del Producto",
      tipo: "text",
      placeholder: "ID del producto relacionado",
      validacion: EsquemaLote.shape.productoId,
    },
    {
      nombre: "numeroLote",
      label: "Número de Lote",
      tipo: "text",
      placeholder: "Ej. ABC123",
      validacion: EsquemaLote.shape.numeroLote,
    },
    {
      nombre: "fechaVencimiento",
      label: "Fecha de Vencimiento",
      tipo: "date",
      validacion: EsquemaLote.shape.fechaVencimiento,
    },
    {
      nombre: "cantidad",
      label: "Cantidad",
      tipo: "number",
      placeholder: "Ej. 100",
      validacion: EsquemaLote.shape.cantidad,
    },
  ];

  const handleSubmit = (data: z.infer<typeof EsquemaLote>) => {
    startTransition(() => {
      const parsedData = {
        ...data,
        disponible: data.cantidad,
      };

      crearLote(parsedData).then((response) => {
        if (response.error) {
          GeneradorAlerta({
            tipo: "error",
            texto: "Error",
            descripcion: response.error,
          });
        } else if (response.exito) {
          GeneradorAlerta({
            tipo: "success",
            texto: "Éxito",
            descripcion: response.exito,
          });
          setRestablecerFormulario(true);
        }
      });
    });
  };

  return (
    <GeneradorFormulario
      campos={formFields}
      onSubmit={handleSubmit}
      titulo="Registrar Lote"
      descripcion="Complete los campos para crear un nuevo lote"
      restablecerFormulario={restablecerFormulario}
    />
  );
};

export default FormularioLote;
