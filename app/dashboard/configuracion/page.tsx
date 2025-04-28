import {
  GeneradorPestaña,
  TabItem,
} from "@/componentes/generadores/generador-pestaña";
import GeneradorTitulo from "@/componentes/generadores/generador-titulo";

export const metadata = {
  title: "Configuración",
  description: "Configuración de la aplicación para el usuario actual.",
};

const PaginaConfiguracion = () => {
  const tabs: TabItem[] = [
    {
      valor: "general",
      label: "General",
      icono: "Book",
      contenido: <></>,
    },
    {
      valor: "profile",
      label: "Perfil",
      icono: "User",
      contenido: <></>,
    },
  ];

  return (
    <div className="mx-auto p-4">
      <GeneradorTitulo title="Configuración" />
      <GeneradorPestaña tabs={tabs} />
    </div>
  );
};

export default PaginaConfiguracion;
