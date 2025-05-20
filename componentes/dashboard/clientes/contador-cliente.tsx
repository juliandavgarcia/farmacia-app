"use client";

import { useEffect, useState } from "react";
import GeneradorContador from "@/componentes/graficas/generador-contador";
import { Book } from "lucide-react";
import {
  obtenerCantidadClientes,
  obtenerClientesHoy,
  obtenerClientesSemana,
  obtenerClientesMes,
} from "@/logica/acciones/acciones-cliente";

const ContadorCliente: React.FC = () => {
  const [total, setTotal] = useState(0);
  const [hoy, setHoy] = useState(0);
  const [semana, setSemana] = useState(0);
  const [mes, setMes] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      const totalRes = await obtenerCantidadClientes();
      const hoyRes = await obtenerClientesHoy();
      const semanaRes = await obtenerClientesSemana();
      const mesRes = await obtenerClientesMes();

      if (totalRes.datos) setTotal(totalRes.datos);
      if (hoyRes.datos) setHoy(hoyRes.datos);
      if (semanaRes.datos) setSemana(semanaRes.datos);
      if (mesRes.datos) setMes(mesRes.datos);
    };

    cargarDatos();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <GeneradorContador
        title="Total Clientes"
        count={total}
        icon={<Book className="h-5 w-5" />}
        color="blue"
      />
      <GeneradorContador
        title="Clientes Hoy"
        count={hoy}
        icon={<Book className="h-5 w-5" />}
        color="green"
      />
      <GeneradorContador
        title="Clientes Semana"
        count={semana}
        icon={<Book className="h-5 w-5" />}
        color="red"
      />
      <GeneradorContador
        title="Clientes Mes"
        count={mes}
        icon={<Book className="h-5 w-5" />}
        color="yellow"
      />
    </div>
  );
};

export default ContadorCliente;
