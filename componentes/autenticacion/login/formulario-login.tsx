"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/componentes/ui/button";
import { Card, CardContent } from "@/componentes/ui/card";
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
import Image from "next/image";

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
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
                  <p className="text-balance text-muted-foreground">
                    Inicia sesión con tu cuenta
                  </p>
                </div>

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
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Cargando..." : "Iniciar sesión"}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  ¿No tienes una cuenta?{" "}
                  <a
                    href="/auth/register"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Regístrate
                  </a>
                </div>
              </div>
            </form>
          </Form>

          <div className="relative hidden bg-muted md:block">
            <Image
              src="/inicio.svg"
              alt="Farmacéutico usando el sistema POS"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              fill
              priority
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        Al hacer clic en continuar, aceptas nuestros{" "}
        <a href="#">Términos de Servicio</a> y{" "}
        <a href="#">Política de Privacidad</a>.
      </div>
    </div>
  );
}
