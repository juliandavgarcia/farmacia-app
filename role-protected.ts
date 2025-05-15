// routes/role-protected.ts

type UserRole = "ADMIN" | "USER" | "CAJERO" | "FARMACEUTICO";

interface RoleAccessMap {
  [pathPrefix: string]: UserRole[];
}

export const roleProtectedRoutes: RoleAccessMap = {
  "/dashboard/usuarios": ["ADMIN"],
  "/dashboard/configuracion": ["ADMIN"],
  "/dashboard/productos": ["ADMIN", "USER", "FARMACEUTICO"],
  "/dashboard/categorias": ["ADMIN", "FARMACEUTICO"],
  "/dashboard/lotes": ["ADMIN", "FARMACEUTICO"],
  "/dashboard/vencimientos": ["ADMIN", "FARMACEUTICO"],
  "/dashboard/ventas": ["ADMIN", "USER", "CAJERO"],
  "/dashboard/clientes": ["ADMIN", "USER", "CAJERO"],
  "/dashboard/compras": ["ADMIN", "FARMACEUTICO"],
  "/dashboard/proveedores": ["ADMIN", "FARMACEUTICO"],
  "/dashboard/reportes": ["ADMIN"],
};
