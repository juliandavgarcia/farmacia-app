"use client";

import { useEffect, useState } from "react";
import GeneradorContador from "@/componentes/graficas/generador-contador";
import { Book } from "lucide-react";
import {
  obtenerCantidadProveedores,
  obtenerProveedoresHoy,
  obtenerProveedoresSemana,
  obtenerProveedoresMes,
} from "@/logica/acciones/acciones-proveedor";

const ContadorProveedor: React.FC = () => {
  const [total, setTotal] = useState(0);
  const [hoy, setHoy] = useState(0);
  const [semana, setSemana] = useState(0);
  const [mes, setMes] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      const totalRes = await obtenerCantidadProveedores();
      const hoyRes = await obtenerProveedoresHoy();
      const semanaRes = await obtenerProveedoresSemana();
      const mesRes = await obtenerProveedoresMes();

      if (totalRes.data) setTotal(totalRes.data);
      if (hoyRes.data) setHoy(hoyRes.data);
      if (semanaRes.data) setSemana(semanaRes.data);
      if (mesRes.data) setMes(mesRes.data);
    };

    cargarDatos();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <GeneradorContador
        title="Total Proveedores"
        count={total}
        icon={<Book className="h-5 w-5" />}
        color="blue"
      />
      <GeneradorContador
        title="Proveedores Hoy"
        count={hoy}
        icon={<Book className="h-5 w-5" />}
        color="blue"
      />
      <GeneradorContador
        title="Proveedores Semana"
        count={semana}
        icon={<Book className="h-5 w-5" />}
        color="blue"
      />
      <GeneradorContador
        title="Proveedores Mes"
        count={mes}
        icon={<Book className="h-5 w-5" />}
        color="blue"
      />
    </div>
  );
};

export default ContadorProveedor;
