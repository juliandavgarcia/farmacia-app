/* eslint-disable @typescript-eslint/no-explicit-any */
import NotFound from "@/app/not-found";
import { obtenerCompraPorId } from "@/logica/acciones/acciones-compra";

type PageProps = {
  params: { id: string };
};

const PaginaDetalleCompra = async ({ params }: PageProps) => {
  const compraId = params.id;
  const resultado = await obtenerCompraPorId(compraId);

  if (!resultado.datos) {
    return NotFound();
  }

  const compra = resultado.datos;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Detalle de Compra</h1>

      <div className="space-y-2 mb-6">
        <p>
          <strong>Número de Factura:</strong> {compra.numeroFactura}
        </p>
        <p>
          <strong>Fecha:</strong> {new Date(compra.fecha).toLocaleDateString()}
        </p>
        <p>
          <strong>Proveedor:</strong> {compra.proveedor.nombre}
        </p>
        <p>
          <strong>Total:</strong> ${compra.total.toFixed(2)}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Productos</h2>
      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Producto</th>
            <th className="border px-4 py-2 text-right">Cantidad</th>
            <th className="border px-4 py-2 text-right">Precio Unitario</th>
            <th className="border px-4 py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {compra.detalles.map((item: any) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.producto.nombre}</td>
              <td className="border px-4 py-2 text-right">{item.cantidad}</td>
              <td className="border px-4 py-2 text-right">
                ${item.precioUnitario.toFixed(2)}
              </td>
              <td className="border px-4 py-2 text-right">
                ${item.subtotal.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaginaDetalleCompra;
