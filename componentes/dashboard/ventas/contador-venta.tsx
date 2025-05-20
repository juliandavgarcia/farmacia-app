"use client";

import GeneradorContador from "@/componentes/graficas/generador-contador";
import { Book } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  obtenerCantidadVentas,
  obtenerVentasHoy,
  obtenerVentasSemana,
  obtenerVentasMes,
} from "@/logica/acciones/acciones-venta";

const ContadorVenta: React.FC = () => {
  const [ventasHoy, setVentasHoy] = useState<number>(0);
  const [ventasSemana, setVentasSemana] = useState<number>(0);
  const [ventasMes, setVentasMes] = useState<number>(0);
  const [cantidadTotal, setCantidadTotal] = useState<number>(0);

  useEffect(() => {
    const cargarDatos = async () => {
      const totalRes = await obtenerCantidadVentas();
      const hoyRes = await obtenerVentasHoy();
      const semanaRes = await obtenerVentasSemana();
      const mesRes = await obtenerVentasMes();

      if (totalRes.datos) setCantidadTotal(totalRes.datos);
      if (hoyRes.datos) setVentasHoy(hoyRes.datos);
      if (semanaRes.datos) setVentasSemana(semanaRes.datos);
      if (mesRes.datos) setVentasMes(mesRes.datos);
    };

    cargarDatos();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <GeneradorContador
        title="Total Ventas"
        count={cantidadTotal}
        icon={<Book className="h-5 w-5" />}
        color="blue"
      />
      <GeneradorContador
        title="Ventas Hoy"
        count={ventasHoy}
        icon={<Book className="h-5 w-5" />}
        color="green"
      />
      <GeneradorContador
        title="Ventas Semana"
        count={ventasSemana}
        icon={<Book className="h-5 w-5" />}
        color="red"
      />
      <GeneradorContador
        title="Ventas Mes"
        count={ventasMes}
        icon={<Book className="h-5 w-5" />}
        color="yellow"
      />
    </div>
  );
};

export default ContadorVenta;
