import FormularioCompra from "@/componentes/dashboard/compras/nueva-compra/formulario-compra";
import GeneradorTitulo from "@/componentes/generadores/generador-titulo";

const PaginaNuevaCompra = () => {
  return (
    <div className="mx-auto p-4">
      <GeneradorTitulo title={"Registrar compra"} />
      <FormularioCompra />
    </div>
  );
};

export default PaginaNuevaCompra;
