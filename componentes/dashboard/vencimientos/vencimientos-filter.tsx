"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, Search, X } from "lucide-react";

import { Button } from "@/componentes/ui/button";
import { Card, CardContent } from "@/componentes/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/componentes/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/componentes/ui/form";
import { Input } from "@/componentes/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/componentes/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Calendar } from "@/componentes/ui/calendar";

interface VencimientosFilterProps {
  categorias: {
    id: string;
    nombre: string;
  }[];
}

const formSchema = z.object({
  busqueda: z.string().optional(),
  categoria: z.string().optional(),
  fechaDesde: z.date().optional(),
  fechaHasta: z.date().optional(),
});

export default function VencimientosFilter({
  categorias,
}: VencimientosFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openCategoria, setOpenCategoria] = useState(false);
  const [openFechaDesde, setOpenFechaDesde] = useState(false);
  const [openFechaHasta, setOpenFechaHasta] = useState(false);

  // Inicializar el formulario con los valores de los parámetros de búsqueda
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      busqueda: searchParams.get("busqueda") || "",
      categoria: searchParams.get("categoria") || "",
      fechaDesde: searchParams.get("fechaDesde")
        ? new Date(searchParams.get("fechaDesde") as string)
        : undefined,
      fechaHasta: searchParams.get("fechaHasta")
        ? new Date(searchParams.get("fechaHasta") as string)
        : undefined,
    },
  });

  // Función para aplicar los filtros
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Actualizar los parámetros con los valores del formulario
    if (values.busqueda) {
      params.set("busqueda", values.busqueda);
    } else {
      params.delete("busqueda");
    }

    if (values.categoria) {
      params.set("categoria", values.categoria);
    } else {
      params.delete("categoria");
    }

    if (values.fechaDesde) {
      params.set("fechaDesde", values.fechaDesde.toISOString());
    } else {
      params.delete("fechaDesde");
    }

    if (values.fechaHasta) {
      params.set("fechaHasta", values.fechaHasta.toISOString());
    } else {
      params.delete("fechaHasta");
    }

    // Navegar a la misma ruta con los nuevos parámetros
    router.push(`/vencimientos?${params.toString()}`);
  };

  // Función para limpiar todos los filtros
  const limpiarFiltros = () => {
    form.reset({
      busqueda: "",
      categoria: "",
      fechaDesde: undefined,
      fechaHasta: undefined,
    });
    router.push("/vencimientos");
  };

  // Verificar si hay filtros activos
  const hayFiltrosActivos =
    !!form.watch("busqueda") ||
    !!form.watch("categoria") ||
    !!form.watch("fechaDesde") ||
    !!form.watch("fechaHasta");

  return (
    <Card>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda por nombre */}
              <FormField
                control={form.control}
                name="busqueda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buscar producto</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Nombre o código de barras"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Filtro por categoría */}
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Categoría</FormLabel>
                    <Popover
                      open={openCategoria}
                      onOpenChange={setOpenCategoria}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? categorias.find(
                                  (categoria) => categoria.id === field.value
                                )?.nombre
                              : "Seleccionar categoría"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Buscar categoría..." />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron categorías.
                            </CommandEmpty>
                            <CommandGroup>
                              {categorias.map((categoria) => (
                                <CommandItem
                                  key={categoria.id}
                                  value={categoria.id}
                                  onSelect={() => {
                                    form.setValue("categoria", categoria.id);
                                    setOpenCategoria(false);
                                  }}
                                >
                                  {categoria.nombre}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              {/* Fecha desde */}
              <FormField
                control={form.control}
                name="fechaDesde"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Vencimiento desde</FormLabel>
                    <Popover
                      open={openFechaDesde}
                      onOpenChange={setOpenFechaDesde}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP", { locale: es })
                              : "Seleccionar fecha"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenFechaDesde(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              {/* Fecha hasta */}
              <FormField
                control={form.control}
                name="fechaHasta"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Vencimiento hasta</FormLabel>
                    <Popover
                      open={openFechaHasta}
                      onOpenChange={setOpenFechaHasta}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP", { locale: es })
                              : "Seleccionar fecha"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenFechaHasta(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between">
              {hayFiltrosActivos ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={limpiarFiltros}
                  className="flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Limpiar filtros
                </Button>
              ) : (
                <div></div>
              )}
              <Button type="submit">Aplicar filtros</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
