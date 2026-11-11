"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "@/components/ui";
import { useShop } from "@/store/shop";

const strip = [
  "/img/sushi-02.jpg",
  "/img/perrito-3.jpg",
  "/img/bao-3.jpg",
  "/img/burger-camaron.jpg",
  "/img/sushi-07.jpg",
  "/img/parrilla-2.jpg",
  "/img/sushi-05.jpg",
  "/img/bao-2.jpg",
];

export function FinalCta() {
  const { scrollToId } = useShop();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-22%"]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-32">
      <div className="absolute bottom-[-45%] left-1/2 -z-10 aspect-square w-[130vw] max-w-[1200px] -translate-x-1/2 rounded-full bg-coral" />
      <div className="pattern-waves absolute inset-0 -z-10 opacity-60" />

      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <h2 className="font-display text-[clamp(2.6rem,9vw,7.5rem)] uppercase leading-[0.92]">
            Los antojos
            <span className="block text-outline">no esperan.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-md text-lg text-white/75">Encuentra tu favorito y déjate sorprender.</p>
        </Reveal>
        <Reveal delay={0.2}>
          <button
            type="button"
            onClick={() => scrollToId("menu")}
            className="group mt-9 inline-flex h-16 items-center gap-4 rounded-full bg-white px-10 font-display text-lg uppercase text-carbon transition hover:bg-carbon hover:text-white active:scale-95"
          >
            Quiero pedir
            <ArrowRight size={22} className="transition group-hover:translate-x-1.5" />
          </button>
        </Reveal>
      </div>

      {/* Tira de fotos que se desplaza con el scroll */}
      <motion.div style={{ x }} className="mt-20 flex w-max gap-4" aria-hidden>
        {strip.map((src, i) => (
          <div
            key={src}
            className={`relative h-44 w-36 shrink-0 overflow-hidden rounded-2xl border-2 border-carbon sm:h-60 sm:w-48 ${i % 2 ? "translate-y-6 -rotate-2" : "rotate-2"}`}
          >
            <Image src={src} alt="" fill sizes="200px" quality={60} className="object-cover" />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
