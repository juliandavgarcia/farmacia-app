"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import FormularioFechaCompra from "./formulario-fecha-compra";
import FormularioSeleccionProveedor from "./formulario-seleccion-proveedor";
import { useState } from "react";
import { Button } from "@/componentes/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/componentes/ui/dialog";
import FormularioSeleccionProductos from "./formulario-seleccion-producto";

type ProductoSeleccionado = {
  id: string;
  nombre: string;
  descripcion?: string | null;
  precioVenta: number;
  precioCompra?: number;
  categoriaNombre?: string;
  codigoBarras?: string | null;
  cantidad: number;
};

const FormularioCompra = () => {
  const [fechaCompraData, setFechaCompraData] = useState<{
    fechaCompra: string;
    factura: string;
  }>({ fechaCompra: "", factura: "" });

  const [proveedorId, setProveedorId] = useState<string | null>(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState<
    ProductoSeleccionado[]
  >([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [registrarDialogOpen, setRegistrarDialogOpen] = useState(false);

  const handleFormularioFechaCompraChange = (data: {
    fechaCompra: string;
    factura: string;
  }) => {
    setFechaCompraData(data);
  };

  const handleSubmit = () => {
    if (
      !proveedorId ||
      !fechaCompraData.fechaCompra ||
      !fechaCompraData.factura ||
      productosSeleccionados.length === 0
    ) {
      alert(
        "Por favor complete todos los campos obligatorios y seleccione al menos un producto."
      );
      return;
    }

    setRegistrarDialogOpen(true);
  };
  const confirmarRegistro = () => {
    const datosCompra = {
      ...fechaCompraData,
      proveedorId,
      productos: productosSeleccionados,
    };

    console.log("Datos completos de la compra:", datosCompra);
    setRegistrarDialogOpen(false);
  };

  const handleCancelar = () => {
    setFechaCompraData({ fechaCompra: "", factura: "" });
    setProveedorId(null);
    setProductosSeleccionados([]);
    setDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Formulario de Compra</CardTitle>
        <CardDescription>
          Complete los datos para registrar una nueva compra
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2">
          <FormularioFechaCompra
            onFormChange={handleFormularioFechaCompraChange}
          />
          <FormularioSeleccionProveedor
            onProveedorSeleccionado={setProveedorId}
          />
        </div>
        <div className="mt-6">
          <FormularioSeleccionProductos
            onProductosSeleccionados={setProductosSeleccionados}
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mr-2">
              Cancelar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Está seguro que desea cancelar?</DialogTitle>
              <DialogDescription>
                Esta acción eliminará todos los datos ingresados en el
                formulario.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                No, continuar editando
              </Button>
              <Button variant="destructive" onClick={handleCancelar}>
                Sí, cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={registrarDialogOpen}
          onOpenChange={setRegistrarDialogOpen}
        >
          <DialogTrigger asChild>
            <Button onClick={handleSubmit} variant={"green"}>
              Registrar compra
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar registro de compra</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea registrar esta compra con los datos
                ingresados?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRegistrarDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={confirmarRegistro}>Confirmar registro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default FormularioCompra;
