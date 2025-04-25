"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/componentes/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { Input } from "@/componentes/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentes/ui/form";
import { useTransition } from "react";
import React from "react";
import { esquemaFormularioLogin } from "@/logica/esquemas/login";
import { iniciarSesionUsuario } from "@/logica/acciones/acciones-login";

export function FormularioLogin({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof esquemaFormularioLogin>>({
    resolver: zodResolver(esquemaFormularioLogin),
    defaultValues: {
      correo: "",
      contrasena: "",
    },
  });

  const onSubmit = (data: z.infer<typeof esquemaFormularioLogin>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      iniciarSesionUsuario(data).then((response) => {
        setError(response.error);
        setSuccess(response.exito);
      });
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido de nuevo</CardTitle>
          <CardDescription>Inicia sesión con tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="correo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="ejemplo@dominio.com"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contrasena"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Contraseña</FormLabel>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          ¿Olvidaste tu contraseña?
                        </a>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <div className="text-red-600 font-semibold text-sm mb-2">
                  {error}
                </div>
                <div className="text-green-600 font-semibold text-sm mb-2">
                  {success}
                </div>
                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={isPending}
                >
                  {isPending ? "Cargando..." : "Iniciar sesión"}
                </Button>
              </div>
              <div className="text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <a
                  href="/auth/register"
                  className="underline underline-offset-4"
                >
                  Regístrate
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        Al hacer clic en continuar, aceptas nuestros{" "}
        <a href="#">Términos de Servicio</a> y{" "}
        <a href="#">Política de Privacidad</a>.
      </div>
    </div>
  );
}
