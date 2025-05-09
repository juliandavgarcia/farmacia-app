// ❌ NO pongas 'use client' aquí
import { PieChartGenerator } from "@/componentes/graficas/generador-grafico-torta";
import { obtenerCantidadProductosPorCategoria } from "@/logica/acciones/acciones-producto";

type ProductoPorCategoria = {
  categoria: string;
  cantidad: number;
};

const RepTorCantidadProductosPorCategoria = async () => {
  const respuesta = await obtenerCantidadProductosPorCategoria();
  const datos: ProductoPorCategoria[] = respuesta.datos ?? [];

  const coloresVivos: string[] = [
    "hsl(0, 100%, 50%)", // rojo
    "hsl(30, 100%, 50%)", // naranja
    "hsl(60, 100%, 50%)", // amarillo
    "hsl(120, 100%, 40%)", // verde
    "hsl(200, 100%, 50%)", // celeste
    "hsl(240, 100%, 60%)", // azul
    "hsl(300, 100%, 60%)", // magenta
  ];

  const chartConfig = datos.reduce((acc, { categoria }, index) => {
    acc[categoria] = {
      label: categoria,
      color: coloresVivos[index % coloresVivos.length],
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const data = datos.map(({ categoria, cantidad }) => ({
    name: categoria,
    value: cantidad,
  }));

  return (
    <PieChartGenerator
      data={data}
      series={chartConfig}
      title="Productos por Categoría"
      description="Distribución de productos activos por categoría"
      footerNote="Datos actualizados"
    />
  );
};

export default RepTorCantidadProductosPorCategoria;
