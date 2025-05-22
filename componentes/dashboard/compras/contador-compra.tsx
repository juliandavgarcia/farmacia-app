"use client";

import GeneradorContador from "@/componentes/graficas/generador-contador";
import { Book } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  obtenerCantidadCompras,
  obtenerComprasHoy,
  obtenerComprasSemana,
  obtenerComprasMes,
} from "@/logica/acciones/acciones-compra";

const ContadorCompra: React.FC = () => {
  const [comprasHoy, setComprasHoy] = useState<number>(0);
  const [comprasSemana, setComprasSemana] = useState<number>(0);
  const [comprasMes, setComprasMes] = useState<number>(0);
  const [cantidadTotal, setCantidadTotal] = useState<number>(0);

  useEffect(() => {
    const cargarDatos = async () => {
      const totalRes = await obtenerCantidadCompras();
      const hoyRes = await obtenerComprasHoy();
      const semanaRes = await obtenerComprasSemana();
      const mesRes = await obtenerComprasMes();

      if (totalRes.datos) setCantidadTotal(totalRes.datos);
      if (hoyRes.datos)
        setComprasHoy(Array.isArray(hoyRes.datos) ? hoyRes.datos.length : 0);
      if (semanaRes.datos)
        setComprasSemana(
          Array.isArray(semanaRes.datos) ? semanaRes.datos.length : 0
        );
      if (mesRes.datos)
        setComprasMes(Array.isArray(mesRes.datos) ? mesRes.datos.length : 0);
    };

    cargarDatos();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <GeneradorContador
        title="Total Compras"
        count={cantidadTotal}
        icon={<Book className="h-5 w-5" />}
        color="blue"
      />
      <GeneradorContador
        title="Compras Hoy"
        count={comprasHoy}
        icon={<Book className="h-5 w-5" />}
        color="green"
      />
      <GeneradorContador
        title="Compras Semana"
        count={comprasSemana}
        icon={<Book className="h-5 w-5" />}
        color="red"
      />
      <GeneradorContador
        title="Compras Mes"
        count={comprasMes}
        icon={<Book className="h-5 w-5" />}
        color="yellow"
      />
    </div>
  );
};

export default ContadorCompra;
