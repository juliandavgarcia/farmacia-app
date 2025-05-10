"use client";

import type React from "react";

import { useState } from "react";
import { Search, Barcode, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Input } from "@/componentes/ui/input";
import { Button } from "@/componentes/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/componentes/ui/tabs";
import { Badge } from "@/componentes/ui/badge";
import { ScrollArea } from "@/componentes/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentes/ui/select";

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

interface BusquedaProductosProps {
  productos: Producto[];
  agregarProducto: (
    producto: Producto,
    inventarioId: string,
    cantidad: number
  ) => void;
}

export default function BusquedaProductos({
  productos,
  agregarProducto,
}: BusquedaProductosProps) {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    string | null
  >(null);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [inventarioSeleccionado, setInventarioSeleccionado] =
    useState<string>("");
  const [cantidad, setCantidad] = useState(1);
  const [modoEscaneo, setModoEscaneo] = useState(false);

  // Obtener categorías únicas
  const categorias = Array.from(
    new Set(productos.map((producto) => producto.categoria.nombre))
  ).sort();

  // Filtrar productos por búsqueda y categoría
  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (producto.codigoBarras && producto.codigoBarras.includes(busqueda)) ||
      (producto.descripcion &&
        producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()));

    const coincideCategoria =
      !categoriaSeleccionada ||
      producto.categoria.nombre === categoriaSeleccionada;

    return coincideBusqueda && coincideCategoria;
  });

  // Manejar la selección de un producto
  const handleSeleccionarProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);

    // Si solo hay un inventario disponible, seleccionarlo automáticamente
    if (producto.inventarios.length === 1) {
      setInventarioSeleccionado(producto.inventarios[0].id);
    } else {
      setInventarioSeleccionado("");
    }

    setCantidad(1);
  };

  // Manejar el cambio de cantidad
  const handleCantidadChange = (valor: number) => {
    if (valor < 1) return;

    // Verificar stock máximo
    if (productoSeleccionado && inventarioSeleccionado) {
      const inventario = productoSeleccionado.inventarios.find(
        (inv) => inv.id === inventarioSeleccionado
      );

      if (inventario && valor > inventario.cantidad) {
        setCantidad(inventario.cantidad);
        return;
      }
    }

    setCantidad(valor);
  };

  // Manejar la búsqueda por código de barras
  const handleBusquedaCodigoBarras = () => {
    const productoEncontrado = productos.find(
      (producto) => producto.codigoBarras === busqueda
    );

    if (productoEncontrado) {
      handleSeleccionarProducto(productoEncontrado);
      setModoEscaneo(false);
    }
  };

  // Manejar el envío del formulario de búsqueda
  const handleSubmitBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    if (modoEscaneo) {
      handleBusquedaCodigoBarras();
    }
  };

  // Agregar el producto al carrito
  const handleAgregarProducto = () => {
    if (!productoSeleccionado || !inventarioSeleccionado || cantidad < 1)
      return;

    agregarProducto(productoSeleccionado, inventarioSeleccionado, cantidad);

    // Resetear selección
    setProductoSeleccionado(null);
    setInventarioSeleccionado("");
    setCantidad(1);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Buscar Productos</CardTitle>
        <CardDescription>
          Busque productos por nombre o código de barras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <form onSubmit={handleSubmitBusqueda} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  modoEscaneo
                    ? "Escanee el código de barras..."
                    : "Buscar por nombre o código..."
                }
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-8"
                autoFocus={modoEscaneo}
              />
            </div>
            <Button
              type="button"
              variant={modoEscaneo ? "default" : "outline"}
              size="icon"
              onClick={() => setModoEscaneo(!modoEscaneo)}
              title={
                modoEscaneo
                  ? "Modo de búsqueda normal"
                  : "Modo de escaneo de código de barras"
              }
            >
              <Barcode className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={categoriaSeleccionada === null ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoriaSeleccionada(null)}
              className="text-xs"
            >
              Todas
            </Button>
            {categorias.map((categoria) => (
              <Button
                key={categoria}
                variant={
                  categoriaSeleccionada === categoria ? "default" : "outline"
                }
                size="sm"
                onClick={() => setCategoriaSeleccionada(categoria)}
                className="text-xs"
              >
                {categoria}
              </Button>
            ))}
          </div>

          {productoSeleccionado ? (
            <div className="border rounded-md p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{productoSeleccionado.nombre}</h3>
                  <p className="text-sm text-muted-foreground">
                    {productoSeleccionado.descripcion || "Sin descripción"}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">
                      {productoSeleccionado.categoria.nombre}
                    </Badge>
                    {productoSeleccionado.codigoBarras && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Barcode className="h-3 w-3" />
                        {productoSeleccionado.codigoBarras}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProductoSeleccionado(null)}
                >
                  Cambiar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Lote/Vencimiento:
                  </label>
                  <Select
                    value={inventarioSeleccionado}
                    onValueChange={setInventarioSeleccionado}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar lote" />
                    </SelectTrigger>
                    <SelectContent>
                      {productoSeleccionado.inventarios.map((inventario) => (
                        <SelectItem key={inventario.id} value={inventario.id}>
                          {inventario.numeroLote || "Sin lote"}
                          {inventario.fechaVencimiento && (
                            <span>
                              {" "}
                              - Vence:{" "}
                              {format(
                                new Date(inventario.fechaVencimiento),
                                "dd/MM/yyyy",
                                { locale: es }
                              )}
                            </span>
                          )}{" "}
                          (Stock: {inventario.cantidad})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cantidad:</label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleCantidadChange(cantidad - 1)}
                      disabled={cantidad <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) =>
                        handleCantidadChange(
                          Number.parseInt(e.target.value) || 1
                        )
                      }
                      className="mx-2 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleCantidadChange(cantidad + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <p className="text-sm">
                    Precio unitario:{" "}
                    <span className="font-medium">
                      ${Number(productoSeleccionado.precioVenta).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-sm">
                    Subtotal:{" "}
                    <span className="font-medium">
                      $
                      {(
                        Number(productoSeleccionado.precioVenta) * cantidad
                      ).toFixed(2)}
                    </span>
                  </p>
                </div>
                <Button
                  onClick={handleAgregarProducto}
                  disabled={!inventarioSeleccionado || cantidad < 1}
                >
                  Agregar al carrito
                </Button>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="lista" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lista">Lista</TabsTrigger>
                <TabsTrigger value="grid">Cuadrícula</TabsTrigger>
              </TabsList>

              <TabsContent value="lista">
                <ScrollArea className="h-[400px]">
                  {productosFiltrados.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      No se encontraron productos con los criterios de búsqueda.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {productosFiltrados.map((producto) => (
                        <div
                          key={producto.id}
                          className="flex justify-between items-center p-3 border rounded-md hover:bg-accent cursor-pointer"
                          onClick={() => handleSeleccionarProducto(producto)}
                        >
                          <div>
                            <h3 className="font-medium">{producto.nombre}</h3>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">
                                {producto.categoria.nombre}
                              </Badge>
                              <Badge variant="outline">
                                Stock:{" "}
                                {producto.inventarios.reduce(
                                  (total, inv) => total + inv.cantidad,
                                  0
                                )}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${Number(producto.precioVenta).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {producto.unidadMedida}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="grid">
                <ScrollArea className="h-[400px]">
                  {productosFiltrados.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      No se encontraron productos con los criterios de búsqueda.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {productosFiltrados.map((producto) => (
                        <div
                          key={producto.id}
                          className="border rounded-md p-3 hover:bg-accent cursor-pointer flex flex-col h-full"
                          onClick={() => handleSeleccionarProducto(producto)}
                        >
                          <h3 className="font-medium line-clamp-2">
                            {producto.nombre}
                          </h3>
                          <div className="mt-2 flex gap-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {producto.categoria.nombre}
                            </Badge>
                          </div>
                          <div className="mt-auto pt-2 flex justify-between items-end">
                            <Badge variant="outline">
                              Stock:{" "}
                              {producto.inventarios.reduce(
                                (total, inv) => total + inv.cantidad,
                                0
                              )}
                            </Badge>
                            <p className="font-medium">
                              ${Number(producto.precioVenta).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          {productosFiltrados.length} productos encontrados
        </p>
      </CardFooter>
    </>
  );
}
