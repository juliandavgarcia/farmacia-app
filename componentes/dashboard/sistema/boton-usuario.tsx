"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/componentes/ui/dropdown-menu";
import { FiLogOut } from "react-icons/fi";
import { User } from "lucide-react";
import { Button } from "@/componentes/ui/button";
import { cerrarSesionUsuario } from "@/logica/acciones/acciones-login";

export function BotonUsuario() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="done" size="icon">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-2">
        <DropdownMenuGroup></DropdownMenuGroup>
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
