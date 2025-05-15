import Link from "next/link";
import { Button } from "@/componentes/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function PaginaNoAutorizado() {
  return (
    <div className="h-full w-full flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-card rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center mb-6 animate-pulse">
              <ShieldAlert className="h-12 w-12 text-rose-500" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Acceso Restringido
            </h1>

            <div className="h-1 w-20 bg-rose-500 rounded mb-6"></div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Lo sentimos, no tienes los permisos necesarios para acceder a este
              módulo. Por favor, contacta con el administrador si crees que
              deberías tener acceso.
            </p>

            <div className="space-y-4 w-full sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Button
                variant="default"
                className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white"
                asChild
              >
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full sm:w-auto border-rose-200 dark:border-rose-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900"
                asChild
              >
                <Link href="/contacto">Contactar soporte</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-rose-500 p-4">
          <p className="text-white text-center text-sm">
            Si crees que esto es un error, por favor proporciona el siguiente
            código:
            <span className="font-mono font-bold ml-1">
              ERR-403-
              {Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
