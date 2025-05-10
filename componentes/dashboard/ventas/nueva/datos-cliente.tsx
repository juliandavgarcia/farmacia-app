/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { Input } from "@/componentes/ui/input";
import { Button } from "@/componentes/ui/button";
import { RadioGroup, RadioGroupItem } from "@/componentes/ui/radio-group";
import { Label } from "@/componentes/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/componentes/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentes/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ScrollArea } from "@/componentes/ui/scroll-area";
import { toast } from "sonner";

interface Cliente {
  id: string;
  documento: string;
  nombre: string;
  telefono: string | null;
  direccion: string | null;
  correo: string | null;
}

interface DatosClienteProps {
  clientes: Cliente[];
  seleccionarCliente: (clienteId: string) => void;
  clienteSeleccionado: string | undefined;
}

// Esquema para validar el formulario de nuevo cliente
const clienteSchema = z.object({
  documento: z.string().min(1, "El documento es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  correo: z
    .string()
    .email("Correo electrónico inválido")
    .optional()
    .or(z.literal("")),
});

export default function DatosCliente({
  clientes,
  seleccionarCliente,
  clienteSeleccionado,
}: DatosClienteProps) {
  const [busqueda, setBusqueda] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  // Filtrar clientes por búsqueda
  const clientesFiltrados = clientes.filter((cliente) => {
    return (
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.documento.includes(busqueda) ||
      (cliente.telefono && cliente.telefono.includes(busqueda))
    );
  });

  // Obtener el cliente seleccionado
  const cliente = clientes.find((c) => c.id === clienteSeleccionado);

  // Formulario para nuevo cliente
  const form = useForm<z.infer<typeof clienteSchema>>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      documento: "",
      nombre: "",
      telefono: "",
      direccion: "",
      correo: "",
    },
  });

  // Función para crear un nuevo cliente (simulada)
  const onSubmitNuevoCliente = (data: z.infer<typeof clienteSchema>) => {
    // Aquí iría la lógica para crear un nuevo cliente en la base de datos
    // Por ahora, solo mostraremos un toast y cerraremos el diálogo
    toast("El cliente ha sido registrado correctamente");
    setOpenDialog(false);
    form.reset();
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Datos del Cliente
        </CardTitle>
        <CardDescription>
          Seleccione un cliente para la venta o realice una venta sin cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {cliente ? (
          <div className="border rounded-md p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{cliente.nombre}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => seleccionarCliente("")}
              >
                Cambiar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Documento:</p>
                <p className="font-medium">{cliente.documento}</p>
              </div>

              {cliente.telefono && (
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono:</p>
                  <p className="font-medium">{cliente.telefono}</p>
                </div>
              )}

              {cliente.direccion && (
                <div>
                  <p className="text-sm text-muted-foreground">Dirección:</p>
                  <p className="font-medium">{cliente.direccion}</p>
                </div>
              )}

              {cliente.correo && (
                <div>
                  <p className="text-sm text-muted-foreground">Correo:</p>
                  <p className="font-medium">{cliente.correo}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o documento..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1">
                    <UserPlus className="h-4 w-4" />
                    Nuevo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
                    <DialogDescription>
                      Complete el formulario para registrar un nuevo cliente en
                      el sistema.
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmitNuevoCliente)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="documento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Documento *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ingrese el documento"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre completo *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ingrese el nombre completo"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="telefono"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ingrese el teléfono"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="correo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Correo electrónico</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ingrese el correo"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="direccion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ingrese la dirección"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setOpenDialog(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">Registrar Cliente</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <RadioGroup defaultValue="sin-cliente">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sin-cliente" id="sin-cliente" />
                <Label htmlFor="sin-cliente">
                  Venta sin cliente registrado
                </Label>
              </div>
            </RadioGroup>

            <ScrollArea className="h-[300px] border rounded-md">
              {clientesFiltrados.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No se encontraron clientes con los criterios de búsqueda.
                </p>
              ) : (
                <div className="p-4 space-y-2">
                  {clientesFiltrados.map((cliente) => (
                    <div
                      key={cliente.id}
                      className="flex justify-between items-center p-3 border rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => seleccionarCliente(cliente.id)}
                    >
                      <div>
                        <h3 className="font-medium">{cliente.nombre}</h3>
                        <p className="text-sm text-muted-foreground">
                          Documento: {cliente.documento}
                        </p>
                        {cliente.telefono && (
                          <p className="text-sm text-muted-foreground">
                            Teléfono: {cliente.telefono}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        Seleccionar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <p className="text-sm text-muted-foreground">
          {clientesFiltrados.length} clientes encontrados
        </p>
      </CardFooter>
    </>
  );
}
