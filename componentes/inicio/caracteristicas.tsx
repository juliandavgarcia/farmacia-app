import {
  ShoppingCart,
  Package,
  FileText,
  Users,
  Search,
  CreditCard,
} from "lucide-react";

export function Caracteristicas() {
  return (
    <section id="caracteristicas" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/50 px-3 py-1 text-sm text-primary">
              Funcionalidades
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Pensado para farmacias pequeñas
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Nuestro sistema está creado específicamente para resolver los
              desafíos diarios que enfrentas en tu farmacia.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 mt-12">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/50 p-3">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Ventas Básicas</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Registra ventas de manera sencilla con una interfaz fácil de usar.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/50 p-3">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Búsqueda de Productos</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Encuentra productos por nombre o código de manera rápida.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/50 p-3">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Control de Fechas</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Lleva un registro básico de fechas de caducidad.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/50 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Pacientes</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Guarda información básica sobre tus clientes o pacientes
              frecuentes.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/50 p-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Comprobantes Simples</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Genera comprobantes de venta simples. <br />
              *No es factura electrónica oficial.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/50 p-3">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Pagos</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Soporta pagos en efectivo y otros métodos básicos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
