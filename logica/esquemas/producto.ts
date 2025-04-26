import { z } from "zod";

export const EsquemaProducto = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, { message: "El nombre del producto es requerido" }),
  descripcion: z.string().optional(),
  codigoBarras: z.string().optional(),
  registroInvima: z.string().optional(),
  precioCompra: z.coerce
    .number()
    .positive({ message: "Debe ser un número positivo" }),
  precioVenta: z.coerce
    .number()
    .positive({ message: "Debe ser un número positivo" }),
  unidadMedida: z
    .string()
    .min(1, { message: "La unidad de medida es requerida" }),
  estado: z.coerce
    .boolean({ invalid_type_error: "Debe seleccionar si está activo o no" })
    .default(true),
  categoriaId: z.string().min(1, { message: "La categoría es requerida" }),
});

export type Producto = z.infer<typeof EsquemaProducto>;
