import { z } from "zod";

export const EsquemaCliente = z.object({
  id: z.string().optional(),
  documento: z.string().min(1, { message: "El documento es requerido" }),
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  correo: z.string().email("Debe ser un correo válido").optional(),
});

export type Cliente = z.infer<typeof EsquemaCliente>;
