/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/componentes/ui/button";
import { Input } from "@/componentes/ui/input";
import { Card, CardContent } from "@/componentes/ui/card";
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
  const [, setNumeroFactura] = useState("");
  const [mostrarPDF, setMostrarPDF] = useState(false);
  const [facturaGenerada, setFacturaGenerada] = useState<any | null>(null);

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
      try {
        const numero = await generarNumeroFactura();
        setNumeroFactura(numero);
        form.setValue("numeroFactura", numero);
      } catch (error) {
        console.error("Error al generar número de factura:", error);
        toast("No se pudo generar el número de factura");
      }
    };

    fetchNumeroFactura();
  }, [form]);

  useEffect(() => {
    if (clienteSeleccionado) {
      form.setValue("clienteId", clienteSeleccionado.id);
      form.setValue("nombreCliente", clienteSeleccionado.nombre);
    }
  }, [clienteSeleccionado, form]);

  const handleClienteSeleccionado = (cliente: {
    id: string;
    nombre: string;
  }) => {
    setClienteSeleccionado(cliente);
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
    } else {
      setProductosSeleccionados([...productosSeleccionados, producto]);
    }
  };

  const handleRemoveProducto = (inventarioId: string) => {
    setProductosSeleccionados(
      productosSeleccionados.filter((p) => p.inventarioId !== inventarioId)
    );
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
    form.reset({
      numeroFactura: await generarNumeroFactura(),
      clienteId: "",
      nombreCliente: "",
      metodoPago: "Efectivo",
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (productosSeleccionados.length === 0) {
      toast("Debe seleccionar al menos un producto");
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

      await registrarVenta({
        numeroFactura: values.numeroFactura,
        clienteId: values.clienteId,
        metodoPago: values.metodoPago,
        subtotal: total,
        iva: 0,
        total,
        detalles,
      });

      toast(
        `La venta ${values.numeroFactura} ha sido registrada correctamente`
      );

      setFacturaGenerada({
        numeroFactura: values.numeroFactura,
        cliente: clienteSeleccionado,
        productos: productosSeleccionados,
        total,
        metodoPago: values.metodoPago,
      });

      setMostrarPDF(true);
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      toast("No se pudo registrar la venta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {mostrarPDF && facturaGenerada && (
        <div className="bg-card shadow-md p-4 border roundded-md">
          <div>
            <h3 className="text-green-800 font-medium text-lg mb-2">
              ¡Venta registrada exitosamente!
            </h3>
            <p className="text-green-700 mb-4">
              La factura #{facturaGenerada.numeroFactura} ha sido generada.
              Puedes descargarla ahora o iniciar una nueva venta.
            </p>
          </div>
          <div className="flex space-x-4">
            <FacturaVentaPDF
              datos={facturaGenerada}
              titulo="Factura de Venta"
            />
            <Button onClick={iniciarNuevaVenta} variant="outline">
              Iniciar Nueva Venta
            </Button>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="numeroFactura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Factura</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
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
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          {...field}
                        >
                          <option value="Efectivo">Efectivo</option>
                          <option value="Tarjeta">Tarjeta</option>
                          <option value="Transferencia">Transferencia</option>
                        </select>
                      </FormControl>
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
                          <Input
                            {...field}
                            readOnly
                            placeholder="Seleccione un cliente"
                          />
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

          <Card>
            <CardContent className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Productos</h2>
              <ProductoDialog
                onProductoSeleccionado={handleProductoSeleccionado}
              />
            </CardContent>
          </Card>

          <TablaProductos
            productos={productosSeleccionados}
            onRemove={handleRemoveProducto}
            onUpdateCantidad={handleUpdateCantidad}
          />

          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">
              Total: ${calcularTotal().toFixed(2)}
            </div>
            <Button type="submit" disabled={isLoading} variant="green">
              {isLoading ? (
                <>
                  <span className="mr-2">Registrando...</span>
                  <span className="animate-spin">⏳</span>
                </>
              ) : (
                "Registrar Venta"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
