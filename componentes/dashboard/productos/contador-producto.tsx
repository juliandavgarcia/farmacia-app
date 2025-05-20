"use client";

import React, { useEffect, useState } from "react";
import GeneradorContador from "@/componentes/graficas/generador-contador";
import { Book } from "lucide-react";

import {
  obtenerCantidadProductos,
  obtenerProductosHoy,
  obtenerProductosSemana,
  obtenerProductosMes,
} from "@/logica/acciones/acciones-producto";

const ContadorProducto: React.FC = () => {
  const [total, setTotal] = useState<number>(0);
  const [hoy, setHoy] = useState<number>(0);
  const [semana, setSemana] = useState<number>(0);
  const [mes, setMes] = useState<number>(0);

  useEffect(() => {
    const cargarDatos = async () => {
      const totalRes = await obtenerCantidadProductos();
      const hoyRes = await obtenerProductosHoy();
      const semanaRes = await obtenerProductosSemana();
      const mesRes = await obtenerProductosMes();

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
        title="Total Productos"
        count={total}
        icon={<Book className="h-5 w-5" />}
        color="blue"
      />
      <GeneradorContador
        title="Productos Hoy"
        count={hoy}
        icon={<Book className="h-5 w-5" />}
        color="green"
      />
      <GeneradorContador
        title="Productos Semana"
        count={semana}
        icon={<Book className="h-5 w-5" />}
        color="red"
      />
      <GeneradorContador
        title="Productos Mes"
        count={mes}
        icon={<Book className="h-5 w-5" />}
        color="yellow"
      />
    </div>
  );
};

export default ContadorProducto;
