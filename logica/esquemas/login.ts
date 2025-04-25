import { z } from "zod";

export const esquemaFormularioLogin = z.object({
  correo: z.string().email("Correo electrónico inválido"),
  contrasena: z.string().min(1, { message: "La contraseña es requerida" }),
});

export type Login = z.infer<typeof esquemaFormularioLogin>;
