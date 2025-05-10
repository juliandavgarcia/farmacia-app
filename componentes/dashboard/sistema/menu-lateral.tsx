import {
  Home,
  BarChart2,
  ListOrdered,
  Book,
  Users,
  UserCog,
  Settings,
  Boxes,
  FileText,
  ShoppingCart,
  Truck,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import { IconType } from "react-icons";
import { Minus, Plus, GalleryVerticalEnd } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
} from "@/componentes/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/componentes/ui/collapsible";
import { auth } from "@/auth";
import { NombreAplicacion } from "@/lib/env";

type UserRole = "USER" | "ADMIN" | "CAJERO" | "FARMACEUTICO";

interface MenuItem {
  title: string;
  url: string;
  icon: IconType;
  allowedRoles: UserRole[];
  isActive?: boolean;
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

type MenuItemOrGroup = MenuItem | MenuGroup;

const isMenuGroup = (item: MenuItemOrGroup): item is MenuGroup => {
  return (item as MenuGroup).group !== undefined;
};

const items: MenuItemOrGroup[] = [
  // Dashboard
  {
    title: "Inicio",
    url: "/dashboard",
    icon: Home,
    allowedRoles: ["USER", "ADMIN", "CAJERO", "FARMACEUTICO"],
  },

  // Inventario - Grupo
  {
    group: "Inventario",
    items: [
      {
        title: "Productos",
        url: "/dashboard/productos",
        icon: ListOrdered,
        allowedRoles: ["USER", "ADMIN", "FARMACEUTICO"],
      },
      {
        title: "Categorías",
        url: "/dashboard/categorias",
        icon: Book,
        allowedRoles: ["ADMIN", "FARMACEUTICO"],
      },
      {
        title: "Inventario",
        url: "/dashboard/lotes",
        icon: Boxes,
        allowedRoles: ["ADMIN", "FARMACEUTICO"],
      },
      {
        title: "Vencimientos",
        url: "/dashboard/vencimientos",
        icon: AlertCircle,
        allowedRoles: ["ADMIN", "FARMACEUTICO"],
      },
    ],
  },

  // Ventas - Grupo
  {
    group: "Ventas",
    items: [
      {
        title: "Nueva Venta",
        url: "/dashboard/ventas/nueva",
        icon: ShoppingCart,
        allowedRoles: ["USER", "ADMIN", "CAJERO"],
      },
      {
        title: "Historial Ventas",
        url: "/dashboard/ventas",
        icon: BarChart2,
        allowedRoles: ["USER", "ADMIN"],
      },
      {
        title: "Clientes",
        url: "/dashboard/clientes",
        icon: Users,
        allowedRoles: ["USER", "ADMIN", "CAJERO"],
      },
    ],
  },

  // Compras - Grupo
  {
    group: "Compras",
    items: [
      {
        title: "Nueva Compra",
        url: "/dashboard/compras/nueva",
        icon: Truck,
        allowedRoles: ["ADMIN", "FARMACEUTICO"],
      },
      {
        title: "Historial Compras",
        url: "/dashboard/compras",
        icon: ClipboardList,
        allowedRoles: ["ADMIN"],
      },
      {
        title: "Proveedores",
        url: "/dashboard/proveedores",
        icon: Users,
        allowedRoles: ["ADMIN", "FARMACEUTICO"],
      },
    ],
  },

  // Reportes
  {
    title: "Reportes",
    url: "/dashboard/reportes",
    icon: FileText,
    allowedRoles: ["ADMIN"],
  },

  // Administración - Grupo
  {
    group: "Administración",
    items: [
      {
        title: "Usuarios",
        url: "/dashboard/usuarios",
        icon: UserCog,
        allowedRoles: ["ADMIN"],
      },
      {
        title: "Configuración",
        url: "/dashboard/configuracion",
        icon: Settings,
        allowedRoles: ["ADMIN"],
      },
    ],
  },
];

export async function MenuLateral(): Promise<React.JSX.Element> {
  const session = await auth();
  const userRole = (session?.user?.rol as UserRole) || "USER";

  return (
    <Sidebar>
      <SidebarHeader className="h-16 border-b border-sidebar-border flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span className="font-semibold">{NombreAplicacion}</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-1">
        <SidebarMenu className="space-y-0">
          {/* Renderizar todos los elementos */}
          {items.map((item, index) => {
            // Si es un elemento individual
            if (!isMenuGroup(item)) {
              if (!item.allowedRoles.includes(userRole)) {
                return null;
              }

              return (
                <SidebarMenuItem key={`item-${index}`}>
                  <SidebarMenuButton asChild className="hover:bg-primary/10">
                    <a href={item.url} className="flex items-center">
                      <item.icon className="mr-2 text-primary size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            // Si es un grupo
            const filteredGroupItems = item.items.filter((subItem) =>
              subItem.allowedRoles.includes(userRole)
            );

            if (filteredGroupItems.length === 0) {
              return null;
            }

            return (
              <Collapsible
                key={`group-${index}`}
                defaultOpen={index === 0} // Primer grupo abierto por defecto
                className="group/collapsible"
              >
                {/* Etiqueta del grupo */}
                <CollapsibleTrigger asChild>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center justify-between cursor-pointer hover:bg-secondary/50 hover:rounded-md">
                    {item.group}
                    <Plus className="ml-auto size-3 group-data-[state=open]/collapsible:hidden" />
                    <Minus className="ml-auto size-3 group-data-[state=closed]/collapsible:hidden" />
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {/* Elementos del grupo */}
                    {filteredGroupItems.map((subItem, subIndex) => (
                      <SidebarMenuSubItem key={`subitem-${index}-${subIndex}`}>
                        <SidebarMenuSubButton
                          asChild
                          className="hover:bg-primary/10"
                        >
                          <a
                            href={subItem.url}
                            className="flex items-center pl-2"
                          >
                            <subItem.icon className="mr-2 text-primary size-4" />
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
