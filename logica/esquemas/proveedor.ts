import { z } from "zod";

export const EsquemaProveedor = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  nit: z.string().min(1, { message: "El NIT es requerido" }),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  correo: z.string().email("Debe ser un correo válido").optional(),
  contacto: z.string().optional(),
  creadoEn: z.date().optional(),
  actualizadoEn: z.date().optional(),
});

export type Proveedor = z.infer<typeof EsquemaProveedor>;
