import ContadorProducto from "../dashboard/productos/contador-producto";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const ReporteProductos = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporte de Productos</CardTitle>
        <CardDescription>Descripción del reporte de productos</CardDescription>
      </CardHeader>
      <CardContent>
        <ContadorProducto />
      </CardContent>
    </Card>
  );
};

export default ReporteProductos;
