import ContadorCompra from "../dashboard/compras/contador-compra";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const ReporteCompras = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporte de Compras</CardTitle>
        <CardDescription>Descripción del reporte de compras</CardDescription>
      </CardHeader>
      <CardContent>
        <ContadorCompra />
      </CardContent>
    </Card>
  );
};

export default ReporteCompras;
