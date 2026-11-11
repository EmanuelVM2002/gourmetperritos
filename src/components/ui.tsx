"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import type { Product } from "@/types/menu";

/** Aparece al entrar en pantalla (una sola vez). */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * El logo original trae fondo negro. Con mix-blend-lighten ese negro se funde
 * con el fondo de la página (#111) sin tocar ni recortar el archivo.
 */
export function Logo({
  size,
  className = "",
  priority = false,
}: {
  size: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt="Perritos Gourmet de la UVA"
      width={size}
      height={size}
      priority={priority}
      className={`mix-blend-lighten select-none ${className}`}
    />
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  children,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      <Reveal>
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-coral">
          <span className="font-display text-sm">{index}</span>
          <span className="h-px w-10 bg-coral" />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-4 font-display text-4xl uppercase leading-[0.98] sm:text-5xl lg:text-6xl">{title}</h2>
      </Reveal>
      {children ? (
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">{children}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/** Foto del producto. Sin foto real, muestra la marca en vez de una imagen inventada. */
export function ProductImage({
  product,
  sizes,
  priority = false,
  className = "",
  showReference = true,
}: {
  product: Pick<Product, "name" | "image" | "imageIsReference">;
  sizes: string;
  priority?: boolean;
  className?: string;
  showReference?: boolean;
}) {
  if (!product.image) {
    return (
      <div className={`pattern-waves relative flex h-full w-full items-center justify-center bg-ink ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgb(240_82_67/0.22),transparent_65%)]" />
        <div className="relative flex flex-col items-center gap-2 text-center">
          <Logo size={96} className="rounded-full opacity-80" />
          <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
            Foto próximamente
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes={sizes}
        quality={75}
        priority={priority}
        className={`object-cover ${className}`}
      />
      {product.imageIsReference && showReference ? (
        <span className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80 backdrop-blur">
          Foto de referencia
        </span>
      ) : null}
    </>
  );
}
