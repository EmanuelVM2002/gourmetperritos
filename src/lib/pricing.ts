import type { Product, SelectedOptions } from "@/types/menu";

const copFormatter = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });

/** 39500 -> "$39.500" */
export const formatCOP = (amount: number) => `$${copFormatter.format(amount)}`;

/** Precio del producto con las opciones elegidas (una opción puede cambiar el precio). */
export function resolvePrice(product: Product, selected: SelectedOptions = {}): number {
  for (const option of product.options ?? []) {
    const choice = option.choices.find((c) => c.name === selected[option.label]);
    if (choice?.price !== undefined) return choice.price;
  }
  return product.price;
}

/** true si el precio cambia según la opción elegida. */
export function hasVariablePrice(product: Product): boolean {
  return (product.options ?? []).some((option) => option.choices.some((c) => c.price !== undefined));
}

/** Menor precio posible del producto. */
export function minPrice(product: Product): number {
  const prices = (product.options ?? []).flatMap((o) => o.choices.map((c) => c.price).filter((p): p is number => p !== undefined));
  return prices.length ? Math.min(...prices) : product.price;
}

/** Primera opción de cada grupo, para preseleccionar. */
export function defaultOptions(product: Product): SelectedOptions {
  const selected: SelectedOptions = {};
  for (const option of product.options ?? []) selected[option.label] = option.choices[0].name;
  return selected;
}

/** Opciones al azar (para "Sorpréndeme"). */
export function randomOptions(product: Product): SelectedOptions {
  const selected: SelectedOptions = {};
  for (const option of product.options ?? []) {
    selected[option.label] = option.choices[Math.floor(Math.random() * option.choices.length)].name;
  }
  return selected;
}

export function optionsLabel(selected: SelectedOptions): string {
  return Object.entries(selected)
    .map(([label, value]) => `${label}: ${value}`)
    .join(" · ");
}
