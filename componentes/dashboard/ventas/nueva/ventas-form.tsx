/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/componentes/ui/button";
import { Input } from "@/componentes/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/componentes/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentes/ui/form";
import { ClienteDialog } from "./cliente-dialog";
import { ProductoDialog } from "./producto-dialog";
import { TablaProductos } from "./tabla-productos";
import { generarNumeroFactura, registrarVenta } from "./ventas";
import { toast } from "sonner";
import FacturaVentaPDF from "./factura-venta-pdf";
import { Separator } from "@/componentes/ui/separator";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Receipt,
  User,
  Package,
  FileText,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentes/ui/select";
import { Badge } from "@/componentes/ui/badge";
import { Progress } from "@/componentes/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/componentes/ui/alert";

const formSchema = z.object({
  numeroFactura: z.string().min(1, "El número de factura es requerido"),
  clienteId: z.string().min(1, "Debe seleccionar un cliente"),
  nombreCliente: z.string().min(1, "El nombre del cliente es requerido"),
  metodoPago: z.string().min(1, "El método de pago es requerido"),
});

export type ProductoSeleccionado = {
  id: string;
  inventarioId: string;
  nombre: string;
  lote: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
};

export function VentasForm() {
  const [clienteSeleccionado, setClienteSeleccionado] = useState<{
    id: string;
    nombre: string;
  } | null>(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState<
    ProductoSeleccionado[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingFactura, setIsGeneratingFactura] = useState(false);
  const [, setNumeroFactura] = useState("");
  const [mostrarPDF, setMostrarPDF] = useState(false);
  const [facturaGenerada, setFacturaGenerada] = useState<any | null>(null);
  const [pasoActual, setPasoActual] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroFactura: "",
      clienteId: "",
      nombreCliente: "",
      metodoPago: "Efectivo",
    },
  });

  useEffect(() => {
    const fetchNumeroFactura = async () => {
      setIsGeneratingFactura(true);
      try {
        const numero = await generarNumeroFactura();
        setNumeroFactura(numero);
        form.setValue("numeroFactura", numero);
      } catch (error) {
        console.error("Error al generar número de factura:", error);
        toast.error("No se pudo generar el número de factura");
      } finally {
        setIsGeneratingFactura(false);
      }
    };

    fetchNumeroFactura();
  }, [form]);

  useEffect(() => {
    if (clienteSeleccionado) {
      form.setValue("clienteId", clienteSeleccionado.id);
      form.setValue("nombreCliente", clienteSeleccionado.nombre);
      // Si el cliente está seleccionado, avanzamos al paso 2 automáticamente
      if (pasoActual === 1) setPasoActual(2);
    }
  }, [clienteSeleccionado, form, pasoActual]);

  // Efecto para avanzar al paso 3 cuando se selecciona al menos un producto
  useEffect(() => {
    if (productosSeleccionados.length > 0 && pasoActual === 2) {
      setPasoActual(3);
    }
  }, [productosSeleccionados, pasoActual]);

  const handleClienteSeleccionado = (cliente: {
    id: string;
    nombre: string;
  }) => {
    setClienteSeleccionado(cliente);
    toast.success(`Cliente ${cliente.nombre} seleccionado`);
  };

  const handleProductoSeleccionado = (producto: ProductoSeleccionado) => {
    const productoExistente = productosSeleccionados.find(
      (p) => p.inventarioId === producto.inventarioId
    );

    if (productoExistente) {
      setProductosSeleccionados(
        productosSeleccionados.map((p) =>
          p.inventarioId === producto.inventarioId
            ? {
                ...p,
                cantidad: p.cantidad + producto.cantidad,
                subtotal: (p.cantidad + producto.cantidad) * p.precioUnitario,
              }
            : p
        )
      );
      toast.success(`Se actualizó la cantidad de ${producto.nombre}`);
    } else {
      setProductosSeleccionados([...productosSeleccionados, producto]);
      toast.success(`${producto.nombre} agregado a la venta`);
    }
  };

  const handleRemoveProducto = (inventarioId: string) => {
    const productoAEliminar = productosSeleccionados.find(
      (p) => p.inventarioId === inventarioId
    );
    setProductosSeleccionados(
      productosSeleccionados.filter((p) => p.inventarioId !== inventarioId)
    );
    if (productoAEliminar) {
      toast.info(`${productoAEliminar.nombre} eliminado de la venta`);
    }

    // Si eliminamos todos los productos, volvemos al paso 2
    if (productosSeleccionados.length === 1) {
      setPasoActual(2);
    }
  };

  const handleUpdateCantidad = (inventarioId: string, cantidad: number) => {
    setProductosSeleccionados(
      productosSeleccionados.map((p) =>
        p.inventarioId === inventarioId
          ? {
              ...p,
              cantidad,
              subtotal: cantidad * p.precioUnitario,
            }
          : p
      )
    );
  };

  const calcularTotal = () => {
    return productosSeleccionados.reduce((total, p) => total + p.subtotal, 0);
  };

  const iniciarNuevaVenta = async () => {
    setMostrarPDF(false);
    setFacturaGenerada(null);
    setProductosSeleccionados([]);
    setClienteSeleccionado(null);
    setPasoActual(1);

    // Generar nuevo número de factura
    setIsGeneratingFactura(true);
    try {
      const nuevoNumero = await generarNumeroFactura();
      form.reset({
        numeroFactura: nuevoNumero,
        clienteId: "",
        nombreCliente: "",
        metodoPago: "Efectivo",
      });
      toast.success("Nueva venta iniciada");
    } catch (error) {
      console.error("Error al generar nuevo número de factura:", error);
      toast.error("Error al iniciar nueva venta");
    } finally {
      setIsGeneratingFactura(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (productosSeleccionados.length === 0) {
      toast.error("Debe seleccionar al menos un producto");
      return;
    }

    setIsLoading(true);
    try {
      const detalles = productosSeleccionados.map((p) => ({
        inventarioId: p.inventarioId,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario,
        subtotal: p.subtotal,
      }));

      const total = calcularTotal();
      const subtotal = total / 1.19; // Asumiendo IVA del 19%
      const iva = total - subtotal;

      await registrarVenta({
        numeroFactura: values.numeroFactura,
        clienteId: values.clienteId,
        metodoPago: values.metodoPago,
        subtotal: Number.parseFloat(subtotal.toFixed(2)),
        iva: Number.parseFloat(iva.toFixed(2)),
        total,
        detalles,
      });

      toast.success(
        `La venta ${values.numeroFactura} ha sido registrada correctamente`
      );

      setFacturaGenerada({
        numeroFactura: values.numeroFactura,
        cliente: clienteSeleccionado,
        productos: productosSeleccionados,
        subtotal: Number.parseFloat(subtotal.toFixed(2)),
        iva: Number.parseFloat(iva.toFixed(2)),
        total,
        metodoPago: values.metodoPago,
        fecha: new Date(),
        estado: "Pagada",
      });

      setMostrarPDF(true);
      setPasoActual(4);
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      toast.error("No se pudo registrar la venta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de progreso */}
      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={pasoActual >= 1 ? "default" : "outline"}
                  className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
                >
                  1
                </Badge>
                <span
                  className={
                    pasoActual >= 1 ? "font-medium" : "text-muted-foreground"
                  }
                >
                  Cliente
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={pasoActual >= 2 ? "default" : "outline"}
                  className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
                >
                  2
                </Badge>
                <span
                  className={
                    pasoActual >= 2 ? "font-medium" : "text-muted-foreground"
                  }
                >
                  Productos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={pasoActual >= 3 ? "default" : "outline"}
                  className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
                >
                  3
                </Badge>
                <span
                  className={
                    pasoActual >= 3 ? "font-medium" : "text-muted-foreground"
                  }
                >
                  Pago
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={pasoActual >= 4 ? "default" : "outline"}
                  className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
                >
                  4
                </Badge>
                <span
                  className={
                    pasoActual >= 4 ? "font-medium" : "text-muted-foreground"
                  }
                >
                  Factura
                </span>
              </div>
            </div>
            <Progress value={pasoActual * 25} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Factura generada */}
      {mostrarPDF && facturaGenerada && (
        <Card className="border shadow-md bg-green-50 dark:bg-green-950/20">
          <CardHeader className="pb-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <CardTitle className="text-green-800 dark:text-green-400">
                  ¡Venta registrada exitosamente!
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-500">
                  La factura #{facturaGenerada.numeroFactura} ha sido generada.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Cliente</div>
                <div className="font-medium">
                  {facturaGenerada.cliente?.nombre || "Cliente General"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="font-bold text-lg">
                  ${facturaGenerada.total.toFixed(2)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Método de pago
                </div>
                <div className="font-medium">{facturaGenerada.metodoPago}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Fecha</div>
                <div className="font-medium">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <div className="w-full sm:w-auto flex-1">
              <FacturaVentaPDF
                datos={facturaGenerada}
                titulo="Factura de Venta"
              />
            </div>
            <Button
              onClick={iniciarNuevaVenta}
              variant="outline"
              className="w-full sm:w-auto flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Iniciar Nueva Venta
            </Button>
          </CardFooter>
        </Card>
      )}

      {!mostrarPDF && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Información de la factura */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Información de la Factura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="numeroFactura"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Factura</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input {...field} readOnly className="pl-8" />
                            <Receipt className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            {isGeneratingFactura && (
                              <div className="absolute right-2.5 top-2.5">
                                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metodoPago"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de Pago</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <SelectValue placeholder="Seleccione método de pago" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Efectivo">Efectivo</SelectItem>
                            <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                            <SelectItem value="Transferencia">
                              Transferencia
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nombreCliente"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Cliente</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <div className="relative flex-1">
                              <Input
                                {...field}
                                readOnly
                                placeholder="Seleccione un cliente"
                                className="pl-8"
                              />
                              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <ClienteDialog
                            onClienteSeleccionado={handleClienteSeleccionado}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Productos */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Productos
                </CardTitle>
                <ProductoDialog
                  onProductoSeleccionado={handleProductoSeleccionado}
                />
              </CardHeader>
              <CardContent>
                {productosSeleccionados.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No hay productos seleccionados</AlertTitle>
                    <AlertDescription>
                      Utilice el botón para seleccionar productos para la venta.
                    </AlertDescription>
                  </Alert>
                )}

                {productosSeleccionados.length > 0 && (
                  <TablaProductos
                    productos={productosSeleccionados}
                    onRemove={handleRemoveProducto}
                    onUpdateCantidad={handleUpdateCantidad}
                  />
                )}
              </CardContent>
            </Card>

            {/* Resumen y botón de registro */}
            {productosSeleccionados.length > 0 && (
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Resumen de la Venta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>${(calcularTotal() / 1.19).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          IVA (19%):
                        </span>
                        <span>
                          $
                          {(calcularTotal() - calcularTotal() / 1.19).toFixed(
                            2
                          )}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span className="text-xl">
                          ${calcularTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-end">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Registrando venta...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Finalizar y Registrar Venta
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      )}
    </div>
  );
}
