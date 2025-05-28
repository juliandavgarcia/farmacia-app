import Link from "next/link";
import Image from "next/image";
import { Button } from "@/componentes/ui/button";
import { Badge } from "@/componentes/ui/badge";
import { NombreAplicacion } from "@/lib/env";
import { Star, Users, Shield, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
      <div className="container relative px-4 md:px-6">
        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          >
            <Shield className="w-3 h-3 mr-1" />
            100% Seguro
          </Badge>
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          >
            <Users className="w-3 h-3 mr-1" />
            +500 Farmacias
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-emerald-800 dark:from-white dark:via-blue-200 dark:to-emerald-200 bg-clip-text text-transparent">
                  Simplifica tu trabajo diario
                </span>
                <br />
                <span className="text-slate-700 dark:text-slate-300">
                  en la farmacia
                </span>
              </h1>

              <p className="max-w-[600px] text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {NombreAplicacion} es el sistema que te permite atender a tus
                pacientes con mayor rapidez y precisión, mientras reduces
                errores y optimizas tu inventario.
              </p>
            </div>

            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
              >
                <Link
                  href="#caracteristicas"
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Ver Funcionalidades
                </Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-white dark:border-slate-900"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 border-2 border-white dark:border-slate-900"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 border-2 border-white dark:border-slate-900"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-400 to-rose-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-xs font-bold">
                    +
                  </div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <div className="font-medium">
                    500+ farmacias confían en nosotros
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                    <span className="ml-1 text-xs">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px]">
              {/* Main image container */}
              <div className="relative w-full h-full overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-">
                <Image
                  src="/inicio.svg"
                  alt="Farmacéutico usando el sistema POS"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  fill
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
