import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const ReporteClientes = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporte de Clientes</CardTitle>
        <CardDescription>Descripción del reporte de clientes</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido del reporte de clientes</p>
      </CardContent>
    </Card>
  );
};

export default ReporteClientes;
