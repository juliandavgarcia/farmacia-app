import FormularioUsuario from "@/componentes/dashboard/usuarios/formulario-usuario";
import {
  GeneradorPestaña,
  TabItem,
} from "@/componentes/generadores/generador-pestaña";
import GeneradorTitulo from "@/componentes/generadores/generador-titulo";

export const metadata = {
  title: "Usuarios",
  description: "Administra los usuarios del sistema farmacéutico.",
};

const PaginaUsuarios = () => {
  const tabs: TabItem[] = [
    {
      valor: "register",
      label: "Registar",
      icono: "ListOrdered",
      contenido: <FormularioUsuario />,
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
      <GeneradorTitulo title="Gestor de usuarios" />
      <GeneradorPestaña tabs={tabs} />
    </div>
  );
};
export default PaginaUsuarios;
