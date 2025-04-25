import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { obtenerUsuarioPorCorreo } from "./logica/acciones/acciones-usuario";
import { esquemaFormularioLogin } from "./logica/esquemas/login";

export default {
  providers: [
    Credentials({
      async authorize(credenciales) {
        const validarCampos = esquemaFormularioLogin.safeParse(credenciales);

        if (validarCampos.success) {
          const { correo, contrasena } = validarCampos.data;

          const usuario = await obtenerUsuarioPorCorreo(correo);
          if (!usuario || !usuario.contrasena) {
            return null;
          }

          const coincidenciaContrasena = await bcrypt.compare(
            contrasena,
            usuario.contrasena
          );
          if (coincidenciaContrasena) {
            return usuario;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
