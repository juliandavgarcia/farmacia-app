"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/componentes/ui/dropdown-menu";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/componentes/ui/button";
import { cerrarSesionUsuario } from "@/logica/acciones/acciones-login";

interface PropiedadesBotonPerfil {
  usuario: {
    id: string;
    nombre?: string | null;
    correo?: string | null;
    correoVerificado?: Date | null;
    imagen?: string | null;
    rol: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
  };
}

export function BotonUsuario({ usuario }: PropiedadesBotonPerfil) {
  const nombreUsuario = usuario?.nombre || "Usuario";
  const correoUsuario = usuario?.correo || "Correo";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="done" size="icon">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-2">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-blue-700 dark:text-white">
              {nombreUsuario}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {correoUsuario}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <FiUser className="mr-2 h-4 w-4 text-blue-700 dark:text-white" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/settings"
              className="w-full flex items-center"
            >
              <FiSettings className="mr-2 h-4 w-4 text-blue-700 dark:text-white" />
              <span>Configuración</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={cerrarSesionUsuario}
          className="hover:bg-red-50 dark:hover:bg-muted"
        >
          <FiLogOut className="mr-2 h-4 w-4 text-red-700 dark:text-white" />
          <span className="text-red-700 dark:text-white">Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
