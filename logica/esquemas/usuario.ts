import { z } from "zod";

const BaseEsquemaUsuario = z.object({
  id: z.string().uuid({ message: "El ID debe ser un UUID válido" }).optional(),
  nombre: z.string().nonempty("El nombre es obligatorio"),
  correo: z.string().email("El correo electrónico no es válido"),
  contrasena: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmarContrasena: z
    .string()
    .nonempty("La confirmación de contraseña es obligatoria")
    .optional(),
  rol: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Debe seleccionar un rol válido" }),
  }),
  estado: z.boolean().default(true).optional(),
  creadoEn: z.date().optional(),
  actualizadoEn: z.date().optional(),
});

export const EsquemaUsuario = BaseEsquemaUsuario.refine(
  (data) => data.contrasena === data.confirmarContrasena,
  {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  }
);

export const EsquemaUsuarioActualizacion = z.object({
  id: z.string().optional(),
  nombre: z.string(),
  correo: z.string().email(),
  rol: z.enum(["USER", "ADMIN"]),
  estado: z.boolean().optional(),
});

export type Usuario = z.infer<typeof EsquemaUsuario>;
export const CamposUsuario = BaseEsquemaUsuario.shape; // 👈 Esto es lo que usarás en el formulario
