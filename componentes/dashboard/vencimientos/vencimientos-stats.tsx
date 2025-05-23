import {
  AlertTriangle,
  Clock,
  CalendarCheck,
  CalendarDays,
} from "lucide-react";

interface VencimientosStatsProps {
  vencidos: number;
  proximosAVencer: number;
  medioTermino: number;
  largoTermino: number;
}

export default function VencimientosStats({
  vencidos,
  proximosAVencer,
  medioTermino,
  largoTermino,
}: VencimientosStatsProps) {
  const total = vencidos + proximosAVencer + medioTermino + largoTermino;

  // Calcular porcentajes para las barras de progreso
  const porcentajeVencidos = total > 0 ? (vencidos / total) * 100 : 0;
  const porcentajeProximos = total > 0 ? (proximosAVencer / total) * 100 : 0;
  const porcentajeMedio = total > 0 ? (medioTermino / total) * 100 : 0;
  const porcentajeLargo = total > 0 ? (largoTermino / total) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Vencidos */}
      <div className="bg-white dark:bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Vencidos
            </p>
            <h3 className="text-2xl font-bold">{vencidos}</h3>
          </div>
        </div>
        <div className="mt-4 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 rounded-full"
            style={{ width: `${porcentajeVencidos}%` }}
          ></div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {porcentajeVencidos.toFixed(1)}% del total
        </p>
      </div>

      {/* Próximos a vencer */}
      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-full">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Próximos 30 días
            </p>
            <h3 className="text-2xl font-bold">{proximosAVencer}</h3>
          </div>
        </div>
        <div className="mt-4 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full"
            style={{ width: `${porcentajeProximos}%` }}
          ></div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {porcentajeProximos.toFixed(1)}% del total
        </p>
      </div>

      {/* Medio término */}
      <div className="bg-white dark:bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              31-90 días
            </p>
            <h3 className="text-2xl font-bold">{medioTermino}</h3>
          </div>
        </div>
        <div className="mt-4 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${porcentajeMedio}%` }}
          ></div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {porcentajeMedio.toFixed(1)}% del total
        </p>
      </div>

      {/* Largo término */}
      <div className="bg-white dark:bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
            <CalendarCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              +90 días
            </p>
            <h3 className="text-2xl font-bold">{largoTermino}</h3>
          </div>
        </div>
        <div className="mt-4 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${porcentajeLargo}%` }}
          ></div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {porcentajeLargo.toFixed(1)}% del total
        </p>
      </div>
    </div>
  );
}
