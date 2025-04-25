import Footer from "@/components/inicio/footer";
import Header from "@/components/inicio/header";

export const metadata = {
  title: "Home",
  description: "Welcome to the home page",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        <div className="container mx-auto p-4 space-y-4"></div>
      </main>
      <Footer />
    </div>
  );
}
