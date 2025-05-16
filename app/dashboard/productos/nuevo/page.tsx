import FormularioProducto from "@/componentes/dashboard/productos/formulario-producto";
import GeneradorTitulo from "@/componentes/generadores/generador-titulo";
import { Button } from "@/componentes/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const PaginaNuevoProducto = () => {
  return (
    <div className="mx-auto p-4">
      <Button variant="outline" size="icon" asChild>
        <Link href="/dashboard/productos">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <GeneradorTitulo title={"Registrar producto"} />
      <FormularioProducto />
    </div>
  );
};

export default PaginaNuevoProducto;
