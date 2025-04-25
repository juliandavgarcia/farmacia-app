"use client";

import { NombreAplicacion } from "@/lib/env";

export default function Footer() {
  return (
    <footer className="w-full border-t py-6 bg-card">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <p className="text-sm text-neutral-600">
          © {new Date().getFullYear()} {NombreAplicacion}. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
