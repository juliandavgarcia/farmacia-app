"use client";

import { Card, CardContent } from "@/componentes/ui/card";
import { Separator } from "@/componentes/ui/separator";
import { Button } from "@/componentes/ui/button";
import { RocketIcon } from "lucide-react";
import Link from "next/link";

export default function Bienvenido() {
  return (
    <Card className="w-full rounded-2xl shadow-md">
      <CardContent className="p-6 md:p-8 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              ¡Bienvenido a Farmacol!
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Tu panel de control para la gestión farmacéutica inteligente.
            </p>
          </div>
          <Link href={"/dashboard/ventas/nueva"}>
            <Button variant="default" className="flex gap-2">
              <RocketIcon className="w-4 h-4" />
              Vender
            </Button>
          </Link>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>✅ Revisa los reportes de inventario y ventas.</div>
        </div>
      </CardContent>
    </Card>
  );
}
