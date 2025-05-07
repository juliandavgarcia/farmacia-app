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

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentes/ui/select";
import { EsquemaUsuario } from "@/logica/esquemas/usuario";
import { registrarUsuario } from "@/logica/acciones/acciones-registo";
export function FormularioRegistroUsuario({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<z.infer<typeof EsquemaUsuario>>({
    resolver: zodResolver(EsquemaUsuario),
    defaultValues: {
      nombre: "",
      correo: "",
      contrasena: "",
      confirmarContrasena: "",
      rol: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof EsquemaUsuario>) => {
    setError("");
    setSuccess("");
    setIsRedirecting(false);

    startTransition(() => {
      registrarUsuario(data).then((response) => {
        setError(response.error);
        setSuccess(response.exito);

        if (response.exito) {
          let timeLeft = 5;
          setCountdown(timeLeft);
          setIsRedirecting(true);
          const interval = setInterval(() => {
            timeLeft -= 1;
            setCountdown(timeLeft);
            if (timeLeft === 0) {
              clearInterval(interval);
              window.location.href = "/login";
            }
          }, 1000);
        }
      });
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Regístrate</CardTitle>
          <CardDescription>Crea una nueva cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Tu nombre"
                          disabled={isPending || isRedirecting}
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
                          {...field}
                          type="email"
                          placeholder="ejemplo@dominio.com"
                          disabled={isPending || isRedirecting}
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
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          disabled={isPending || isRedirecting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmarContrasena"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar contraseña</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          disabled={isPending || isRedirecting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isPending || isRedirecting}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona un rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Administrador</SelectItem>
                            <SelectItem value="USER">Usuario</SelectItem>
                          </SelectContent>
                        </Select>
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
                {countdown !== null && (
                  <div className="text-sm flex items-center text-blue-600 bg-blue-600/10 rounded-md p-2">
                    <p className="text-center text-sm text-blue-600">
                      Redirigiendo al login en {countdown}...
                    </p>
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isRedirecting}>
                Registrarse
              </Button>
              <div className="text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <a href="/auth/login" className="underline underline-offset-4">
                  Inicia sesión
                </a>
              </div>
            </form>
          </Form>
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
