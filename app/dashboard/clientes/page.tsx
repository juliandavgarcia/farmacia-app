import FormularioCliente from "@/componentes/dashboard/clientes/formulario-cliente";
import TablaCliente from "@/componentes/dashboard/clientes/tabla-cliente";
import {
  GeneradorPestaña,
  TabItem,
} from "@/componentes/generadores/generador-pestaña";
import GeneradorTitulo from "@/componentes/generadores/generador-titulo";

export const metadata = {
  title: "Clientes",
  description:
    "Explorá las clientes disponibles en nuestro sistema farmacéutico.",
};

export default function PaginaClientes() {
  const tabs: TabItem[] = [
    {
      valor: "register",
      label: "Registar",
      icono: "User",
      contenido: <FormularioCliente />,
    },
    {
      valor: "consult",
      label: "Consultar",
      icono: "Search",
      contenido: <TablaCliente />,
    },
  ];

  return (
    <div className="mx-auto p-4">
      <GeneradorTitulo title="Gestor de clientes" />
      <GeneradorPestaña tabs={tabs} />
    </div>
  );
}
