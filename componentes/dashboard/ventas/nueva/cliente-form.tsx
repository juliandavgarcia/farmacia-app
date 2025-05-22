"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { crearCliente } from "./clientes";
import { toast } from "sonner";

const formSchema = z.object({
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

interface ClienteFormProps {
  onClienteCreado: (cliente: { id: string; nombre: string }) => void;
}

export function ClienteForm({ onClienteCreado }: ClienteFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documento: "",
      nombre: "",
      telefono: "",
      direccion: "",
      correo: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const cliente = await crearCliente(values);
      toast("El cliente ha sido creado correctamente");
      onClienteCreado({ id: cliente.id, nombre: cliente.nombre });
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      toast("No se pudo crear el cliente");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="documento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese el documento" />
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
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese el nombre completo" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese el teléfono" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="direccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese la dirección" />
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
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Ingrese el correo electrónico"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creando..." : "Crear Cliente"}
        </Button>
      </form>
    </Form>
  );
}
