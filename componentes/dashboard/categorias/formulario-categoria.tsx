"use client";

import GeneradorAlerta from "@/componentes/generadores/generador-alerta";
import GeneradorFormulario, {
  FieldConfig,
} from "@/componentes/generadores/generador-formulario";
import { crearCategoria } from "@/logica/acciones/acciones-categoria";
import { EsquemaCategoria } from "@/logica/esquemas/categoria";
import { startTransition, useState } from "react";
import { z } from "zod";

const FormularioCategoria = () => {
  const [restablecerFormulario, setRestablecerFormulario] =
    useState<boolean>(false);

  const formFields: FieldConfig[] = [
    {
      nombre: "nombre",
      label: "Nombre de la categoría",
      tipo: "text",
      placeholder: "Ej. Analgésicos",
      validacion: EsquemaCategoria.shape.nombre,
    },
  ];

  const handleSubmit = (data: z.infer<typeof EsquemaCategoria>) => {
    startTransition(() => {
      const parsedData = {
        ...data,
      };

      crearCategoria(parsedData).then((response) => {
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
      titulo={"Registrar Categoría"}
      descripcion={"Complete los campos para crear una nueva categoría"}
      restablecerFormulario={restablecerFormulario}
    />
  );
};

export default FormularioCategoria;
