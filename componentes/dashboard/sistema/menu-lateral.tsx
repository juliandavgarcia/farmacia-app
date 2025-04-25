import {
  FaHome,
  FaChartBar,
  FaListAlt,
  FaBook,
  FaUsers,
  FaUserCog,
  FaCog,
} from "react-icons/fa";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/componentes/ui/sidebar";
import { GalleryVerticalEnd } from "lucide-react";
import { auth } from "@/auth";

const items = [
  {
    title: "Inicio",
    url: "/dashboard",
    icon: FaHome,
    allowedRoles: ["USER", "ADMIN"],
  },
  {
    title: "Productos",
    url: "/dashboard/products",
    icon: FaListAlt,
    allowedRoles: ["USER", "ADMIN"],
  },
  {
    title: "Categorías",
    url: "/dashboard/categories",
    icon: FaBook,
    allowedRoles: ["ADMIN"],
  },
  {
    title: "Clientes",
    url: "/dashboard/clients",
    icon: FaUsers,
    allowedRoles: ["USER", "ADMIN"],
  },
  {
    title: "Proveedores",
    url: "/dashboard/suppliers",
    icon: FaUsers,
    allowedRoles: ["ADMIN"],
  },
  {
    title: "Compras",
    url: "/dashboard/purchases",
    icon: FaChartBar,
    allowedRoles: ["ADMIN"],
  },
  {
    title: "Ventas",
    url: "/dashboard/sales",
    icon: FaChartBar,
    allowedRoles: ["USER", "ADMIN"],
  },
  {
    title: "Usuarios",
    url: "/dashboard/users",
    icon: FaUserCog,
    allowedRoles: ["ADMIN"],
  },
  {
    title: "Configuración",
    url: "/dashboard/settings",
    icon: FaCog,
    allowedRoles: ["ADMIN"],
  },
];

export async function MenuLateral() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const session = await auth();
  const userRole = session?.user?.rol;

  const filteredItems = items.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  return (
    <Sidebar>
      <SidebarHeader className="h-16 border-b border-sidebar-border flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <div className="text-2xl font-semibold">{appName}</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administrar</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-primary/10">
                    <a href={item.url}>
                      <item.icon className="text-primary" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
