import FormularioLote from "@/componentes/dashboard/lotes/formulario-lote";
import {
  GeneradorPestaña,
  TabItem,
} from "@/componentes/generadores/generador-pestaña";
import GeneradorTitulo from "@/componentes/generadores/generador-titulo";

export const metadata = {
  title: "Lotes de productos",
  description:
    "Explorá llos lotes disponibles en nuestro sistema farmacéutico.",
};

const PaginaLotes = () => {
  const tabs: TabItem[] = [
    {
      valor: "register",
      label: "Registar",
      icono: "Boxes",
      contenido: <FormularioLote />,
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
      <GeneradorTitulo title="Gestor de lotes de productos" />
      <GeneradorPestaña tabs={tabs} />
    </div>
  );
};

export default PaginaLotes;
