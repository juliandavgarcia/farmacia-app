import { auth } from "@/auth";
import { BotonUsuario } from "@/componentes/dashboard/sistema/boton-usuario";
import { MenuLateral } from "@/componentes/dashboard/sistema/menu-lateral";
import { BotonTema } from "@/componentes/tema/boton-tema";
import { SidebarProvider, SidebarTrigger } from "@/componentes/ui/sidebar";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <MenuLateral />
      <main
        className="flex flex-col min-h-screen w-full bg-muted"
        suppressHydrationWarning
      >
        <header className="flex items-center justify-between h-16 px-2 py-2 border-b bg-primary dark:bg-neutral-950">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold text-white">¡Bienvenido!</h1>
          </div>
          <div className="flex items-center space-x-2">
            <BotonTema />
            <BotonUsuario />
          </div>
        </header>
        <div className="flex-grow bg-primary/5 dark:bg-neutral-900">
          {children}
        </div>

        <footer className="w-full py-4 text-center bg-primary dark:bg-neutral-950 border-t text-white">
          <p className="text-sm">
            © {new Date().getFullYear()} {appName}. Todos los derechos
            reservados.
          </p>
        </footer>
      </main>
    </SidebarProvider>
  );
}
