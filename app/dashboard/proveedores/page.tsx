import FormularioProveedor from "@/componentes/dashboard/proveedores/formulario-proveedor";
import TablaProveedor from "@/componentes/dashboard/proveedores/tabla-proveedor";
import {
  GeneradorPestaña,
  TabItem,
} from "@/componentes/generadores/generador-pestaña";
import GeneradorTitulo from "@/componentes/generadores/generador-titulo";

export const metadata = {
  title: "Proveedores",
  description:
    "Explorá los proveedores disponibles en nuestro sistema farmacéutico.",
};

export default function PaginaProveedores() {
  const tabs: TabItem[] = [
    {
      valor: "register",
      label: "Registar",
      icono: "Book",
      contenido: <FormularioProveedor />,
    },
    {
      valor: "consult",
      label: "Consultar",
      icono: "Search",
      contenido: <TablaProveedor />,
    },
  ];

  return (
    <div className="mx-auto p-4">
      <GeneradorTitulo title="Gestor de proveedores" />
      <GeneradorPestaña tabs={tabs} />
    </div>
  );
}
