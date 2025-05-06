import { Caracteristicas } from "@/componentes/inicio/caracteristicas";
import Footer from "@/componentes/inicio/footer";
import Header from "@/componentes/inicio/header";
import { Hero } from "@/componentes/inicio/hero";

export const metadata = {
  title: "Home",
  description: "Welcome to the home page",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Header />
      <main className="flex-0.5">
        <Hero />
        <Caracteristicas />
      </main>
      <Footer />
    </div>
  );
}
