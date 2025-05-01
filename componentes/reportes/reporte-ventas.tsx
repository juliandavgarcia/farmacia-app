import ContadorVenta from "../dashboard/ventas/contador-venta";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const ReporteVentas = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporte de Ventas</CardTitle>
        <CardDescription>Descripción del reporte de ventas</CardDescription>
      </CardHeader>
      <CardContent>
        <ContadorVenta />
      </CardContent>
    </Card>
  );
};

export default ReporteVentas;
