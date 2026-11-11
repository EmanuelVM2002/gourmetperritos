"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import type { PointerEvent, ReactNode } from "react";
import { Logo } from "@/components/ui";
import { useShop } from "@/store/shop";

const headline = ["No vinimos a", "comer lo de", "siempre."];

/** Capa que se desplaza en sentido contrario al cursor, a distinta profundidad. */
function Layer({
  x,
  y,
  depth,
  className,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  depth: number;
  className: string;
  children: ReactNode;
}) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  return (
    <motion.div style={{ x: tx, y: ty }} className={`absolute ${className}`}>
      {children}
    </motion.div>
  );
}

function PhotoCard({
  src,
  alt,
  sizes,
  className,
  priority,
  delay,
  rotate,
}: {
  src: string;
  alt: string;
  sizes: string;
  className: string;
  priority?: boolean;
  delay: number;
  rotate: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: rotate - 8 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{ type: "spring", stiffness: 90, damping: 14, delay }}
      className={`relative overflow-hidden border border-white/15 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)] ${className}`}
    >
      <Image src={src} alt={alt} fill sizes={sizes} quality={75} priority={priority} className="animate-kenburns object-cover" />
    </motion.div>
  );
}

export function Hero() {
  const { scrollToId, openCart } = useShop();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 60, damping: 18 });
  const y = useSpring(my, { stiffness: 60, damping: 18 });

  const onMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set(((event.clientX - rect.left) / rect.width - 0.5) * -40);
    my.set(((event.clientY - rect.top) / rect.height - 0.5) * -40);
  };

  return (
    <section
      id="inicio"
      onPointerMove={onMove}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-24 pt-28 lg:pb-16"
    >
      {/* Fondo: disco rojo (sol naciente), olas y resplandor */}
      <div className="pattern-waves absolute inset-0 -z-10 opacity-70" />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-[-18%] top-[8%] -z-10 aspect-square w-[78vw] max-w-[760px] rounded-full bg-coral/90 blur-[2px] lg:right-[-6%]"
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_30%,transparent_0%,var(--color-carbon)_75%)]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-8">
        {/* Texto */}
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-coral"
          >
            <span className="h-px w-10 bg-coral" />
            Mucho más que perritos
          </motion.p>

          <h1 className="font-display text-[clamp(2.6rem,8.4vw,4.6rem)] lg:text-[clamp(3.4rem,6vw,5.6rem)] uppercase leading-[0.92] tracking-tight">
            {headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${i === 2 ? "text-coral" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-7 font-display text-xl uppercase sm:text-2xl"
          >
            Vinimos a despertar tus antojos.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 }}
            className="mt-4 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg"
          >
            Sushi, baos, arroces, perritos gourmet, hamburguesas y mucho más. Aquí siempre hay algo nuevo por descubrir.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => scrollToId("menu")}
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-coral px-8 font-display text-sm uppercase tracking-wide text-white transition hover:bg-coral-deep active:scale-95"
            >
              Explorar el menú
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={openCart}
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/25 bg-carbon/40 px-8 font-display text-sm uppercase tracking-wide backdrop-blur transition hover:border-white hover:bg-white hover:text-carbon active:scale-95"
            >
              Hacer mi pedido
            </button>
          </motion.div>
        </div>

        {/* Composición de fotos */}
        <div className="relative mx-auto aspect-[4/4.7] w-full max-w-[540px]">
          <Layer x={x} y={y} depth={0.5} className="left-[26%] top-[2%] h-[82%] w-[50%]">
            <PhotoCard
              src="/img/sushi-01.jpg"
              alt="Rollo de pulpo crunch sostenido con palillos"
              sizes="(min-width:1024px) 280px, 50vw"
              priority
              delay={0.5}
              rotate={0}
              className="h-full w-full rounded-t-full rounded-b-3xl"
            />
          </Layer>
          <Layer x={x} y={y} depth={1} className="bottom-[2%] left-[0%] h-[38%] w-[40%]">
            <PhotoCard
              src="/img/perrito-3.jpg"
              alt="Perrito gourmet con salsas de la casa"
              sizes="(min-width:1024px) 220px, 40vw"
              delay={0.7}
              rotate={-7}
              className="h-full w-full rounded-3xl"
            />
          </Layer>
          <Layer x={x} y={y} depth={0.8} className="right-[0%] top-[12%] h-[30%] w-[34%]">
            <PhotoCard
              src="/img/burger-camaron.jpg"
              alt="Hamburguesa de camarón apanado"
              sizes="(min-width:1024px) 190px, 34vw"
              delay={0.85}
              rotate={6}
              className="h-full w-full rounded-3xl"
            />
          </Layer>
          <Layer x={x} y={y} depth={1.3} className="bottom-[6%] right-[4%] aspect-square w-[27%]">
            <PhotoCard
              src="/img/bao-1.jpg"
              alt="Baos al vapor en canasta de bambú"
              sizes="150px"
              delay={1}
              rotate={0}
              className="h-full w-full rounded-full"
            />
          </Layer>

          {/* Logo: entra girando y luego flota */}
          <Layer x={x} y={y} depth={1.6} className="left-[-2%] top-[-2%] w-[34%]">
            <motion.div
              initial={{ scale: 0, rotate: -50, opacity: 0 }}
              animate={{ scale: 1, rotate: -6, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.4 }}
            >
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                <Logo size={220} priority className="w-full rounded-full shadow-[0_18px_50px_-10px_rgb(0_0_0/0.9)]" />
              </motion.div>
            </motion.div>
          </Layer>

          {/* Sello giratorio */}
          <Layer x={x} y={y} depth={1.1} className="bottom-[34%] right-[30%] hidden aspect-square w-[22%] sm:block">
            <div className="relative h-full w-full">
              <svg viewBox="0 0 100 100" className="animate-spin-slow absolute inset-0 h-full w-full" aria-hidden>
                <defs>
                  <path id="ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text fontSize="9.5" fontWeight="800" letterSpacing="2.2" fill="#fff" className="font-display uppercase">
                  <textPath href="#ring">Siempre algo nuevo · Siempre algo nuevo ·</textPath>
                </text>
              </svg>
              <div className="absolute inset-[26%] rounded-full bg-carbon" />
              <div className="absolute inset-[26%] grid place-items-center font-display text-xs leading-none text-coral">UVA</div>
            </div>
          </Layer>
        </div>
      </div>

      {/* Indicador de scroll */}
      <motion.button
        type="button"
        onClick={() => scrollToId("antojos")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 transition hover:text-white"
        aria-label="Bajar a explorar los antojos"
      >
        Desliza
        <motion.span animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={18} />
        </motion.span>
      </motion.button>
    </section>
  );
}
