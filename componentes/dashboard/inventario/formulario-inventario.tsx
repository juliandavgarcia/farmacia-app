"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/componentes/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentes/ui/form";
import { Input } from "@/componentes/ui/input";
import { Calendar } from "@/componentes/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/componentes/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { agregarInventario } from "@/logica/acciones/acciones-inventario";

// Definir el esquema de validación para el inventario
const inventarioSchema = z.object({
  cantidad: z.coerce.number().positive("La cantidad debe ser mayor a 0"),
  numeroLote: z.string().optional(),
  fechaVencimiento: z.date().optional(),
});

export type InventarioFormValues = z.infer<typeof inventarioSchema>;

interface InventarioFormProps {
  producto: {
    id: string;
    nombre: string;
  };
  inventario?: {
    id: string;
    cantidad: number;
    numeroLote: string | null;
    fechaVencimiento: Date | null;
  };
}

export default function InventarioForm({
  producto,
  inventario,
}: InventarioFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!inventario;

  // Inicializar el formulario
  const form = useForm<InventarioFormValues>({
    resolver: zodResolver(inventarioSchema),
    defaultValues: {
      cantidad: inventario?.cantidad || 0,
      numeroLote: inventario?.numeroLote || "",
      fechaVencimiento: inventario?.fechaVencimiento || undefined,
    },
  });

  // Función para enviar el formulario
  const onSubmit = async (data: InventarioFormValues) => {
    try {
      setIsSubmitting(true);

      if (isEditing && inventario) {
        // Aquí iría la lógica para actualizar el inventario
        toast("El inventario ha sido actualizado correctamente");
      } else {
        // Crear nuevo inventario
        const resultado = await agregarInventario(producto.id, data);

        if (resultado.error) {
          toast(resultado.error);
          return;
        }

        toast("El inventario ha sido agregado correctamente");
      }

      router.push(`/dashboard/productos/${producto.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error al procesar el inventario:", error);
      toast("Ocurrió un error al procesar el inventario. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Inventario" : "Agregar Inventario"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Actualice la información del inventario"
            : "Ingrese la información del inventario a agregar"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="cantidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad *</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ingrese la cantidad de unidades a agregar al inventario
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numeroLote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Lote</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el número de lote"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Opcional: Número de lote del producto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fechaVencimiento"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Vencimiento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
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
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Opcional: Fecha de vencimiento del producto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : isEditing
                ? "Actualizar Inventario"
                : "Agregar Inventario"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
