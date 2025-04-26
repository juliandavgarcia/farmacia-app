import FormularioProducto from "@/componentes/dashboard/productos/formulario-producto";
import {
  GeneradorPestaña,
  TabItem,
} from "@/componentes/generadores/generador-pestaña";
import GeneradorTitulo from "@/componentes/generadores/generador-titulo";

export const metadata = {
  title: "Categorías",
  description:
    "Explorá las categorías disponibles en nuestro sistema farmacéutico.",
};

export default function PaginaProductos() {
  const tabs: TabItem[] = [
    {
      valor: "register",
      label: "Registar",
      icono: "User",
      contenido: <FormularioProducto />,
    },
    {
      valor: "consult",
      label: "Consultar",
      icono: "Search",
      contenido: <></>,
    },
  ];

  return (
    <div className="mx-auto p-4">
      <GeneradorTitulo title="Gestor de categorías de productos" />
      <GeneradorPestaña tabs={tabs} />
    </div>
  );
}
