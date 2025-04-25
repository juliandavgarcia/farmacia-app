"use client";

import { Button } from "@/componentes/ui/button";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 text-center">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          {appName}
        </Link>
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-semibold">¡Ups! Página no encontrada</p>
          <Button onClick={() => (window.location.href = "/")}>
            Regresar al inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
