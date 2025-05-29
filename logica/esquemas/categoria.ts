import { z } from "zod";

/**
 * EsquemaCategoria define la estructura de una categoría.
 * Utiliza Zod para validar los campos esperados.
 */
export const EsquemaCategoria = z.object({
  /**
   * ID único de la categoría.
   * Opcional, puede ser generado automáticamente.
   */
  id: z.string().optional(),

  /**
   * Nombre de la categoría.
   * Es obligatorio y debe contener al menos 1 carácter.
   */
  nombre: z
    .string()
    .min(1, { message: "El nombre de la categoría es requerido" }),

  /**
   * Descripción de la categoría.
   * Es opcional y puede usarse para detallar su propósito o contenido.
   */
  descripcion: z.string().optional(),

  /**
   * Fecha de creación de la categoría.
   * Es opcional y útil para llevar registro histórico.
   */
  creadoEn: z.date().optional(),

  /**
   * Fecha de última actualización de la categoría.
   * Es opcional y se puede usar para control de cambios.
   */
  actualizadoEn: z.date().optional(),
});

/**
 * Tipo inferido de la categoría a partir del esquema.
 * Útil para tener tipado estático en TypeScript.
 */
export type Categoria = z.infer<typeof EsquemaCategoria>;
