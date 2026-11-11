export type CategoryId =
  | "perritos"
  | "sushi"
  | "baos"
  | "arroces"
  | "hamburguesas"
  | "otros"
  | "bebidas";

export interface Category {
  id: CategoryId;
  name: string;
  /** Frase corta que acompaña a la categoría en las tarjetas. */
  description: string;
  image: string;
  order: number;
}

export interface OptionChoice {
  name: string;
  /** Si existe, reemplaza el precio base del producto al elegir esta opción. */
  price?: number;
}

export interface ProductOption {
  /** Nombre de la opción, por ejemplo "Proteína" o "Sabor". */
  label: string;
  choices: OptionChoice[];
}

export interface Product {
  id: string;
  categoryId: CategoryId;
  /** Etiqueta secundaria dentro de la categoría (Entrada, Ceviche, Parrilla, Postre...). */
  kind?: string;
  name: string;
  description: string;
  ingredients: string[];
  /** Precio en pesos colombianos (COP), sin decimales. */
  price: number;
  /** Ruta de la foto, o null si todavía no hay una foto real. */
  image: string | null;
  /** true cuando la foto es de un plato de la misma familia, no del plato exacto. */
  imageIsReference?: boolean;
  badge?: string;
  options?: ProductOption[];
  available: boolean;
}

export type SelectedOptions = Record<string, string>;
