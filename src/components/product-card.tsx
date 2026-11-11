"use client";

import { motion } from "framer-motion";
import { Check, Plus, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { ProductImage } from "@/components/ui";
import { spotlight } from "@/lib/hooks";
import { formatCOP, hasVariablePrice, minPrice } from "@/lib/pricing";
import { useShop } from "@/store/shop";
import type { Product } from "@/types/menu";

export function ProductCard({ product, categoryName }: { product: Product; categoryName: string }) {
  const { addItem, openDetail } = useShop();
  const [added, setAdded] = useState(false);
  const hasOptions = (product.options?.length ?? 0) > 0;
  const shownIngredients = product.ingredients.slice(0, 3);
  const extra = product.ingredients.length - shownIngredients.length;

  const handleAdd = () => {
    if (hasOptions) {
      openDetail(product);
      return;
    }
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={spotlight}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink transition-colors hover:border-coral/70"
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(260px circle at var(--mx,50%) var(--my,30%), rgb(240 82 67 / 0.16), transparent 65%)" }}
      />

      <button
        type="button"
        onClick={() => openDetail(product)}
        className="relative block aspect-[4/3] w-full overflow-hidden text-left"
        aria-label={`Ver detalle de ${product.name}`}
      >
        <ProductImage
          product={product}
          sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="transition duration-700 ease-out group-hover:scale-110"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur">
          {product.kind ?? categoryName}
        </span>
        {product.badge ? (
          <span className="absolute right-3 top-3 rounded-full bg-coral px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider">
            {product.badge}
          </span>
        ) : null}
      </button>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg uppercase leading-tight">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">{product.description}</p>

        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Ingredientes">
          {shownIngredients.map((ingredient) => (
            <li key={ingredient} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/65">
              {ingredient}
            </li>
          ))}
          {extra > 0 ? (
            <li className="rounded-full border border-coral/40 px-2.5 py-1 text-[11px] font-bold text-coral">+{extra}</li>
          ) : null}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            {hasVariablePrice(product) ? (
              <span className="block text-[10px] font-bold uppercase tracking-widest text-white/45">Desde</span>
            ) : null}
            <span className="font-display text-2xl text-coral">{formatCOP(minPrice(product))}</span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-bold transition active:scale-95 ${
              added ? "bg-white text-carbon" : "bg-coral text-white hover:bg-coral-deep"
            }`}
          >
            {added ? <Check size={18} /> : hasOptions ? <SlidersHorizontal size={16} /> : <Plus size={18} />}
            {added ? "Agregado" : hasOptions ? "Elegir" : "Agregar"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
