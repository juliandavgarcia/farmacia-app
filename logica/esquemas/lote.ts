import { z } from "zod";

export const EsquemaLote = z.object({
  productoId: z.string().nonempty("El producto es obligatorio"),
  numeroLote: z.string().nonempty("El número de lote es obligatorio"),
  fechaVencimiento: z.date({
    required_error: "La fecha de vencimiento es obligatoria",
    invalid_type_error: "Debe ser una fecha válida",
  }),
  cantidad: z.coerce
    .number()
    .positive({ message: "Debe ser un número positivo" }),
  disponible: z
    .number()
    .int("Debe ser un número entero")
    .min(0, "No puede ser negativo")
    .optional(),
  creadoEn: z.date().optional(),
  actualizadoEn: z.date().optional(),
});

export type Lote = z.infer<typeof EsquemaLote>;
