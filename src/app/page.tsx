import { CartButton, CartDrawer, Toast, WhatsAppFloat } from "@/components/cart";
import { Categories } from "@/components/categories";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { MenuSection } from "@/components/menu-section";
import { Navbar } from "@/components/navbar";
import { ProductModal } from "@/components/product-modal";
import { Sedes } from "@/components/sedes";
import { Surprise } from "@/components/surprise";
import { getMenu } from "@/lib/menu-repository";

export default async function Home() {
  const { categories, products } = await getMenu();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Categories categories={categories} products={products} />
        <MenuSection categories={categories} products={products} />
        <Surprise products={products} />
        <Sedes />
        <FinalCta />
      </main>
      <Footer />

      <ProductModal />
      <CartDrawer />
      <CartButton />
      <WhatsAppFloat />
      <Toast />
    </>
  );
}
