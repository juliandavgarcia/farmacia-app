import ContadorProveedor from "../dashboard/proveedores/contador-proveedor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const ReporteProveedores = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporte de Proveedores</CardTitle>
        <CardDescription>
          Descripción del reporte de proveedores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContadorProveedor />
      </CardContent>
    </Card>
  );
};

export default ReporteProveedores;
