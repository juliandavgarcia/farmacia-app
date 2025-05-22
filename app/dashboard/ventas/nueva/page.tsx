import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { VentasForm } from "@/componentes/dashboard/ventas/nueva/ventas-form";

export default function VentasPage() {
  return (
    <div className="mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Registro de Ventas</h1>
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <VentasForm />
      </Suspense>
    </div>
  );
}
