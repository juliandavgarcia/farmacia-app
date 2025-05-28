import Bienvenido from "@/componentes/dashboard/sistema/bienvenido";
import ContadorPlataVentas from "@/componentes/dashboard/sistema/contador-dinero-ventas";
import DashboardSection from "@/componentes/dashboard/sistema/dashboard-section";

const DashboardPage = () => {
  return (
    <div className="mx-auto p-4">
      <Bienvenido />
      <div className="mt-4">
        <ContadorPlataVentas />
      </div>
      <div>
        <DashboardSection />
      </div>
    </div>
  );
};

export default DashboardPage;
