import TablaHistorialVentas from "@/componentes/dashboard/ventas/tabla-historial-ventas";
import GeneradorTitulo from "@/componentes/generadores/generador-titulo";

const PaginaVentas = () => {
  return (
    <div className="mx-auto p-4">
      <GeneradorTitulo title={"Historial de ventas"} />
      <TablaHistorialVentas />
    </div>
  );
};
export default PaginaVentas;
