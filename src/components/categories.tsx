"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Reveal, SectionHeading } from "@/components/ui";
import { spotlight } from "@/lib/hooks";
import { useShop } from "@/store/shop";
import type { Category, CategoryId, Product } from "@/types/menu";

/** Composición asimétrica (12 columnas en escritorio, 2 en móvil). */
const layout: Record<CategoryId, { span: string; tall?: boolean }> = {
  sushi: { span: "col-span-2 md:col-span-5 md:row-span-2", tall: true },
  perritos: { span: "col-span-1 md:col-span-4" },
  baos: { span: "col-span-1 md:col-span-3" },
  hamburguesas: { span: "col-span-1 md:col-span-3" },
  arroces: { span: "col-span-1 md:col-span-4" },
  otros: { span: "col-span-2 md:col-span-12" },
  bebidas: { span: "hidden" },
};

function countLabel(category: Category, count: number) {
  if (category.id === "sushi") return `${count} rollos`;
  return `${count} ${count === 1 ? "opción" : "opciones"}`;
}

export function Categories({ categories, products }: { categories: Category[]; products: Product[] }) {
  const { goToCategory } = useShop();
  const featured = categories.filter((c) => c.id !== "bebidas");
  const drinks = categories.find((c) => c.id === "bebidas");

  return (
    <section id="antojos" className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading index="01" eyebrow="Explora tus antojos" title={<>¿Qué se te antoja hoy?</>}>
          Elige un mundo y entra directo al menú. Todo se pide por WhatsApp.
        </SectionHeading>

        <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[240px] md:grid-cols-12 md:gap-4">
          {featured.map((category, index) => {
            const count = products.filter((p) => p.categoryId === category.id).length;
            const config = layout[category.id];
            return (
              <motion.button
                key={category.id}
                type="button"
                onClick={() => goToCategory(category.id)}
                onPointerMove={spotlight}
                initial={{ opacity: 0, y: 36, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative isolate overflow-hidden rounded-3xl border border-white/10 text-left transition-colors hover:border-coral ${config.span} ${config.tall ? "row-span-2" : ""}`}
                aria-label={`Ver ${category.name} en el menú`}
              >
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes={category.id === "sushi" ? "(min-width:768px) 42vw, 100vw" : "(min-width:768px) 33vw, 50vw"}
                  quality={75}
                  className="-z-20 object-cover transition duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
                {/* Luz que sigue al cursor */}
                <div
                  className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgb(240 82 67 / 0.38), transparent 65%)" }}
                />

                <span className="absolute right-4 top-3 font-display text-5xl text-outline md:text-6xl">0{index + 1}</span>

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
                  <div>
                    <h3 className={`font-display uppercase leading-none ${config.tall || category.id === "otros" ? "text-3xl sm:text-4xl md:text-5xl" : "text-base sm:text-xl md:text-base lg:text-xl xl:text-2xl"} break-words`}>
                      {category.name}
                    </h3>
                    <p className="mt-2 text-xs font-semibold text-white/70 sm:text-sm">
                      {category.description}
                      <span className="mx-2 text-coral">/</span>
                      {countLabel(category, count)}
                    </p>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-carbon transition duration-300 group-hover:rotate-45 group-hover:bg-coral group-hover:text-white">
                    <ArrowUpRight size={20} />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {drinks ? (
          <Reveal className="mt-6">
            <button
              type="button"
              onClick={() => goToCategory("bebidas")}
              className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/70 transition hover:text-white"
            >
              ¿Con sed? Mira las bebidas
              <span className="grid h-8 w-8 place-items-center rounded-full border border-white/25 transition group-hover:border-coral group-hover:bg-coral">
                <ArrowUpRight size={15} />
              </span>
            </button>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
