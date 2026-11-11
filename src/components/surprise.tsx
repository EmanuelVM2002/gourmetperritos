"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Dices, Plus, RotateCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProductImage } from "@/components/ui";
import { formatCOP, optionsLabel, randomOptions, resolvePrice } from "@/lib/pricing";
import { useShop } from "@/store/shop";
import type { Product, SelectedOptions } from "@/types/menu";

interface Pick {
  product: Product;
  options: SelectedOptions;
}

const SPIN_MS = 1500;
const confetti = Array.from({ length: 16 }, (_, i) => ({
  angle: (i / 16) * Math.PI * 2,
  distance: 110 + (i % 4) * 28,
  color: i % 3 === 0 ? "#ffffff" : "#f05243",
  size: 7 + (i % 3) * 3,
}));

export function Surprise({ products }: { products: Product[] }) {
  const { addItem } = useShop();
  // Las bebidas no entran en la sorpresa: queremos un plato.
  const pool = products.filter((p) => p.categoryId !== "bebidas");
  const [phase, setPhase] = useState<"idle" | "spinning" | "done">("idle");
  const [ticker, setTicker] = useState<Product | null>(null);
  const [result, setResult] = useState<Pick | null>(null);
  const [burst, setBurst] = useState(0);
  const lastId = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const choose = (): Pick => {
    // Primero una categoría al azar, para que perritos y hamburguesas no ahoguen al sushi o los baos.
    const categoryIds = Array.from(new Set(pool.map((p) => p.categoryId)));
    let product: Product;
    do {
      const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
      const group = pool.filter((p) => p.categoryId === categoryId);
      product = group[Math.floor(Math.random() * group.length)];
    } while (product.id === lastId.current && pool.length > 1);
    lastId.current = product.id;
    return { product, options: randomOptions(product) };
  };

  const spin = () => {
    if (phase === "spinning") return;
    setPhase("spinning");
    const winner = choose();

    const interval = window.setInterval(() => {
      setTicker(pool[Math.floor(Math.random() * pool.length)]);
    }, 85);
    const stop = window.setTimeout(() => {
      window.clearInterval(interval);
      setResult(winner);
      setTicker(null);
      setBurst((n) => n + 1);
      setPhase("done");
    }, SPIN_MS);
    timers.current.push(interval, stop);
  };

  const shown = phase === "spinning" ? ticker : result?.product ?? null;

  return (
    <section id="sorprendeme" className="relative isolate overflow-hidden bg-coral px-4 py-24 text-carbon sm:px-6 lg:px-8 lg:py-32">
      <div className="pattern-waves absolute inset-0 -z-10 opacity-60 invert" />
      <div className="absolute -left-24 top-10 -z-10 aspect-square w-80 rounded-full bg-carbon/10" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.28em]">
            <span className="font-display text-sm">03</span>
            <span className="h-px w-10 bg-carbon" />
            Interacción especial
          </p>
          <h2 className="mt-4 font-display text-4xl uppercase leading-[0.98] sm:text-6xl lg:text-7xl">
            ¿No sabes qué pedir?
          </h2>
          <p className="mt-5 max-w-md text-base font-semibold leading-relaxed text-carbon/75 sm:text-lg">
            Deja que la casa decida por ti. Un toque y te mostramos un antojo al azar del menú.
          </p>

          <motion.button
            type="button"
            onClick={spin}
            disabled={phase === "spinning"}
            whileTap={{ scale: 0.95 }}
            className="group mt-9 inline-flex h-16 items-center gap-4 rounded-full bg-carbon px-9 font-display text-lg uppercase text-white shadow-[0_18px_40px_-12px_rgb(0_0_0/0.7)] transition hover:bg-black disabled:opacity-80 sm:text-xl"
          >
            <Dices size={26} className={phase === "spinning" ? "animate-spin" : "transition group-hover:rotate-180"} />
            {phase === "done" ? "Otra vez" : "¡Sorpréndeme!"}
            {phase === "done" ? <RotateCw size={18} /> : null}
          </motion.button>
        </div>

        {/* Escenario */}
        <div className="relative mx-auto w-full max-w-md" aria-live="polite">
          <div className="relative overflow-hidden rounded-[2rem] border-4 border-carbon bg-carbon shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-ink">
              <AnimatePresence mode="popLayout">
                {shown ? (
                  <motion.div
                    key={`${shown.id}-${phase}-${burst}`}
                    initial={phase === "done" ? { scale: 1.25, opacity: 0, rotate: -3 } : { opacity: 0.4 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0 }}
                    transition={phase === "done" ? { type: "spring", stiffness: 160, damping: 14 } : { duration: 0.06 }}
                    className={`absolute inset-0 ${phase === "spinning" ? "blur-[2px]" : ""}`}
                  >
                    <ProductImage product={shown} sizes="(min-width:1024px) 440px, 90vw" showReference={phase === "done"} />
                  </motion.div>
                ) : (
                  <motion.div key="idle" className="absolute inset-0 grid place-items-center">
                    <span className="font-display text-[9rem] leading-none text-coral/90">?</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confeti */}
              {phase === "done" ? (
                <div key={burst} className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden>
                  {confetti.map((piece, i) => (
                    <motion.span
                      key={i}
                      className="absolute block rounded-[2px]"
                      style={{ width: piece.size, height: piece.size, background: piece.color }}
                      initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                      animate={{
                        x: Math.cos(piece.angle) * piece.distance,
                        y: Math.sin(piece.angle) * piece.distance,
                        opacity: 0,
                        rotate: 280,
                      }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="min-h-[190px] p-5 text-white sm:p-6">
              {phase === "spinning" ? (
                <p className="font-display text-2xl uppercase text-coral">Eligiendo…</p>
              ) : result && phase === "done" ? (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-coral">Hoy te toca</p>
                  <h3 className="mt-1 font-display text-2xl uppercase leading-tight">{result.product.name}</h3>
                  {Object.keys(result.options).length ? (
                    <p className="mt-1 text-xs font-bold text-white/60">{optionsLabel(result.options)}</p>
                  ) : null}
                  <p className="mt-2 line-clamp-2 text-sm text-white/65">{result.product.description}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="font-display text-2xl text-coral">{formatCOP(resolvePrice(result.product, result.options))}</span>
                    <button
                      type="button"
                      onClick={() => addItem(result.product, result.options)}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-coral px-5 text-sm font-bold transition hover:bg-coral-deep active:scale-95"
                    >
                      <Plus size={18} /> Agregar al pedido
                    </button>
                  </div>
                </motion.div>
              ) : (
                <p className="font-display text-2xl uppercase text-white/80">Tu próximo antojo aparece aquí.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
