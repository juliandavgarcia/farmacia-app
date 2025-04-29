import TablaHistorialCompras from "@/componentes/dashboard/compras/tabla-historial-compras";
import GeneradorTitulo from "@/componentes/generadores/generador-titulo";

const PaginaCompras = () => {
  return (
    <div className="mx-auto p-4">
      <GeneradorTitulo title={"Historial de compras"} />
      <TablaHistorialCompras />
    </div>
  );
};
export default PaginaCompras;
