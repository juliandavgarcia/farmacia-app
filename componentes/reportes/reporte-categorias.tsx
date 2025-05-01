import ContadorCategoria from "../dashboard/categorias/contador-categoria";
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
      </CardContent>
    </Card>
  );
};

export default ReporteCategorias;
