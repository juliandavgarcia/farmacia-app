import {
  GeneradorPestaña,
  TabItem,
} from "@/componentes/generadores/generador-pestaña";
import GeneradorTitulo from "@/componentes/generadores/generador-titulo";
import ReporteCategorias from "@/componentes/reportes/reporte-categorias";
import ReporteClientes from "@/componentes/reportes/reporte-clientes";
import ReporteCompras from "@/componentes/reportes/reporte-compras";
import ReporteProductos from "@/componentes/reportes/reporte-productos";
import ReporteProveedores from "@/componentes/reportes/reporte-proveedores";
import ReporteVentas from "@/componentes/reportes/reporte-ventas";

export const metadata = {
  title: "Reportes",
  description: "Aquí puedes ver los reportes del negocio.",
};

const PaginaReportes = () => {
  const tabs: TabItem[] = [
    {
      valor: "reporte_ventas",
      label: "Ventas",
      icono: "ShoppingCart",
      contenido: <ReporteVentas />,
    },
    {
      valor: "reporte_compras",
      label: "Compras",
      icono: "Truck",
      contenido: <ReporteCompras />,
    },
    {
      valor: "reporte_productos",
      label: "Productos",
      icono: "List",
      contenido: <ReporteProductos />,
    },
    {
      valor: "reporte_clientes",
      label: "Clientes",
      icono: "Users",
      contenido: <ReporteClientes />,
    },
    {
      valor: "reporte_proveedores",
      label: "Proveedores",
      icono: "Users",
      contenido: <ReporteProveedores />,
    },
    {
      valor: "reporte_categorias",
      label: "Categorías",
      icono: "Book",
      contenido: <ReporteCategorias />,
    },
  ];

  return (
    <div className="mx-auto p-4">
      <GeneradorTitulo title="Reportes" />
      <GeneradorPestaña tabs={tabs} />
    </div>
  );
};

export default PaginaReportes;
