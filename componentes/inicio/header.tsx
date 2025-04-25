"use client";

import Link from "next/link";
import { Button } from "@/componentes/ui/button";
import { BotonTema } from "../tema/boton-tema";
import { NombreAplicacion } from "@/lib/env";

const Header = () => {
  return (
    <header className="w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-lg font-bold">
          {NombreAplicacion}
        </Link>

        <div className="flex ml-auto space-x-2">
          <BotonTema />
          <Button asChild>
            <Link href="/auth/login">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
