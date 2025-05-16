import { Package, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface ProductosStatsProps {
  totalProductos: number;
  productosActivos: number;
  productosInactivos: number;
  sinStock: number;
}

export default function ProductosStats({
  totalProductos,
  productosActivos,
  productosInactivos,
  sinStock,
}: ProductosStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total de Productos
            </p>
            <h3 className="text-2xl font-bold">{totalProductos}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Productos Activos
            </p>
            <h3 className="text-2xl font-bold">{productosActivos}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
            <XCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Productos Inactivos
            </p>
            <h3 className="text-2xl font-bold">{productosInactivos}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Sin Stock
            </p>
            <h3 className="text-2xl font-bold">{sinStock}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
