/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentes/ui/form";
import { Input } from "@/componentes/ui/input";
import { Button } from "@/componentes/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentes/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { useEffect } from "react";

export type FieldConfig = {
  nombre: string;
  label: string;
  tipo:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "date"
    | "time"
    | "select"
    | "hidden"
    | "password";
  placeholder?: string;
  opciones?: { value: string; label: string }[];
  validacion?: z.ZodTypeAny;
  hidden?: boolean;
};

type GenericFormProps = {
  campos: FieldConfig[];
  onSubmit: (values: any) => void;
  titulo: string;
  descripcion: string;
  restablecerFormulario?: boolean;
  initialValues?: Record<string, any>;
};

const GeneradorFormulario = ({
  campos,
  onSubmit,
  titulo,
  descripcion,
  restablecerFormulario,
  initialValues,
}: GenericFormProps) => {
  const formSchema = z.object(
    campos.reduce((acc, field) => {
      acc[field.nombre] = field.validacion || z.string();
      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      initialValues ||
      campos.reduce((acc, field) => {
        acc[field.nombre] = "";
        return acc;
      }, {} as Record<string, string>),
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  useEffect(() => {
    if (restablecerFormulario) {
      form.reset();
    }
  }, [restablecerFormulario, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        <CardDescription>{descripcion}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campos.map((field) => (
                <FormField
                  key={field.nombre}
                  control={form.control}
                  name={field.nombre}
                  render={({ field: formField }) => (
                    <FormItem className={field.hidden ? "hidden" : ""}>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        {field.tipo === "select" ? (
                          <Select
                            onValueChange={(value) => {
                              const parsedValue =
                                value === "true"
                                  ? true
                                  : value === "false"
                                  ? false
                                  : value;
                              formField.onChange(parsedValue);
                            }}
                            value={String(formField.value)}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={field.placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {field.opciones?.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            placeholder={field.placeholder}
                            type={
                              field.tipo === "hidden" ? "hidden" : field.tipo
                            }
                            {...formField}
                            value={
                              field.tipo === "date" && formField.value
                                ? new Date(formField.value)
                                    .toISOString()
                                    .split("T")[0]
                                : field.tipo === "time" && formField.value
                                ? String(formField.value)
                                : String(formField.value)
                            }
                            onChange={(e) => {
                              if (field.tipo === "date") {
                                const date = new Date(e.target.value);
                                if (!isNaN(date.getTime())) {
                                  formField.onChange(date.toISOString());
                                } else {
                                  formField.onChange("");
                                }
                              } else if (field.tipo === "time") {
                                const regex =
                                  /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
                                if (regex.test(e.target.value)) {
                                  formField.onChange(e.target.value);
                                } else {
                                  formField.onChange("");
                                }
                              } else {
                                formField.onChange(e.target.value);
                              }
                            }}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <Button type="submit">Registrar</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GeneradorFormulario;
