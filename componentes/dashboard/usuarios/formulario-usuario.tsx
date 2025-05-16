"use client";

import { useState, startTransition } from "react";
import GeneradorFormulario, {
  FieldConfig,
} from "@/componentes/generadores/generador-formulario";
import GeneradorAlerta from "@/componentes/generadores/generador-alerta";
import { z } from "zod";
import { crearUsuario } from "@/logica/acciones/acciones-usuario"; // Asegúrate de tener esta acción
import {
  CamposUsuario,
  EsquemaUsuario,
  Usuario,
} from "@/logica/esquemas/usuario";
const FormularioUsuario = () => {
  const [restablecerFormulario, setRestablecerFormulario] =
    useState<boolean>(false);

  const formFields: FieldConfig[] = [
    {
      nombre: "nombre",
      label: "Nombre",
      tipo: "text",
      placeholder: "Ej. Juan Pérez",
      validacion: CamposUsuario.nombre,
    },
    {
      nombre: "correo",
      label: "Correo electrónico",
      tipo: "text",
      placeholder: "Ej. juan@example.com",
      validacion: CamposUsuario.correo,
    },
    {
      nombre: "contrasena",
      label: "Contraseña",
      tipo: "password",
      placeholder: "Mínimo 6 caracteres",
      validacion: CamposUsuario.contrasena,
    },
    {
      nombre: "confirmarContrasena",
      label: "Confirmar contraseña",
      tipo: "password",
      placeholder: "Repite la contraseña",
      validacion: CamposUsuario.confirmarContrasena!,
    },
    {
      nombre: "rol",
      label: "Rol",
      tipo: "select",
      placeholder: "Seleccione un rol",
      opciones: [
        { value: "USER", label: "Usuario" },
        { value: "ADMIN", label: "Administrador" },
      ],
      validacion: CamposUsuario.rol,
    },
  ];

  const handleSubmit = (data: z.infer<typeof EsquemaUsuario>) => {
    startTransition(() => {
      const parsedData: Usuario = {
        ...data,
      };

      crearUsuario(parsedData).then((response) => {
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
      titulo={"Registrar Usuario"}
      descripcion={"Complete los campos para registrar un nuevo usuario"}
      restablecerFormulario={restablecerFormulario}
    />
  );
};

export default FormularioUsuario;
