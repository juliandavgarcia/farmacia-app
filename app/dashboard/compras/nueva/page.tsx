import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import {
  obtenerProductos,
  obtenerProveedores,
} from "@/logica/acciones/acciones-compra";
import FormularioCompra from "@/componentes/dashboard/compras/nueva-compra/formulario-compra";

export default async function PaginaCompra() {
  const proveedores = await obtenerProveedores();
  const productos = await obtenerProductos();

  return (
    <div className="mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">
        Gestión de Compras
      </h1>

      <div className="grid gap-8">
        <div className="p-6 bg-white rounded-lg shadow-md border border-slate-100">
          <h2 className="text-xl font-semibold mb-6 text-slate-800 pb-2 border-b">
            Nueva Compra
          </h2>
          <Suspense
            fallback={
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-slate-600">
                  Cargando formulario...
                </span>
              </div>
            }
          >
            <FormularioCompra
              proveedoresIniciales={proveedores}
              productosIniciales={productos}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
