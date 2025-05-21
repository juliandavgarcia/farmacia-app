/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/componentes/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentes/ui/form";
import { Input } from "@/componentes/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/componentes/ui/popover";
import { Calendar } from "@/componentes/ui/calendar";
import { Card, CardContent } from "@/componentes/ui/card";

import { Producto, Proveedor } from "@prisma/client";

import { toast } from "sonner";
import { SelectorProducto } from "./selector-producto";
import { SelectorProveedor } from "./selector-proveedor";
import {
  crearCompra,
  generarNumeroFactura,
} from "@/logica/acciones/acciones-compra";

// Esquema de validación para el formulario
const compraFormSchema = z.object({
  proveedorId: z.string({
    required_error: "Seleccione un proveedor",
  }),
  numeroFactura: z.string().min(1, "Ingrese el número de factura"),
  fecha: z.date({
    required_error: "Seleccione la fecha de compra",
  }),
});

export default function FormularioCompra({
  proveedoresIniciales,
  productosIniciales,
}: {
  proveedoresIniciales: Proveedor[];
  productosIniciales: Producto[];
}) {
  const [proveedores] = useState<Proveedor[]>(proveedoresIniciales);
  const [productos] = useState<Producto[]>(productosIniciales);
  const [detalles, setDetalles] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(
    null
  );
  const [cantidad, setCantidad] = useState<number>(1);
  const [precioUnitario, setPrecioUnitario] = useState<number>(0);
  const [fechaVencimiento, setFechaVencimiento] = useState<Date | undefined>(
    undefined
  );
  const [numeroLote, setNumeroLote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof compraFormSchema>>({
    resolver: zodResolver(compraFormSchema),
    defaultValues: {
      fecha: new Date(),
      numeroFactura: "",
    },
  });

  // Generar número de factura automáticamente al cargar el componente
  useEffect(() => {
    const fetchNumeroFactura = async () => {
      try {
        const numeroFactura = await generarNumeroFactura();
        form.setValue("numeroFactura", numeroFactura);
      } catch (error) {
        console.error("Error al generar número de factura:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNumeroFactura();
  }, [form]);

  // Actualizar el formulario cuando se selecciona un proveedor
  const handleProveedorSelect = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    form.setValue("proveedorId", proveedor.id);
  };

  // Actualizar precio unitario cuando se selecciona un producto
  const handleProductoSelect = (producto: Producto) => {
    setSelectedProducto(producto);
    setPrecioUnitario(Number(producto.precioCompra));
  };

  // Agregar un detalle a la compra
  const agregarDetalle = () => {
    try {
      if (!selectedProducto) {
        toast("Seleccione un producto válido");
        return;
      }

      const nuevoDetalle = {
        productoId: selectedProducto.id,
        nombreProducto: selectedProducto.nombre,
        unidadMedida: selectedProducto.unidadMedida,
        cantidad,
        precioUnitario,
        subtotal: cantidad * precioUnitario,
        fechaVencimiento,
        numeroLote,
      };

      setDetalles([...detalles, nuevoDetalle]);

      // Resetear campos
      setSelectedProducto(null);
      setCantidad(1);
      setPrecioUnitario(0);
      setFechaVencimiento(undefined);
      setNumeroLote("");
    } catch (error) {
      console.error("Error al agregar detalle:", error);
      toast("No se pudo agregar el producto");
    }
  };

  // Eliminar un detalle de la compra
  const eliminarDetalle = (index: number) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles.splice(index, 1);
    setDetalles(nuevosDetalles);
  };

  // Calcular totales
  const subtotal = detalles.reduce((sum, item) => sum + item.subtotal, 0);
  const impuestos = subtotal * 0.19; // IVA 19%
  const total = subtotal + impuestos;

  // Enviar el formulario
  const onSubmit = async (values: z.infer<typeof compraFormSchema>) => {
    if (detalles.length === 0) {
      toast("Debe agregar al menos un producto a la compra");
      return;
    }

    setIsSubmitting(true);

    try {
      const compraData = {
        ...values,
        detalles: detalles.map((d) => ({
          productoId: d.productoId,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          subtotal: d.subtotal,
          fechaVencimiento: d.fechaVencimiento,
          numeroLote: d.numeroLote,
        })),
        subtotal,
        impuestos,
        total,
      };

      const result = await crearCompra(compraData);

      if (result.success) {
        toast("La compra se ha registrado correctamente");

        // Resetear formulario
        form.reset();
        setDetalles([]);
        setSelectedProveedor(null);

        // Generar nuevo número de factura
        const nuevoNumeroFactura = await generarNumeroFactura();
        form.setValue("numeroFactura", nuevoNumeroFactura);
        form.setValue("fecha", new Date());
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error al registrar compra:", error);
      toast(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando formulario...</span>
      </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="proveedorId"
              render={() => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    Proveedor
                  </FormLabel>
                  <FormControl>
                    <div>
                      <SelectorProveedor
                        proveedores={proveedores ?? []}
                        onSelect={handleProveedorSelect}
                        selectedProveedor={selectedProveedor}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numeroFactura"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    Número de Factura
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-slate-50" readOnly />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel className="text-sm font-medium">Fecha</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value ? "text-muted-foreground" : ""
                          }`}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccionar fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-slate-50 p-6 rounded-lg shadow-sm border border-slate-100">
            <h3 className="text-lg font-medium mb-4 text-slate-800">
              Agregar Productos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
              <div className="md:col-span-5">
                <FormLabel className="text-sm font-medium">Producto</FormLabel>
                <SelectorProducto
                  productos={productos}
                  onSelect={handleProductoSelect}
                  selectedProducto={selectedProducto}
                />
              </div>

              <div className="md:col-span-2">
                <FormLabel className="text-sm font-medium">Cantidad</FormLabel>
                <Input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) =>
                    setCantidad(Number.parseInt(e.target.value) || 1)
                  }
                  className="w-full"
                />
              </div>

              <div className="md:col-span-3">
                <FormLabel className="text-sm font-medium">
                  Precio Unitario
                </FormLabel>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={precioUnitario}
                  onChange={(e) =>
                    setPrecioUnitario(Number.parseFloat(e.target.value) || 0)
                  }
                  className="w-full"
                />
              </div>

              <div className="md:col-span-2 flex items-end">
                <Button
                  type="button"
                  onClick={agregarDetalle}
                  disabled={
                    !selectedProducto || cantidad <= 0 || precioUnitario <= 0
                  }
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <FormLabel className="text-sm font-medium">
                  Número de Lote (opcional)
                </FormLabel>
                <Input
                  value={numeroLote}
                  onChange={(e) => setNumeroLote(e.target.value)}
                  placeholder="Ingrese número de lote"
                  className="w-full"
                />
              </div>

              <div>
                <FormLabel className="text-sm font-medium">
                  Fecha de Vencimiento (opcional)
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full pl-3 text-left font-normal ${
                        !fechaVencimiento ? "text-muted-foreground" : ""
                      }`}
                    >
                      {fechaVencimiento ? (
                        format(fechaVencimiento, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fechaVencimiento}
                      onSelect={setFechaVencimiento}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {detalles.length > 0 ? (
            <Card className="shadow-md border-slate-200">
              <CardContent className="p-0">
                <div className="p-4 border-b bg-slate-50">
                  <h3 className="text-lg font-medium text-slate-800">
                    Productos Seleccionados
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="p-3 text-left font-medium">Producto</th>
                        <th className="p-3 text-left font-medium">Cantidad</th>
                        <th className="p-3 text-left font-medium">
                          Precio Unit.
                        </th>
                        <th className="p-3 text-left font-medium">Subtotal</th>
                        <th className="p-3 text-left font-medium">Lote</th>
                        <th className="p-3 text-left font-medium">
                          Vencimiento
                        </th>
                        <th className="p-3 text-center font-medium">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalles.map((detalle, index) => (
                        <tr key={index} className="border-b hover:bg-slate-50">
                          <td className="p-3">{detalle.nombreProducto}</td>
                          <td className="p-3">
                            {detalle.cantidad} {detalle.unidadMedida}
                          </td>
                          <td className="p-3">
                            ${detalle.precioUnitario.toFixed(2)}
                          </td>
                          <td className="p-3">
                            ${detalle.subtotal.toFixed(2)}
                          </td>
                          <td className="p-3">{detalle.numeroLote || "-"}</td>
                          <td className="p-3">
                            {detalle.fechaVencimiento
                              ? format(detalle.fechaVencimiento, "dd/MM/yyyy")
                              : "-"}
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => eliminarDetalle(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-medium bg-slate-50">
                        <td colSpan={3} className="p-3 text-right">
                          Subtotal:
                        </td>
                        <td className="p-3">${subtotal.toFixed(2)}</td>
                        <td colSpan={3}></td>
                      </tr>
                      <tr className="font-medium bg-slate-50">
                        <td colSpan={3} className="p-3 text-right">
                          IVA (19%):
                        </td>
                        <td className="p-3">${impuestos.toFixed(2)}</td>
                        <td colSpan={3}></td>
                      </tr>
                      <tr className="font-medium text-lg bg-slate-50">
                        <td colSpan={3} className="p-3 text-right">
                          Total:
                        </td>
                        <td className="p-3 font-bold text-primary">
                          ${total.toFixed(2)}
                        </td>
                        <td colSpan={3}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-slate-50 p-6 rounded-lg border border-dashed border-slate-200 text-center">
              <p className="text-slate-500">
                No hay productos agregados a la compra
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-6 text-base font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Procesando...
              </>
            ) : (
              "Registrar Compra"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
