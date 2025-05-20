"use client";

import { useEffect, useState } from "react";
import GeneradorContador from "@/componentes/graficas/generador-contador";
import { Book } from "lucide-react";
import {
  obtenerCantidadCategorias,
  obtenerCategoriasHoy,
  obtenerCategoriasSemana,
  obtenerCategoriasMes,
} from "@/logica/acciones/acciones-categoria";

const ContadorCategoria: React.FC = () => {
  const [cantidadTotal, setCantidadTotal] = useState(0);
  const [categoriasHoy, setCategoriasHoy] = useState(0);
  const [categoriasSemana, setCategoriasSemana] = useState(0);
  const [categoriasMes, setCategoriasMes] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      const totalRes = await obtenerCantidadCategorias();
      const hoyRes = await obtenerCategoriasHoy();
      const semanaRes = await obtenerCategoriasSemana();
      const mesRes = await obtenerCategoriasMes();

      if (totalRes.data) setCantidadTotal(totalRes.data);
      if (hoyRes.data) setCategoriasHoy(hoyRes.data);
      if (semanaRes.data) setCategoriasSemana(semanaRes.data);
      if (mesRes.data) setCategoriasMes(mesRes.data);
    };

    cargarDatos();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <GeneradorContador
        title="Total Categorías"
        count={cantidadTotal}
        icon={<Book className="h-5 w-5" />}
        color="blue"
      />
      <GeneradorContador
        title="Categorías Hoy"
        count={categoriasHoy}
        icon={<Book className="h-5 w-5" />}
        color="green"
      />
      <GeneradorContador
        title="Categorías Semana"
        count={categoriasSemana}
        icon={<Book className="h-5 w-5" />}
        color="red"
      />
      <GeneradorContador
        title="Categorías Mes"
        count={categoriasMes}
        icon={<Book className="h-5 w-5" />}
        color="yellow"
      />
    </div>
  );
};

export default ContadorCategoria;
