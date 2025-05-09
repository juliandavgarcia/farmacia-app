import { BarChartGenerator } from "@/componentes/graficas/generador-grafico-barras";
import { obtenerCantidadProductosPorCategoria } from "@/logica/acciones/acciones-producto";

const RepBarCantidadProductosPorCategoria = async () => {
  const respuesta = await obtenerCantidadProductosPorCategoria();
  const datos = respuesta.datos ?? []; // Aseguramos que sea array

  const chartConfig = {
    cantidad: {
      label: "Cantidad",
      color: "#0066cc",
    },
  };

  return (
    <BarChartGenerator
      data={datos}
      xAxisKey="categoria"
      series={chartConfig}
      title="Productos por Categoría"
      description="Productos activos agrupados por categoría"
      footerNote="Total actualizado"
    />
  );
};

export default RepBarCantidadProductosPorCategoria;
