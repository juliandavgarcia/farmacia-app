"use client";

import { useState, useEffect, type SetStateAction } from "react";
import { Input } from "@/componentes/ui/input";
import { Label } from "@/componentes/ui/label";
import { Button } from "@/componentes/ui/button";
import { PlusIcon, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/componentes/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/componentes/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/componentes/ui/alert-dialog";
import { obtenerProductosActivos } from "@/logica/acciones/acciones-producto";
import { Card, CardContent } from "@/componentes/ui/card";
import { Badge } from "@/componentes/ui/badge";

// Definición del tipo Producto basado en el modelo proporcionado
type Producto = {
  id: string;
  nombre: string;
  descripcion?: string | null;
  precioVenta: number;
  precioCompra?: number;
  categoriaNombre?: string;
  codigoBarras?: string | null;
};

// Tipo para un producto seleccionado que incluye cantidad
type ProductoSeleccionado = Producto & {
  cantidad: number;
};

interface FormularioSeleccionProductosProps {
  onProductosSeleccionados: (productos: ProductoSeleccionado[]) => void;
}

const FormularioSeleccionProductos = ({
  onProductosSeleccionados,
}: FormularioSeleccionProductosProps) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<
    ProductoSeleccionado[]
  >([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertaSeleccion, setAlertaSeleccion] = useState(false);
  const [productoPendiente, setProductoPendiente] = useState<Producto | null>(
    null
  );
  const [cantidad, setCantidad] = useState(1);

  // Cargar productos al abrir el diálogo
  const cargarProductos = async () => {
    const res = await obtenerProductosActivos();
    if (res.datos) setProductos(res.datos);
  };

  // Filtrar productos por nombre y código
  const productosFiltrados = productos.filter((p) => {
    const coincideNombre = p.nombre
      .toLowerCase()
      .includes(filtroNombre.toLowerCase());
    return coincideNombre;
  });

  // Iniciar proceso de selección de producto
  const confirmarSeleccion = (producto: Producto) => {
    setProductoPendiente(producto);
    setCantidad(1);
    setAlertaSeleccion(true);
  };

  // Agregar producto a la lista de seleccionados
  const agregarProducto = () => {
    if (productoPendiente) {
      // Verificar si el producto ya está en la lista
      const productoExistente = productosSeleccionados.find(
        (p) => p.id === productoPendiente.id
      );

      if (productoExistente) {
        // Actualizar cantidad si ya existe
        const nuevosProductos = productosSeleccionados.map((p) =>
          p.id === productoPendiente.id
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p
        );
        setProductosSeleccionados(nuevosProductos);
      } else {
        // Agregar nuevo producto
        const nuevoProductoSeleccionado: ProductoSeleccionado = {
          ...productoPendiente,
          cantidad,
        };
        setProductosSeleccionados([
          ...productosSeleccionados,
          nuevoProductoSeleccionado,
        ]);
      }

      // Notificar al componente padre
      onProductosSeleccionados([
        ...productosSeleccionados,
        { ...productoPendiente, cantidad },
      ]);

      setAlertaSeleccion(false);
    }
  };

  // Eliminar producto de la lista
  const eliminarProducto = (id: string) => {
    const nuevosProductos = productosSeleccionados.filter((p) => p.id !== id);
    setProductosSeleccionados(nuevosProductos);
    onProductosSeleccionados(nuevosProductos);
  };

  // Actualizar cantidad de un producto ya seleccionado
  const actualizarCantidad = (id: string, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;

    const nuevosProductos = productosSeleccionados.map((p) =>
      p.id === id ? { ...p, cantidad: nuevaCantidad } : p
    );

    setProductosSeleccionados(nuevosProductos);
    onProductosSeleccionados(nuevosProductos);
  };

  // Calcular el total de la compra
  const calcularTotalCompra = () => {
    return productosSeleccionados.reduce((total, producto) => {
      return total + (producto.precioCompra || 0) * producto.cantidad;
    }, 0);
  };

  // Efecto para notificar al componente padre cuando cambia la lista de productos
  useEffect(() => {
    onProductosSeleccionados(productosSeleccionados);
  }, [productosSeleccionados, onProductosSeleccionados]);

  return (
    <>
      <div className="space-y-4">
        {/* Botón para abrir el diálogo de selección */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Productos Seleccionados</h3>
          <Dialog
            open={dialogOpen}
            onOpenChange={(
              open: boolean | ((prevState: boolean) => boolean)
            ) => {
              setDialogOpen(open);
              if (open) cargarProductos();
            }}
          >
            <DialogTrigger asChild>
              <Button variant="amber">
                <PlusIcon className="h-4 w-4" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Seleccionar Producto</DialogTitle>
                <DialogDescription>
                  Busca y selecciona los productos que deseas agregar.
                </DialogDescription>
              </DialogHeader>

              <div>
                <Label htmlFor="nombreProducto">Producto</Label>
                <Input
                  id="nombreProducto"
                  placeholder="Buscar por nombre..."
                  className="mt-2"
                  value={filtroNombre}
                  onChange={(e: {
                    target: { value: SetStateAction<string> };
                  }) => setFiltroNombre(e.target.value)}
                />
              </div>

              <div className="max-h-[400px] overflow-auto border">
                <Table className="">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-center">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productosFiltrados.length > 0 ? (
                      productosFiltrados.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>{p.nombre}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="icon"
                              variant="green"
                              onClick={() => confirmarSeleccion(p)}
                            >
                              <PlusIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No se encontraron productos con los criterios de
                          búsqueda.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de productos seleccionados */}
        {productosSeleccionados.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Precio Compra</TableHead>
                    <TableHead>Precio Venta</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead className="text-center">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productosSeleccionados.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>
                        <div className="font-medium">{producto.nombre}</div>
                        {producto.categoriaNombre && (
                          <Badge variant="outline" className="mt-1">
                            {producto.categoriaNombre}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={producto.precioCompra || 0}
                          onChange={(e: { target: { value: string } }) => {
                            const nuevosProductos = productosSeleccionados.map(
                              (p) =>
                                p.id === producto.id
                                  ? {
                                      ...p,
                                      precioCompra: Number(e.target.value),
                                    }
                                  : p
                            );
                            setProductosSeleccionados(nuevosProductos);
                            onProductosSeleccionados(nuevosProductos);
                          }}
                          className="w-24 h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={producto.precioVenta}
                          onChange={(e: { target: { value: string } }) => {
                            const nuevosProductos = productosSeleccionados.map(
                              (p) =>
                                p.id === producto.id
                                  ? {
                                      ...p,
                                      precioVenta: Number(e.target.value),
                                    }
                                  : p
                            );
                            setProductosSeleccionados(nuevosProductos);
                            onProductosSeleccionados(nuevosProductos);
                          }}
                          className="w-24 h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() =>
                              actualizarCantidad(
                                producto.id,
                                producto.cantidad - 1
                              )
                            }
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={producto.cantidad}
                            onChange={(e: { target: { value: string } }) =>
                              actualizarCantidad(
                                producto.id,
                                Number.parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 h-8 text-center"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() =>
                              actualizarCantidad(
                                producto.id,
                                producto.cantidad + 1
                              )
                            }
                          >
                            +
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => eliminarProducto(producto.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            {productosSeleccionados.length > 0 && (
              <div className="p-4 border-t flex justify-end items-center">
                <div className="text-lg font-semibold">
                  Total: ${calcularTotalCompra().toFixed(2)}
                </div>
              </div>
            )}
          </Card>
        ) : (
          <div className="text-center py-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">
              No hay productos seleccionados
            </p>
          </div>
        )}
      </div>

      {/* AlertDialog para confirmar selección y establecer cantidad */}
      <AlertDialog open={alertaSeleccion} onOpenChange={setAlertaSeleccion}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar producto</AlertDialogTitle>
            <AlertDialogDescription>
              Estás por agregar el producto:{" "}
              <strong>{productoPendiente?.nombre}</strong>
              <div className="mt-4">
                <Label htmlFor="cantidad">Cantidad:</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => cantidad > 1 && setCantidad(cantidad - 1)}
                  >
                    -
                  </Button>
                  <Input
                    id="cantidad"
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e: { target: { value: string } }) =>
                      setCantidad(Number.parseInt(e.target.value) || 1)
                    }
                    className="w-20 text-center"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setCantidad(cantidad + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={agregarProducto}>
              Agregar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FormularioSeleccionProductos;
