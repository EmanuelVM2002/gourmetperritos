"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProductImage } from "@/components/ui";
import { useEscape, useLockBodyScroll } from "@/lib/hooks";
import { defaultOptions, formatCOP, resolvePrice } from "@/lib/pricing";
import { useShop } from "@/store/shop";
import type { Product, SelectedOptions } from "@/types/menu";

function ModalBody({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addItem } = useShop();
  const [selected, setSelected] = useState<SelectedOptions>(() => defaultOptions(product));
  const [qty, setQty] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => closeRef.current?.focus(), []);
  useEscape(true, onClose);

  const unit = resolvePrice(product, selected);

  const handleAdd = () => {
    addItem(product, selected, qty);
    onClose();
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      initial={{ y: 60, opacity: 0, scale: 0.97 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      onClick={(e) => e.stopPropagation()}
      className="relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-white/10 bg-ink sm:max-w-4xl sm:rounded-[2rem] md:grid md:grid-cols-[1fr_1.1fr]"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-black/70 backdrop-blur transition hover:bg-coral"
        aria-label="Cerrar"
      >
        <X size={20} />
      </button>

      <div className="relative h-56 shrink-0 sm:h-72 md:h-auto md:min-h-[520px]">
        <ProductImage product={product} sizes="(min-width:768px) 480px, 100vw" priority />
      </div>

      <div className="flex min-h-0 flex-col overflow-y-auto p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-coral">{product.kind ?? "Antojo"}</p>
        <h3 className="mt-2 pr-10 font-display text-3xl uppercase leading-none sm:text-4xl">{product.name}</h3>
        {product.badge ? (
          <span className="mt-3 w-fit rounded-full bg-coral px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider">{product.badge}</span>
        ) : null}
        <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">{product.description}</p>

        <h4 className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-white/45">Ingredientes</h4>
        <ul className="mt-3 flex flex-wrap gap-2">
          {product.ingredients.map((ingredient) => (
            <li key={ingredient} className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-white/80">
              {ingredient}
            </li>
          ))}
        </ul>

        {(product.options ?? []).map((option) => (
          <fieldset key={option.label} className="mt-6">
            <legend className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">{option.label}</legend>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup">
              {option.choices.map((choice) => {
                const active = selected[option.label] === choice.name;
                return (
                  <button
                    key={choice.name}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelected((s) => ({ ...s, [option.label]: choice.name }))}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      active ? "border-coral bg-coral text-white" : "border-white/15 text-white/75 hover:border-white/50"
                    }`}
                  >
                    {choice.name}
                    {choice.price !== undefined ? <span className="ml-1.5 text-xs opacity-70">{formatCOP(choice.price)}</span> : null}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-center">
          <div className="flex h-14 items-center justify-between rounded-full border border-white/15 px-2 sm:w-40">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10"
              aria-label="Quitar una unidad"
            >
              <Minus size={18} />
            </button>
            <span className="font-display text-lg" aria-live="polite">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(20, q + 1))}
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10"
              aria-label="Agregar una unidad"
            >
              <Plus size={18} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex h-14 flex-1 items-center justify-center gap-3 rounded-full bg-coral px-6 font-display text-sm uppercase tracking-wide transition hover:bg-coral-deep active:scale-95"
          >
            Agregar al pedido
            <span className="rounded-full bg-black/25 px-3 py-1">{formatCOP(unit * qty)}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function ProductModal() {
  const { detail, closeDetail } = useShop();
  useLockBodyScroll(detail !== null);

  return (
    <AnimatePresence>
      {detail ? (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDetail}
          className="fixed inset-0 z-[55] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <ModalBody key={detail.id} product={detail} onClose={closeDetail} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
