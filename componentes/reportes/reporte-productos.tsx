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
        <p>Contenido del reporte de productos</p>
      </CardContent>
    </Card>
  );
};

export default ReporteProductos;
