import { z } from "zod";

export const EsquemaUsuario = z
  .object({
    id: z
      .string()
      .uuid({ message: "El ID debe ser un UUID válido" })
      .optional(),
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
      required_error: "El rol es obligatorio",
      invalid_type_error: "El rol debe ser USUARIO o ADMINISTRADOR",
    }),
    estado: z.boolean().default(true).optional(),
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  });

export type Usuario = z.infer<typeof EsquemaUsuario>;
