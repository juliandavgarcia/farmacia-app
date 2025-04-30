import { z } from "zod";

export const EsquemaCategoria = z.object({
  id: z.string().optional(),
  nombre: z
    .string()
    .min(1, { message: "El nombre de la categoría es requerido" }),
  descripcion: z.string().optional(),
});

export type Categoria = z.infer<typeof EsquemaCategoria>;
