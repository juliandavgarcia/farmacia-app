import { addDays, isBefore, isAfter } from "date-fns";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Filter,
  RefreshCw,
} from "lucide-react";

import { Badge } from "@/componentes/ui/badge";
import { Button } from "@/componentes/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/componentes/ui/tabs";
import { prisma } from "@/lib/db";
import VencimientosFilter from "@/componentes/dashboard/vencimientos/vencimientos-filter";
import VencimientosTable from "@/componentes/dashboard/vencimientos/vencimientos-table";
import VencimientosStats from "@/componentes/dashboard/vencimientos/vencimientos-stats";

export const dynamic = "force-dynamic";

// Función para obtener los productos con su vencimiento
async function getProductosVencimiento() {
  const hoy = new Date();
  const treintaDias = addDays(hoy, 30);
  const noventaDias = addDays(hoy, 90);

  // Obtener todos los inventarios con fecha de vencimiento
  const inventarios = await prisma.inventario.findMany({
    where: {
      fechaVencimiento: {
        not: null,
      },
      cantidad: {
        gt: 0, // Solo productos con stock
      },
    },
    include: {
      producto: {
        include: {
          categoria: true,
        },
      },
    },
    orderBy: {
      fechaVencimiento: "asc",
    },
  });

  // Clasificar los productos por su fecha de vencimiento
  const vencidos = inventarios.filter(
    (inv) =>
      inv.fechaVencimiento && isBefore(new Date(inv.fechaVencimiento), hoy)
  );

  const proximosAVencer = inventarios.filter(
    (inv) =>
      inv.fechaVencimiento &&
      isAfter(new Date(inv.fechaVencimiento), hoy) &&
      isBefore(new Date(inv.fechaVencimiento), treintaDias)
  );

  const medioTermino = inventarios.filter(
    (inv) =>
      inv.fechaVencimiento &&
      isAfter(new Date(inv.fechaVencimiento), treintaDias) &&
      isBefore(new Date(inv.fechaVencimiento), noventaDias)
  );

  const largoTermino = inventarios.filter(
    (inv) =>
      inv.fechaVencimiento &&
      isAfter(new Date(inv.fechaVencimiento), noventaDias)
  );

  return {
    vencidos,
    proximosAVencer,
    medioTermino,
    largoTermino,
    todos: inventarios,
  };
}

export default async function VencimientosPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { vencidos, proximosAVencer, medioTermino, largoTermino, todos } =
    await getProductosVencimiento();

  // Obtener categorías para los filtros
  const categorias = await prisma.categoria.findMany({
    orderBy: {
      nombre: "asc",
    },
  });

  // Determinar la pestaña activa basada en los parámetros de búsqueda o usar "vencidos" por defecto
  const tabActiva = searchParams.tab || "vencidos";

  return (
    <div className="mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Control de Vencimientos
          </h1>
          <p className="text-muted-foreground">
            Monitoreo y gestión de productos próximos a vencer
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          <Button size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* Estadísticas de vencimientos */}
      <VencimientosStats
        vencidos={vencidos.length}
        proximosAVencer={proximosAVencer.length}
        medioTermino={medioTermino.length}
        largoTermino={largoTermino.length}
      />

      {/* Filtros */}
      <VencimientosFilter categorias={categorias} />

      {/* Tabs para diferentes períodos de vencimiento */}
      <Tabs defaultValue={tabActiva as string} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="vencidos" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Vencidos
            <Badge variant="destructive" className="ml-1">
              {vencidos.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="proximos" className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-warning" />
            30 días
            <Badge variant="outline" className="ml-1">
              {proximosAVencer.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="medio" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            90 días
            <Badge variant="outline" className="ml-1">
              {medioTermino.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="todos" className="flex items-center gap-1">
            Todos
            <Badge variant="outline" className="ml-1">
              {todos.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vencidos">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Productos Vencidos
              </CardTitle>
              <CardDescription>
                Productos que ya han superado su fecha de vencimiento y
                requieren atención inmediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VencimientosTable inventarios={vencidos} tipo="vencidos" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proximos">
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-500 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Próximos a Vencer (30 días)
              </CardTitle>
              <CardDescription>
                Productos que vencerán en los próximos 30 días y requieren
                atención pronta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VencimientosTable
                inventarios={proximosAVencer}
                tipo="proximos"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medio">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Vencimiento a Medio Plazo (90 días)
              </CardTitle>
              <CardDescription>
                Productos que vencerán en los próximos 31 a 90 días
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VencimientosTable inventarios={medioTermino} tipo="medio" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle>Todos los Productos con Vencimiento</CardTitle>
              <CardDescription>
                Lista completa de todos los productos con fecha de vencimiento
                registrada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VencimientosTable inventarios={todos} tipo="todos" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
