"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { Logo } from "@/components/ui";
import { siteConfig, getSede } from "@/config/site";
import { useEscape, useLockBodyScroll } from "@/lib/hooks";
import { formatCOP } from "@/lib/pricing";
import { buildOrderMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import { useShop } from "@/store/shop";

/** Botón flotante del carrito (abajo a la derecha). */
export function CartButton() {
  const { count, subtotal, openCart, cartOpen } = useShop();
  return (
    <AnimatePresence>
      {!cartOpen ? (
        <motion.button
          type="button"
          onClick={openCart}
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.8 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-5 right-4 z-40 flex h-14 items-center gap-3 rounded-full bg-coral pl-5 pr-2 font-bold shadow-[0_18px_40px_-10px_rgb(240_82_67/0.7)] transition hover:bg-coral-deep sm:right-6"
          aria-label={`Abrir mi pedido: ${count} ${count === 1 ? "producto" : "productos"}, ${formatCOP(subtotal)}`}
        >
          <ShoppingBag size={20} />
          <span className="hidden text-sm sm:inline">{count > 0 ? formatCOP(subtotal) : "Mi pedido"}</span>
          <motion.span
            key={count}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="grid h-10 min-w-10 place-items-center rounded-full bg-white px-2 font-display text-base text-carbon"
          >
            {count}
          </motion.span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

/** Botón flotante de WhatsApp (abajo a la izquierda): consultas generales. */
export function WhatsAppFloat() {
  const phone = siteConfig.whatsappGeneral;
  const href = buildWhatsappUrl(phone, "Hola, Perritos Gourmet de la UVA. Quisiera información.");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 left-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_-10px_rgb(37_211_102/0.6)] transition hover:scale-110 active:scale-95 sm:left-6"
      aria-label="Escribirnos por WhatsApp"
    >
      <WhatsAppIcon size={30} strokeWidth={1.9} />
    </a>
  );
}

export function Toast() {
  const { toast } = useShop();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[65] flex justify-center px-4" aria-live="polite" role="status">
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex max-w-sm items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-bold text-carbon shadow-2xl"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-coral text-white">
              <Check size={14} strokeWidth={3} />
            </span>
            <span className="truncate">{toast.message}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function CartDrawer() {
  const {
    lines,
    count,
    subtotal,
    changeQty,
    removeLine,
    clearCart,
    sedeId,
    setSedeId,
    cartOpen,
    closeCart,
    scrollToId,
  } = useShop();
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [sedeError, setSedeError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const sedeRef = useRef<HTMLFieldSetElement>(null);

  useLockBodyScroll(cartOpen);
  useEscape(cartOpen, closeCart);

  const sede = sedeId ? getSede(sedeId) : undefined;

  const send = () => {
    if (!sede) {
      setSedeError(true);
      setShakeKey((k) => k + 1);
      sedeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const message = buildOrderMessage({ lines, sede, name, notes });
    window.open(buildWhatsappUrl(sede.whatsapp, message), "_blank", "noopener,noreferrer");
  };

  const goToMenu = () => {
    closeCart();
    setTimeout(() => scrollToId("menu"), 250);
  };

  return (
    <AnimatePresence>
      {cartOpen ? (
        <motion.div
          key="cart-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="fixed inset-0 z-[55] bg-black/75 backdrop-blur-sm"
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Mi pedido"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/10 bg-ink"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="font-display text-2xl uppercase">Mi pedido</h2>
                <p className="text-xs text-white/50">{count} {count === 1 ? "producto" : "productos"}</p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 transition hover:bg-white/10"
                aria-label="Cerrar mi pedido"
              >
                <X size={20} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <Logo size={120} className="rounded-full opacity-90" />
                <div>
                  <p className="font-display text-2xl uppercase">Tu pedido está vacío</p>
                  <p className="mt-2 text-sm text-white/55">Agrega algo del menú y lo armamos por WhatsApp.</p>
                </div>
                <button
                  type="button"
                  onClick={goToMenu}
                  className="h-12 rounded-full bg-coral px-7 font-display text-sm uppercase transition hover:bg-coral-deep"
                >
                  Ver el menú
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="space-y-3">
                    <AnimatePresence initial={false}>
                      {lines.map((line) => (
                        <motion.li
                          key={line.key}
                          layout
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                          className="flex gap-3 rounded-2xl border border-white/10 bg-carbon/60 p-3"
                        >
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink">
                            {line.image ? (
                              <Image src={line.image} alt="" fill sizes="80px" className="object-cover" />
                            ) : (
                              <div className="grid h-full place-items-center">
                                <Logo size={56} className="rounded-full opacity-70" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-bold leading-tight">{line.name}</h3>
                              <button
                                type="button"
                                onClick={() => removeLine(line.key)}
                                className="shrink-0 text-white/40 transition hover:text-coral"
                                aria-label={`Quitar ${line.name}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            {Object.keys(line.options).length ? (
                              <p className="mt-0.5 text-[11px] leading-snug text-white/50">
                                {Object.values(line.options).join(" · ")}
                              </p>
                            ) : null}
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center rounded-full border border-white/15">
                                <button
                                  type="button"
                                  onClick={() => changeQty(line.key, -1)}
                                  className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/10"
                                  aria-label={`Quitar una unidad de ${line.name}`}
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-7 text-center text-sm font-bold">{line.qty}</span>
                                <button
                                  type="button"
                                  onClick={() => changeQty(line.key, 1)}
                                  className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/10"
                                  aria-label={`Agregar una unidad de ${line.name}`}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <span className="font-display text-lg text-coral">{formatCOP(line.unitPrice * line.qty)}</span>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="mt-3 text-xs font-bold uppercase tracking-widest text-white/40 transition hover:text-coral"
                  >
                    Vaciar pedido
                  </button>

                  {/* Sede */}
                  <fieldset
                    ref={sedeRef}
                    key={shakeKey}
                    className={`mt-6 ${sedeError && !sede ? "animate-shake" : ""}`}
                  >
                    <legend className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">¿A qué sede le pedimos?</legend>
                    <div className="mt-3 grid gap-2" role="radiogroup">
                      {siteConfig.sedes.map((s) => {
                        const active = sedeId === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => {
                              setSedeId(s.id);
                              setSedeError(false);
                            }}
                            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                              active ? "border-coral bg-coral/15" : sedeError ? "border-coral/60" : "border-white/12 hover:border-white/40"
                            }`}
                          >
                            <span>
                              <span className="block text-sm font-bold">{s.name}</span>
                              {s.address ? <span className="block text-[11px] text-white/45">{s.address}</span> : null}
                            </span>
                            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${active ? "border-coral bg-coral" : "border-white/30"}`}>
                              {active ? <Check size={12} strokeWidth={3} /> : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {sedeError && !sede ? (
                      <p className="mt-2 text-xs font-bold text-coral" role="alert">Elige la sede para enviar tu pedido.</p>
                    ) : null}
                    {sede && !sede.whatsapp ? (
                      <p className="mt-2 text-[11px] leading-snug text-white/50">
                        Esta sede aún no tiene un WhatsApp configurado: en WhatsApp elegirás a quién enviar el mensaje.
                      </p>
                    ) : null}
                  </fieldset>

                  <div className="mt-5 grid gap-3">
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Tu nombre (opcional)</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={60}
                        autoComplete="name"
                        className="mt-2 h-12 w-full rounded-2xl border border-white/12 bg-carbon px-4 text-sm outline-none transition focus:border-coral"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Notas (opcional)</span>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        maxLength={300}
                        rows={2}
                        placeholder="Sin cebolla, dirección de entrega, etc."
                        className="mt-2 w-full resize-none rounded-2xl border border-white/12 bg-carbon px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-coral"
                      />
                    </label>
                  </div>
                </div>

                <footer className="border-t border-white/10 bg-carbon/70 p-5">
                  <div className="flex items-end justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Subtotal</span>
                    <span className="font-display text-3xl text-coral">{formatCOP(subtotal)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={send}
                    className="mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#25D366] font-display text-sm uppercase tracking-wide text-carbon transition hover:brightness-110 active:scale-95"
                  >
                    <WhatsAppIcon size={22} strokeWidth={2.2} />
                    Enviar pedido por WhatsApp
                  </button>
                  <p className="mt-3 text-center text-[11px] text-white/40">Se abre WhatsApp con tu pedido listo. Allí lo confirmamos contigo.</p>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
