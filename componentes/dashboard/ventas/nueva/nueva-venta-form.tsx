"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card } from "@/componentes/ui/card";
import { Form } from "@/componentes/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/componentes/ui/tabs";
import { toast } from "sonner";
import BusquedaProductos from "./busqueda-productos";
import CarritoVenta from "./carrito-venta";
import DatosCliente from "./datos-cliente";
import ResumenVenta from "./resumen-venta";
import { crearVenta } from "@/logica/acciones/acciones-venta";

// Definir el esquema de validación para la venta
const ventaSchema = z.object({
  clienteId: z.string().optional(),
  metodoPago: z.enum(["Efectivo", "Tarjeta"]),
  items: z
    .array(
      z.object({
        inventarioId: z.string(),
        productoId: z.string(),
        nombre: z.string(),
        cantidad: z.number().positive(),
        precioUnitario: z.number().positive(),
        subtotal: z.number().positive(),
      })
    )
    .min(1, "Debe agregar al menos un producto a la venta"),
});

export type VentaFormValues = z.infer<typeof ventaSchema>;

// Definir el tipo para los productos
interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  codigoBarras: string | null;
  precioVenta: number;
  unidadMedida: string;
  categoria: {
    id: string;
    nombre: string;
  };
  inventarios: Array<{
    id: string;
    cantidad: number;
    fechaVencimiento: Date | null;
    numeroLote: string | null;
  }>;
}

// Definir el tipo para los clientes
interface Cliente {
  id: string;
  documento: string;
  nombre: string;
  telefono: string | null;
  direccion: string | null;
  correo: string | null;
}

// Definir el tipo para los items del carrito
export interface ItemCarrito {
  inventarioId: string;
  productoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  stock: number;
  lote?: string | null;
}

interface NuevaVentaFormProps {
  productos: Producto[];
  clientes: Cliente[];
}

