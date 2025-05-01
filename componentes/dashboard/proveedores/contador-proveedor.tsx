"use client";

import GeneradorContador from "@/componentes/graficas/generador-contador";
import { Book } from "lucide-react";
import React, { useEffect, useState } from "react";

const ContadorProveedor: React.FC = () => {
  const [categoriasHoy, setCategoriasHoy] = useState<number>(0);
  const [categoriasSemana, setCategoriasSemana] = useState<number>(0);
  const [categoriasMes, setCategoriasMes] = useState<number>(0);
  const [cantidadTotal, setCantidadTotal] = useState<number>(0);

  useEffect(() => {
    setCategoriasHoy(12);
    setCategoriasSemana(50);
    setCategoriasMes(150);
    setCantidadTotal(200);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <GeneradorContador
        title="Total Proveedores"
        count={cantidadTotal}
        icon={<Book className="h-5 w-5" />}
        color="blue"
      />
      <GeneradorContador
        title="Proveedores Hoy"
        count={categoriasHoy}
        icon={<Book className="h-5 w-5" />}
        color="blue"
      />
      <GeneradorContador
        title="Proveedores Semana"
        count={categoriasSemana}
        icon={<Book className="h-5 w-5" />}
        color="blue"
      />
      <GeneradorContador
        title="Proveedores Mes"
        count={categoriasMes}
        icon={<Book className="h-5 w-5" />}
        color="blue"
      />
    </div>
  );
};

export default ContadorProveedor;
