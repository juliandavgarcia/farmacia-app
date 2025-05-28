import ClientesFieles from "./clientes-fieles";
import ProductosMasVendidos from "./productos-mas-vendidos";
import UltimasVentas from "./ultimas-ventas";

export default function DashboardSection() {
  return (
    <div className="mt-4 space-y-6">
      {/* Primera fila - Componentes principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UltimasVentas/>
        <ClientesFieles />
        <ProductosMasVendidos />
      </div>
    </div>
  );
}
