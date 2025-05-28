import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import {
  getDailySalesCount,
  getTotalSalesAmount,
  getTodaySalesAmount,
  getTotalProductsCount,
  getYesterdaySalesCount,
  getYesterdaySalesAmount,
} from "@/logica/acciones/acciones-compra";
import { ShoppingCart, DollarSign, TrendingUp, Package } from "lucide-react";

export default async function ContadorPlataVentas() {
  // Fetch real data from database
  const [
    dailySalesCount,
    totalSalesAmount,
    todaySalesAmount,
    totalProducts,
    yesterdaySalesCount,
    yesterdaySalesAmount,
  ] = await Promise.all([
    getDailySalesCount(),
    getTotalSalesAmount(),
    getTodaySalesAmount(),
    getTotalProductsCount(),
    getYesterdaySalesCount(),
    getYesterdaySalesAmount(),
  ]);

  // Calculate percentage changes
  const salesCountChange =
    yesterdaySalesCount > 0
      ? (
          ((dailySalesCount - yesterdaySalesCount) / yesterdaySalesCount) *
          100
        ).toFixed(1)
      : "0";

  const salesAmountChange =
    yesterdaySalesAmount > 0
      ? (
          ((todaySalesAmount - yesterdaySalesAmount) / yesterdaySalesAmount) *
          100
        ).toFixed(1)
      : "0";

  // Format currency in Colombian Pesos
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Daily Sales Count */}
      <Card className="shadow-lg bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 dark:bg-card dark:border-border overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-3">
          <CardTitle className="text-sm font-medium text-rose-700 dark:text-foreground truncate">
            Ventas del Día
          </CardTitle>
          <div className="p-1 bg-rose-500/10 dark:bg-rose-500/20 rounded">
            <ShoppingCart className="h-3 w-3 text-rose-600 dark:text-rose-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-900 dark:text-foreground leading-none mb-1">
            {dailySalesCount}
          </div>
          <p className="text-xs text-rose-600 dark:text-muted-foreground leading-none">
            {Number(salesCountChange) >= 0 ? "+" : ""}
            {salesCountChange}% desde ayer
          </p>
        </CardContent>
      </Card>

      {/* Total Sales Amount */}
      <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:bg-card dark:border-border overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-3">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-foreground truncate">
            Total en Ventas
          </CardTitle>
          <div className="p-1 bg-blue-500/10 dark:bg-blue-500/20 rounded">
            <DollarSign className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-blue-900 dark:text-foreground leading-none mb-1 truncate">
            {formatCurrency(totalSalesAmount)}
          </div>
          <p className="text-xs text-blue-600 dark:text-muted-foreground leading-none">
            Ventas acumuladas
          </p>
        </CardContent>
      </Card>

      {/* Today's Sales Amount */}
      <Card className="shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:bg-card dark:border-border overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-3">
          <CardTitle className="text-sm font-medium text-amber-700 dark:text-foreground truncate">
            Ventas de Hoy
          </CardTitle>
          <div className="p-1 bg-amber-500/10 dark:bg-amber-500/20 rounded">
            <TrendingUp className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-amber-900 dark:text-foreground leading-none mb-1 truncate">
            {formatCurrency(todaySalesAmount)}
          </div>
          <p className="text-xs text-amber-600 dark:text-muted-foreground leading-none">
            {Number(salesAmountChange) >= 0 ? "+" : ""}
            {salesAmountChange}% desde ayer
          </p>
        </CardContent>
      </Card>

      {/* Total Products */}
      <Card className="shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 dark:bg-card dark:border-border overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-3">
          <CardTitle className="text-sm font-medium text-emerald-700 dark:text-foreground truncate">
            Total Productos
          </CardTitle>
          <div className="p-1 bg-emerald-500/10 dark:bg-emerald-500/20 rounded">
            <Package className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-900 dark:text-foreground leading-none mb-1">
            {totalProducts}
          </div>
          <p className="text-xs text-emerald-600 dark:text-muted-foreground leading-none">
            Productos activos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
