import { categories, products } from "@/data/menu";
import type { Category, Product } from "@/types/menu";

export interface Menu {
  categories: Category[];
  products: Product[];
}

/**
 * Punto único de acceso al menú.
 *
 * Hoy lee los datos estáticos de src/data/menu.ts. Para conectar Neon/PostgreSQL
 * solo hay que reemplazar el cuerpo de esta función (por ejemplo, con dos
 * consultas SQL a las tablas `categories` y `products`) manteniendo el tipo de
 * retorno; el resto de la aplicación no cambia. Un panel de administración
 * escribiría en esas mismas tablas.
 */
export async function getMenu(): Promise<Menu> {
  return {
    categories: [...categories].sort((a, b) => a.order - b.order),
    products: products.filter((product) => product.available),
  };
}