export default function NuevaVentaForm({
  productos,
  clientes,
}: NuevaVentaFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("productos");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemsCarrito, setItemsCarrito] = useState<ItemCarrito[]>([]);

  // Inicializar el formulario
  const form = useForm<VentaFormValues>({
    resolver: zodResolver(ventaSchema),
    defaultValues: {
      metodoPago: "Efectivo",
      items: [],
    },
  });

  // Función para agregar un producto al carrito
  const agregarProducto = (
    producto: Producto,
    inventarioId: string,
    cantidad: number
  ) => {
    // Buscar el inventario seleccionado
    const inventario = producto.inventarios.find(
      (inv) => inv.id === inventarioId
    );

    if (!inventario) {
      toast("No se encontró el inventario seleccionado");
      return;
    }

    // Verificar si hay suficiente stock
    if (inventario.cantidad < cantidad) {
      toast(`Solo hay ${inventario.cantidad} unidades disponibles`);
      return;
    }

    // Verificar si el producto ya está en el carrito
    const itemExistente = itemsCarrito.find(
      (item) => item.inventarioId === inventarioId
    );

    if (itemExistente) {
      // Actualizar la cantidad si ya existe
      const nuevaCantidad = itemExistente.cantidad + cantidad;

      // Verificar stock nuevamente
      if (nuevaCantidad > inventario.cantidad) {
        toast(`Solo hay ${inventario.cantidad} unidades disponibles`);
        return;
      }

      const nuevosItems = itemsCarrito.map((item) => {
        if (item.inventarioId === inventarioId) {
          const subtotal = Number(
            (nuevaCantidad * item.precioUnitario).toFixed(2)
          );
          return {
            ...item,
            cantidad: nuevaCantidad,
            subtotal,
          };
        }
        return item;
      });

      setItemsCarrito(nuevosItems);
      form.setValue("items", nuevosItems);

      toast(`Se actualizó la cantidad de ${producto.nombre}`);
    } else {
      // Agregar nuevo item al carrito
      const precioUnitario = Number(producto.precioVenta);
      const subtotal = Number((cantidad * precioUnitario).toFixed(2));

      const nuevoItem: ItemCarrito = {
        inventarioId,
        productoId: producto.id,
        nombre: producto.nombre,
        cantidad,
        precioUnitario,
        subtotal,
        stock: inventario.cantidad,
        lote: inventario.numeroLote,
      };

      const nuevosItems = [...itemsCarrito, nuevoItem];
      setItemsCarrito(nuevosItems);
      form.setValue("items", nuevosItems);

      toast(`Se agregó ${producto.nombre} al carrito`);
    }

    // Avanzar al tab del carrito si es el primer producto
    if (itemsCarrito.length === 0) {
      setActiveTab("carrito");
    }
  };

  // Función para eliminar un producto del carrito
  const eliminarProducto = (inventarioId: string) => {
    const nuevosItems = itemsCarrito.filter(
      (item) => item.inventarioId !== inventarioId
    );
    setItemsCarrito(nuevosItems);
    form.setValue("items", nuevosItems);

    toast("El producto fue eliminado del carrito");
  };

  // Función para actualizar la cantidad de un producto
  const actualizarCantidad = (inventarioId: string, nuevaCantidad: number) => {
    const item = itemsCarrito.find(
      (item) => item.inventarioId === inventarioId
    );

    if (!item) return;

    // Verificar stock
    if (nuevaCantidad > item.stock) {
      toast(`Solo hay ${item.stock} unidades disponibles`);
      return;
    }

    const nuevosItems = itemsCarrito.map((item) => {
      if (item.inventarioId === inventarioId) {
        const subtotal = Number(
          (nuevaCantidad * item.precioUnitario).toFixed(2)
        );
        return {
          ...item,
          cantidad: nuevaCantidad,
          subtotal,
        };
      }
      return item;
    });

    setItemsCarrito(nuevosItems);
    form.setValue("items", nuevosItems);
  };

  // Función para seleccionar un cliente
  const seleccionarCliente = (clienteId: string) => {
    form.setValue("clienteId", clienteId);
  };

  // Función para seleccionar método de pago
  const seleccionarMetodoPago = (metodo: "Efectivo" | "Tarjeta") => {
    form.setValue("metodoPago", metodo);
  };

  // Calcular totales
  const subtotal = itemsCarrito.reduce(
    (total, item) => total + item.subtotal,
    0
  );
  const iva = Number((subtotal * 0.19).toFixed(2)); // 19% de IVA
  const total = Number((subtotal + iva).toFixed(2));

  const onSubmit = async (data: VentaFormValues) => {
    try {
      setIsSubmitting(true);

      const ventaData = {
        ...data,
        subtotal,
        iva,
        total,
      };

      const resultado = await crearVenta(ventaData);

      if (resultado.error) {
        toast(resultado.error);
        return;
      }

      toast(`Factura #${resultado.numeroFactura}`);

      router.push(`/ventas/${resultado.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error al crear la venta:", error);
      toast("Ocurrió un error al procesar la venta. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="productos">Productos</TabsTrigger>
                <TabsTrigger value="carrito">Carrito</TabsTrigger>
                <TabsTrigger value="cliente">Cliente</TabsTrigger>
              </TabsList>

              <TabsContent value="productos">
                <Card>
                  <BusquedaProductos
                    productos={productos}
                    agregarProducto={agregarProducto}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="carrito">
                <Card>
                  <CarritoVenta
                    items={itemsCarrito}
                    eliminarProducto={eliminarProducto}
                    actualizarCantidad={actualizarCantidad}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="cliente">
                <Card>
                  <DatosCliente
                    clientes={clientes}
                    seleccionarCliente={seleccionarCliente}
                    clienteSeleccionado={form.watch("clienteId")}
                  />
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <ResumenVenta
              items={itemsCarrito}
              subtotal={subtotal}
              iva={iva}
              total={total}
              metodoPago={form.watch("metodoPago")}
              seleccionarMetodoPago={seleccionarMetodoPago}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
