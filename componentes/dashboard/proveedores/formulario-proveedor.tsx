"use client";

import GeneradorAlerta from "@/componentes/generadores/generador-alerta";
import GeneradorFormulario, {
  FieldConfig,
} from "@/componentes/generadores/generador-formulario";
import { crearProveedor } from "@/logica/acciones/acciones-proveedor";
import { EsquemaProveedor } from "@/logica/esquemas/proveedor";
import { startTransition, useState } from "react";
import { z } from "zod";

const FormularioProveedor = () => {
  const [restablecerFormulario, setRestablecerFormulario] =
    useState<boolean>(false);

  const formFields: FieldConfig[] = [
    {
      nombre: "nombre",
      label: "Nombre del proveedor",
      tipo: "text",
      placeholder: "Ej. Laboratorios ACME",
      validacion: EsquemaProveedor.shape.nombre,
    },
    {
      nombre: "nit",
      label: "NIT",
      tipo: "text",
      placeholder: "Ej. 123456789-0",
      validacion: EsquemaProveedor.shape.nit,
    },
    {
      nombre: "direccion",
      label: "Dirección",
      tipo: "text",
      placeholder: "(Opcional)",
      validacion: EsquemaProveedor.shape.direccion,
    },
    {
      nombre: "telefono",
      label: "Teléfono",
      tipo: "text",
      placeholder: "(Opcional)",
      validacion: EsquemaProveedor.shape.telefono,
    },
    {
      nombre: "correo",
      label: "Correo electrónico",
      tipo: "email",
      placeholder: "(Opcional)",
      validacion: EsquemaProveedor.shape.correo,
    },
    {
      nombre: "contacto",
      label: "Persona de contacto",
      tipo: "text",
      placeholder: "(Opcional)",
      validacion: EsquemaProveedor.shape.contacto,
    },
  ];

  const handleSubmit = (data: z.infer<typeof EsquemaProveedor>) => {
    startTransition(() => {
      crearProveedor(data).then((response) => {
        if (response.error) {
          GeneradorAlerta({
            tipo: "error",
            texto: "Error",
            descripcion: response.error,
          });
        } else if (response.success) {
          GeneradorAlerta({
            tipo: "success",
            texto: "Éxito",
            descripcion: response.success,
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
      titulo={"Registrar Proveedor"}
      descripcion={"Complete los campos para registrar un nuevo proveedor"}
      restablecerFormulario={restablecerFormulario}
    />
  );
};

export default FormularioProveedor;
