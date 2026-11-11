"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Reveal, SectionHeading } from "@/components/ui";
import { useShop, type CategoryFilter } from "@/store/shop";
import type { Category, Product } from "@/types/menu";

const PAGE_SIZE = 12;

export function MenuSection({ categories, products }: { categories: Category[]; products: Product[] }) {
  const { activeCategory, setActiveCategory } = useShop();
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Al cambiar de categoría se vuelve a la primera página.
  useEffect(() => setVisible(PAGE_SIZE), [activeCategory]);

  const categoryName = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);
  const filtered = useMemo(
    () => (activeCategory === "todo" ? products : products.filter((p) => p.categoryId === activeCategory)),
    [activeCategory, products],
  );
  const shown = filtered.slice(0, visible);

  const chips: Array<{ id: CategoryFilter; label: string; count: number }> = [
    { id: "todo", label: "Todo", count: products.length },
    ...categories.map((c) => ({ id: c.id, label: c.name, count: products.filter((p) => p.categoryId === c.id).length })),
  ];

  return (
    <section id="menu" className="relative bg-[#0b0b0b] pt-24 lg:pt-32">
      <div className="pattern-waves absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading index="02" eyebrow="Menú digital" title={<>Elige tu <span className="text-coral">antojo</span></>}>
          Carta 2026 con los precios reales. Agrega lo que quieras y envía el pedido por WhatsApp.
        </SectionHeading>

        <Reveal delay={0.1} className="mt-4">
          <p className="max-w-xl text-xs leading-relaxed text-white/40">
            Las fotos marcadas como «de referencia» son de platos de la misma familia: el plato que recibas puede variar. Los
            productos sin foto muestran la marca hasta que haya una real.
          </p>
        </Reveal>
      </div>

      {/* Filtros pegajosos */}
      <div className="sticky top-[72px] z-30 mt-10 border-y border-white/10 bg-carbon/85 backdrop-blur-xl">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8" role="tablist" aria-label="Categorías del menú">
          {chips.map((chip) => {
            const active = activeCategory === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(chip.id)}
                className={`relative shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${active ? "text-white" : "text-white/60 hover:text-white"}`}
              >
                {active ? (
                  <motion.span layoutId="chip-active" className="absolute inset-0 rounded-full bg-coral" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                ) : (
                  <span className="absolute inset-0 rounded-full border border-white/12" />
                )}
                <span className="relative">
                  {chip.label} <span className={`text-xs ${active ? "text-white/80" : "text-white/40"}`}>{chip.count}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-32">
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {shown.map((product) => (
              <ProductCard key={product.id} product={product} categoryName={categoryName.get(product.categoryId) ?? ""} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length > visible ? (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="h-14 rounded-full border border-white/25 px-8 font-display text-sm uppercase tracking-wide transition hover:border-coral hover:bg-coral active:scale-95"
            >
              Ver más antojos ({filtered.length - visible})
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
