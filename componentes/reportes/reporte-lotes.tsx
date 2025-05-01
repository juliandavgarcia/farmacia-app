import ContadorLote from "../dashboard/lotes/contador-lote";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const ReporteLotes = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporte de Lotes</CardTitle>
        <CardDescription>Descripción del reporte de lotes</CardDescription>
      </CardHeader>
      <CardContent>
        <ContadorLote />
      </CardContent>
    </Card>
  );
};

export default ReporteLotes;
