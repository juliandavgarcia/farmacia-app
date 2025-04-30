"use client";

import GeneradorAlerta from "@/componentes/generadores/generador-alerta";
import GeneradorFormulario, {
  FieldConfig,
} from "@/componentes/generadores/generador-formulario";
import { crearCliente } from "@/logica/acciones/acciones-cliente";
import { EsquemaCliente } from "@/logica/esquemas/cliente";
import { startTransition, useState } from "react";
import { z } from "zod";

const FormularioCliente = () => {
  const [restablecerFormulario, setRestablecerFormulario] = useState(false);

  const formFields: FieldConfig[] = [
    {
      nombre: "documento",
      label: "Documento",
      tipo: "text",
      placeholder: "Ej. 123456789",
      validacion: EsquemaCliente.shape.documento,
    },
    {
      nombre: "nombre",
      label: "Nombre completo",
      tipo: "text",
      placeholder: "Ej. Juan Pérez",
      validacion: EsquemaCliente.shape.nombre,
    },
    {
      nombre: "telefono",
      label: "Teléfono",
      tipo: "text",
      placeholder: "Ej. 3001234567",
      validacion: EsquemaCliente.shape.telefono,
    },
    {
      nombre: "direccion",
      label: "Dirección",
      tipo: "text",
      placeholder: "Ej. Calle 123 #45-67",
      validacion: EsquemaCliente.shape.direccion,
    },
    {
      nombre: "correo",
      label: "Correo electrónico",
      tipo: "text",
      placeholder: "Ej. correo@ejemplo.com",
      validacion: EsquemaCliente.shape.correo,
    },
  ];

  const handleSubmit = (data: z.infer<typeof EsquemaCliente>) => {
    startTransition(() => {
      crearCliente(data).then((response) => {
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
      titulo={"Registrar Cliente"}
      descripcion={"Complete los campos para registrar un nuevo cliente"}
      restablecerFormulario={restablecerFormulario}
    />
  );
};

export default FormularioCliente;
