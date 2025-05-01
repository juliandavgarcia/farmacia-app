import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ContadorCliente from "../dashboard/clientes/contador-cliente";

const ReporteClientes = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporte de Clientes</CardTitle>
        <CardDescription>Descripción del reporte de clientes</CardDescription>
      </CardHeader>
      <CardContent>
        <ContadorCliente />
      </CardContent>
    </Card>
  );
};

export default ReporteClientes;
