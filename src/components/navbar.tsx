"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui";
import { useEscape, useLockBodyScroll } from "@/lib/hooks";
import { useShop } from "@/store/shop";

const links = [
  { href: "#antojos", label: "Antojos" },
  { href: "#menu", label: "Menú" },
  { href: "#sorprendeme", label: "Sorpréndeme" },
  { href: "#sedes", label: "Sedes" },
];

export function Navbar() {
  const { count, openCart } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLockBodyScroll(open);
  useEscape(open, () => setOpen(false));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? "border-b border-white/10 bg-carbon/80 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Principal">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Perritos Gourmet de la UVA, inicio">
            <Logo size={52} className="h-[52px] w-[52px] rounded-full" priority />
            <span className="hidden font-display text-sm uppercase leading-none tracking-wide lg:block">
              Perritos Gourmet
              <span className="block text-coral">de la UVA</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCart}
              className="relative flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-coral px-4 text-sm font-bold text-white transition hover:bg-coral-deep active:scale-95"
              aria-label={`Abrir mi pedido, ${count} ${count === 1 ? "producto" : "productos"}`}
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Mi pedido</span>
              <AnimatePresence initial={false}>
                {count > 0 ? (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1.5 text-xs font-extrabold text-carbon"
                  >
                    {count}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 md:hidden"
              aria-label="Abrir menú de navegación"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-carbon md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="pattern-waves absolute inset-0" />
            <div className="relative flex h-[72px] items-center justify-between px-4">
              <Logo size={52} className="h-[52px] w-[52px] rounded-full" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>
            <ul className="relative flex flex-1 flex-col justify-center gap-2 px-6">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-white/10 py-4 font-display text-4xl uppercase"
                  >
                    <span className="text-sm text-coral">0{i + 1}</span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
