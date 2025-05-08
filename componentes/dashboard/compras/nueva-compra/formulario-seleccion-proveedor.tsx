"use client";

import { useState } from "react";
import { Input } from "@/componentes/ui/input";
import { Label } from "@/componentes/ui/label";
import { Button } from "@/componentes/ui/button";
import { PlusIcon, Search } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
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
import { Proveedor } from "@prisma/client";
import { obtenerProveedores } from "@/logica/acciones/acciones-proveedor";
import { DialogDescription } from "@radix-ui/react-dialog";

const FormularioSeleccionProveedor = ({
  onProveedorSeleccionado,
}: {
  onProveedorSeleccionado: (id: string) => void;
}) => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [seleccionado, setSeleccionado] = useState<Proveedor | null>(null);

  const [alertaSeleccion, setAlertaSeleccion] = useState(false);
  const [proveedorPendiente, setProveedorPendiente] =
    useState<Proveedor | null>(null);

  const cargarProveedores = async () => {
    const res = await obtenerProveedores();
    if (res.data) setProveedores(res.data);
  };

  const confirmarSeleccion = (proveedor: Proveedor) => {
    setProveedorPendiente(proveedor);
    setAlertaSeleccion(true);
  };

  const seleccionarProveedor = () => {
    if (proveedorPendiente) {
      setSeleccionado(proveedorPendiente);
      onProveedorSeleccionado(proveedorPendiente.id!);
      setDialogOpen(false);
      setAlertaSeleccion(false);
    }
  };

  const proveedoresFiltrados = proveedores.filter((p) =>
    p.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border p-4 rounded-lg shadow-sm">
        <div className="flex flex-col">
          <Label htmlFor="nombreProveedor">Nombre</Label>
          <Input
            id="nombreProveedor"
            value={seleccionado?.nombre || ""}
            readOnly
            className="w-full mt-2"
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="nitProveedor">NIT</Label>
          <Input
            id="nitProveedor"
            value={seleccionado?.nit || ""}
            readOnly
            className="w-full mt-2"
          />
        </div>
        <div className="flex flex-col">
          <Label>Seleccionar Proveedor</Label>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (open) cargarProveedores();
            }}
          >
            <DialogTrigger asChild>
              <Button size="icon" variant="outline" className="w-full mt-2">
                <Search className="mr-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Seleccionar Proveedor</DialogTitle>
                <DialogDescription>
                  Selecciona un proveedor de la lista o busca por nombre.
                </DialogDescription>
              </DialogHeader>

              <Input
                placeholder="Buscar por nombre..."
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
              />

              <Table className="border">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>NIT</TableHead>
                    <TableHead className="text-center">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proveedoresFiltrados.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.nombre}</TableCell>
                      <TableCell>{p.nit}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="icon"
                          variant="green"
                          onClick={() => confirmarSeleccion(p)}
                        >
                          <PlusIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* AlertDialog para confirmar selección */}
      <AlertDialog open={alertaSeleccion} onOpenChange={setAlertaSeleccion}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Seleccionar proveedor?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás por seleccionar al proveedor:{" "}
              <strong>{proveedorPendiente?.nombre}</strong> (NIT:{" "}
              {proveedorPendiente?.nit}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={seleccionarProveedor}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FormularioSeleccionProveedor;
