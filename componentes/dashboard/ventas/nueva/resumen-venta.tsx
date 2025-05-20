"use client";

import { CreditCard, DollarSign, Receipt, ShoppingBag } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { Button } from "@/componentes/ui/button";
import { Separator } from "@/componentes/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/componentes/ui/radio-group";
import { Label } from "@/componentes/ui/label";
import { ItemCarrito } from "./nueva-venta-form";

interface ResumenVentaProps {
  items: ItemCarrito[];
  subtotal: number;
  iva: number;
  total: number;
  metodoPago: string;
  seleccionarMetodoPago: (metodo: "Efectivo" | "Tarjeta") => void;
  isSubmitting: boolean;
}

export default function ResumenVenta({
  items,
  subtotal,
  iva,
  total,
  metodoPago,
  seleccionarMetodoPago,
  isSubmitting,
}: ResumenVentaProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Resumen de Venta
        </CardTitle>
        <CardDescription>Detalles de la venta actual</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
            <span>Productos:</span>
          </div>
          <span className="font-medium">{items.length}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Subtotal:</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>IVA (19%):</span>
          <span className="font-medium">${iva.toFixed(2)}</span>
        </div>

        <Separator />

        <div className="flex justify-between items-center text-lg">
          <span className="font-bold">Total:</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </div>

        <div className="pt-4">
          <h3 className="font-medium mb-2">Método de pago:</h3>
          <RadioGroup
            value={metodoPago}
            onValueChange={(value) =>
              seleccionarMetodoPago(value as "Efectivo" | "Tarjeta")
            }
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="Efectivo" id="efectivo" />
              <Label
                htmlFor="efectivo"
                className="flex items-center gap-2 cursor-pointer"
              >
                <DollarSign className="h-4 w-4" />
                Efectivo
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="Tarjeta" id="tarjeta" />
              <Label
                htmlFor="tarjeta"
                className="flex items-center gap-2 cursor-pointer"
              >
                <CreditCard className="h-4 w-4" />
                Tarjeta de crédito/débito
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          type="submit"
          disabled={items.length === 0 || isSubmitting}
        >
          {isSubmitting ? "Procesando..." : "Finalizar Venta"}
        </Button>
      </CardFooter>
    </Card>
  );
}
