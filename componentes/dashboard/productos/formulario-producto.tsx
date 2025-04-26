"use client";

import GeneradorAlerta from "@/componentes/generadores/generador-alerta";
import GeneradorFormulario, {
  FieldConfig,
} from "@/componentes/generadores/generador-formulario";
import { obtenerCategorias } from "@/logica/acciones/acciones-categoria";
import { crearProducto } from "@/logica/acciones/acciones-producto";
import { Categoria } from "@/logica/esquemas/categoria";
import { EsquemaProducto } from "@/logica/esquemas/producto";
import { startTransition, useEffect, useState } from "react";
import { z } from "zod";

const FormularioProducto = () => {
  const [restablecerFormulario, setRestablecerFormulario] =
    useState<boolean>(false);
  const [categorias, setCategorias] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const cargarCategorias = async () => {
      const resultado = await obtenerCategorias();
      if (resultado?.datos) {
        const opcionesFormateadas = resultado.datos.map((cat: Categoria) => ({
          value: cat.id,
          label: cat.nombre,
        }));
        setCategorias(opcionesFormateadas);
      } else {
        GeneradorAlerta({
          tipo: "error",
          texto: "Error",
          descripcion: "No se pudieron cargar las categorías",
        });
      }
    };

    cargarCategorias();
  }, []);

  const formFields: FieldConfig[] = [
    {
      nombre: "nombre",
      label: "Nombre del producto",
      tipo: "text",
      placeholder: "Ej. Paracetamol 500mg",
      validacion: EsquemaProducto.shape.nombre,
    },
    {
      nombre: "descripcion",
      label: "Descripción",
      tipo: "text",
      placeholder: "Ej. Tabletas para el dolor y la fiebre",
      validacion: EsquemaProducto.shape.descripcion,
    },
    {
      nombre: "codigoBarras",
      label: "Código de barras",
      tipo: "text",
      placeholder: "Ej. 1234567890123",
      validacion: EsquemaProducto.shape.codigoBarras,
    },
    {
      nombre: "registroInvima",
      label: "Registro INVIMA",
      tipo: "text",
      placeholder: "Ej. 2023M-0001234",
      validacion: EsquemaProducto.shape.registroInvima,
    },
    {
      nombre: "precioCompra",
      label: "Precio de compra",
      tipo: "number",
      placeholder: "Ej. 500",
      validacion: EsquemaProducto.shape.precioCompra,
    },
    {
      nombre: "precioVenta",
      label: "Precio de venta",
      tipo: "number",
      placeholder: "Ej. 1000",
      validacion: EsquemaProducto.shape.precioVenta,
    },
    {
      nombre: "unit",
      label: "Unidad",
      tipo: "select",
      placeholder: "Seleccione una opción",
      opciones: [
        { value: "unidad", label: "Unidad" },
        { value: "caja", label: "Caja" },
        { value: "frasco", label: "Frasco" },
        { value: "blíster", label: "Blíster" },
        { value: "ampolla", label: "Ampolla" },
        { value: "tableta", label: "Tableta" },
        { value: "sobres", label: "Sobres" },
        { value: "tubo", label: "Tubo" },
        { value: "botella", label: "Botella" },
      ],
      validacion: EsquemaProducto.shape.unidadMedida,
    },
    {
      nombre: "categoriaId",
      label: "Categoría",
      tipo: "select",
      opciones: categorias,
      placeholder: "Seleccione una opción",
      validacion: EsquemaProducto.shape.categoriaId,
    },
  ];

  const handleSubmit = (data: z.infer<typeof EsquemaProducto>) => {
    startTransition(() => {
      const parsedData = {
        ...data,
      };

      crearProducto(parsedData).then((response) => {
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
      titulo={"Registrar Producto"}
      descripcion={"Complete los campos para crear un nuevo producto"}
      restablecerFormulario={restablecerFormulario}
    />
  );
};

export default FormularioProducto;
