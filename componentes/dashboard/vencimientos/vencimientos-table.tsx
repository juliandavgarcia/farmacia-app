/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertTriangle,
  ArrowUpDown,
  Clock,
  MoreHorizontal,
  Trash,
} from "lucide-react";

import { Badge } from "@/componentes/ui/badge";
import { Button } from "@/componentes/ui/button";
import { Checkbox } from "@/componentes/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { toast } from "sonner";

interface VencimientosTableProps {
  inventarios: any[];
  tipo: "vencidos" | "proximos" | "medio" | "todos";
}

export default function VencimientosTable({
  inventarios,
}: VencimientosTableProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Función para manejar la selección de todos los items
  const handleSelectAll = () => {
    if (selectedItems.length === inventarios.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(inventarios.map((inv) => inv.id));
    }
  };

  // Función para manejar la selección individual
  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Función para marcar como revisado
  const handleMarcarRevisado = (id: string) => {
    toast("Producto marcado como revisado");
  };

  // Función para generar alerta
  const handleGenerarAlerta = (id: string) => {
    toast("Alerta generada");
  };

  // Función para obtener el estilo de la fila según el tipo de vencimiento
  const getRowStyle = (fechaVencimiento: Date) => {
    const hoy = new Date();
    const diasRestantes = differenceInDays(new Date(fechaVencimiento), hoy);

    if (diasRestantes < 0) {
      return "bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30";
    } else if (diasRestantes <= 30) {
      return "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/30";
    } else if (diasRestantes <= 90) {
      return "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/10 dark:hover:bg-blue-950/20";
    }
    return "";
  };

  // Función para obtener el badge de estado según los días restantes
  const getEstadoBadge = (fechaVencimiento: Date) => {
    const hoy = new Date();
    const diasRestantes = differenceInDays(new Date(fechaVencimiento), hoy);

    if (diasRestantes < 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Vencido ({Math.abs(diasRestantes)} días)
        </Badge>
      );
    } else if (diasRestantes <= 30) {
      return (
        <Badge
          variant="outline"
          className="text-amber-600 border-amber-600 flex items-center gap-1"
        >
          <Clock className="h-3 w-3" />
          {diasRestantes} días
        </Badge>
      );
    } else if (diasRestantes <= 90) {
      return <Badge variant="outline">{diasRestantes} días</Badge>;
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-700"
        >
          {diasRestantes} días
        </Badge>
      );
    }
  };

  return (
    <div>
      {selectedItems.length > 0 && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-md">
          <span className="text-sm font-medium">
            {selectedItems.length} productos seleccionados
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedItems([])}
          >
            Limpiar selección
          </Button>
          <Button size="sm" variant="default">
            Generar reporte
          </Button>
          <Button size="sm" variant="destructive">
            Marcar como revisados
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedItems.length === inventarios.length &&
                    inventarios.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Seleccionar todos"
                />
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-8 font-medium"
                  >
                    Producto
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-8 font-medium"
                  >
                    Vencimiento
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No hay productos para mostrar en esta categoría.
                </TableCell>
              </TableRow>
            ) : (
              inventarios.map((inventario) => (
                <TableRow
                  key={inventario.id}
                  className={getRowStyle(inventario.fechaVencimiento)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(inventario.id)}
                      onCheckedChange={() => handleSelectItem(inventario.id)}
                      aria-label={`Seleccionar ${inventario.producto.nombre}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {inventario.producto.nombre}
                  </TableCell>
                  <TableCell>{inventario.producto.categoria.nombre}</TableCell>
                  <TableCell>{inventario.numeroLote || "N/A"}</TableCell>
                  <TableCell>
                    {format(
                      new Date(inventario.fechaVencimiento),
                      "dd/MM/yyyy",
                      { locale: es }
                    )}
                  </TableCell>
                  <TableCell>
                    {getEstadoBadge(inventario.fechaVencimiento)}
                  </TableCell>
                  <TableCell className="text-right">
                    {inventario.cantidad}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(inventario.id);
                            toast("ID copiado");
                          }}
                        >
                          Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleMarcarRevisado(inventario.id)}
                        >
                          Marcar como revisado
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleGenerarAlerta(inventario.id)}
                        >
                          Generar alerta
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            toast("Acción no implementada");
                          }}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Dar de baja
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
    </div>
  );
}
