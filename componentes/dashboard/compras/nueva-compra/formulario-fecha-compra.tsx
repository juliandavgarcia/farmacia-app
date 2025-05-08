"use client";

import React, { useState } from "react";
import { Input } from "@/componentes/ui/input";
import { Label } from "@/componentes/ui/label";

const FormularioFechaCompra = ({
  onFormChange,
}: {
  onFormChange: (data: { fechaCompra: string; factura: string }) => void;
}) => {
  const [fechaCompra, setFechaCompra] = useState("");
  const [factura, setFactura] = useState("FC-000-0001");

  const handleFechaCompraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFechaCompra = e.target.value;
    setFechaCompra(newFechaCompra);
    onFormChange({ fechaCompra: newFechaCompra, factura });
  };

  const handleFacturaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFactura = e.target.value;
    setFactura(newFactura);
    onFormChange({ fechaCompra, factura: newFactura });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border p-4 rounded-lg shadow-sm">
      <div className="flex flex-col">
        <Label htmlFor="fechaCompra">Fecha de compra</Label>
        <Input
          id="fechaCompra"
          type="date"
          value={fechaCompra}
          onChange={handleFechaCompraChange}
          required
          className="w-full mt-2"
        />
      </div>
      <div className="flex flex-col">
        <Label htmlFor="otra">N° Factura</Label>
        <Input
          id="otra"
          type="text"
          value={factura}
          onChange={handleFacturaChange}
          readOnly
          className="w-full mt-2"
        />
      </div>
    </div>
  );
};

export default FormularioFechaCompra;
