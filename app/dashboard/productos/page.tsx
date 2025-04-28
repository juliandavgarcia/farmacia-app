import FormularioProducto from "@/componentes/dashboard/productos/formulario-producto";
import {
  GeneradorPestaña,
  TabItem,
} from "@/componentes/generadores/generador-pestaña";
import GeneradorTitulo from "@/componentes/generadores/generador-titulo";

export const metadata = {
  title: "Productos",
  description:
    "Explorá las productos disponibles en nuestro sistema farmacéutico.",
};

export default function PaginaProductos() {
  const tabs: TabItem[] = [
    {
      valor: "register",
      label: "Registar",
      icono: "ListOrdered",
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
      <GeneradorTitulo title="Gestor de productos de productos" />
      <GeneradorPestaña tabs={tabs} />
    </div>
  );
}
