import ContadorCategoria from "../dashboard/categorias/contador-categoria";
import RepBarCantidadProductosPorCategoria from "../dashboard/productos/reportes/rep-bar-cantidad-productos-por-categoria";
import RepTorCantidadProductosPorCategoria from "../dashboard/productos/reportes/rep-tor-cantidad-productos-por-categoria";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const ReporteCategorias = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporte de Categorías</CardTitle>
        <CardDescription>Descripción del reporte de categorías</CardDescription>
      </CardHeader>
      <CardContent>
        <ContadorCategoria />
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <RepBarCantidadProductosPorCategoria />
          <RepTorCantidadProductosPorCategoria />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReporteCategorias;
