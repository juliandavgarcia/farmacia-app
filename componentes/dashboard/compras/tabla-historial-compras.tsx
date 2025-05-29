"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MoreVertical, Search, ArrowUpDown } from "lucide-react";

import GeneradorExcel from "@/componentes/generadores/generador-excel";
import GeneradorPDF from "@/componentes/generadores/generador-pdf";
import { Button } from "@/componentes/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/componentes/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/componentes/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { Input } from "@/componentes/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentes/ui/select";
import { Badge } from "@/componentes/ui/badge";
import { obtenerHistorialCompras } from "@/logica/acciones/acciones-compra";

type HistorialCompra = {
  id: string;
  numeroFactura: string;
  fecha: string;
  proveedor: string;
  total: number;
  estado: string;
};

export default function TablaHistorialCompras() {
  const router = useRouter();
  const [data, setData] = useState<HistorialCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<HistorialCompra[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("fecha");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterEstado, setFilterEstado] = useState<string>("TODOS");

  // Función para obtener datos usando server action
  const fetchHistorial = async () => {
    try {
      setLoading(true);
      const response = await obtenerHistorialCompras();
      if (response.datos) {
        setData(response.datos);
        setFilteredData(response.datos);
      }
    } catch (error) {
      console.error("Error al obtener historial de compras:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchHistorial();
  }, []);

  // Filtrar y ordenar datos cuando cambian los criterios
  useEffect(() => {
    let result = [...data];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.numeroFactura.toLowerCase().includes(term) ||
          item.proveedor.toLowerCase().includes(term)
      );
    }

    // Filtrar por estado
    if (filterEstado !== "TODOS") {
      result = result.filter((item) => item.estado === filterEstado);
    }

    // Ordenar datos
    result.sort((a, b) => {
      let valueA = a[sortColumn as keyof HistorialCompra];
      let valueB = b[sortColumn as keyof HistorialCompra];

      // Convertir fechas para comparación
      if (sortColumn === "fecha") {
        valueA = new Date(valueA as string).getTime();
        valueB = new Date(valueB as string).getTime();
      }

      // Convertir números para comparación
      if (sortColumn === "total") {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(result);
  }, [data, searchTerm, sortColumn, sortDirection, filterEstado]);

  // Función para cambiar el orden
  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Columnas para exportación
  const excelColumns = [
    { key: "numeroFactura", header: "Factura" },
    { key: "fecha", header: "Fecha" },
    { key: "proveedor", header: "Proveedor" },
    { key: "estado", header: "Estado" },
    { key: "total", header: "Total" },
  ];

  // Renderizar estado con badge
  const renderEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "outline" | "destructive"> = {
      COMPLETADA: "default",
      PENDIENTE: "outline",
      CANCELADA: "destructive",
    };

    return <Badge variant={variants[estado] || "default"}>{estado}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Cargando historial de compras...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Compras</CardTitle>
        <CardDescription>
          Listado de todas las compras realizadas a proveedores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-2/3">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por factura o proveedor..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos los estados</SelectItem>
                <SelectItem value="COMPLETADA">Completada</SelectItem>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="CANCELADA">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <GeneradorExcel
              data={filteredData}
              columns={excelColumns}
              fileName="historial_compras"
              headerTitle="Historial de Compras"
            />
            <GeneradorPDF
              data={filteredData}
              columns={excelColumns}
              fileName="historial_compras"
              headerTitle="Historial de Compras"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => toggleSort("numeroFactura")}
                >
                  <div className="flex items-center">
                    Factura
                    {sortColumn === "numeroFactura" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => toggleSort("fecha")}
                >
                  <div className="flex items-center">
                    Fecha
                    {sortColumn === "fecha" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => toggleSort("proveedor")}
                >
                  <div className="flex items-center">
                    Proveedor
                    {sortColumn === "proveedor" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hidden md:table-cell"
                  onClick={() => toggleSort("estado")}
                >
                  <div className="flex items-center">
                    Estado
                    {sortColumn === "estado" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer text-right"
                  onClick={() => toggleSort("total")}
                >
                  <div className="flex items-center justify-end">
                    Total
                    {sortColumn === "total" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[80px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron registros.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((compra, index) => (
                  <TableRow
                    key={compra.id || `compra-${index}-${compra.numeroFactura}`}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell
                      className="font-medium"
                      onClick={() =>
                        router.push(`/dashboard/compras/${compra.id}`)
                      }
                    >
                      {compra.numeroFactura}
                    </TableCell>
                    <TableCell
                      onClick={() =>
                        router.push(`/dashboard/compras/${compra.id}`)
                      }
                    >
                      {format(new Date(compra.fecha), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell
                      onClick={() =>
                        router.push(`/dashboard/compras/${compra.id}`)
                      }
                    >
                      {compra.proveedor}
                    </TableCell>
                    <TableCell
                      className="hidden md:table-cell"
                      onClick={() =>
                        router.push(`/dashboard/compras/${compra.id}`)
                      }
                    >
                      {renderEstadoBadge(compra.estado)}
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={() =>
                        router.push(`/dashboard/compras/${compra.id}`)
                      }
                    >
                      ${Number(compra.total).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/compras/${compra.id}`)
                            }
                          >
                            Ver detalles
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando <span className="font-medium">{filteredData.length}</span>{" "}
            de <span className="font-medium">{data.length}</span> registros
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
