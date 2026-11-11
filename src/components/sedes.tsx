"use client";

import { motion } from "framer-motion";
import { Clock, ExternalLink, MapPin } from "lucide-react";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/icons";
import { Logo, SectionHeading } from "@/components/ui";
import { formatPhone, mapsUrl, siteConfig, type Sede } from "@/config/site";
import { spotlight } from "@/lib/hooks";
import { useShop } from "@/store/shop";

function SedeCard({ sede, index }: { sede: Sede; index: number }) {
  const { setSedeId, scrollToId, notify, sedeId } = useShop();
  const selected = sedeId === sede.id;

  const order = () => {
    setSedeId(sede.id);
    notify(`Pedido para ${sede.short}`);
    scrollToId("menu");
  };

  return (
    <motion.article
      onPointerMove={spotlight}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative isolate flex min-h-[520px] flex-col justify-end overflow-hidden rounded-3xl border bg-ink transition-colors hover:border-coral ${selected ? "border-coral" : "border-white/10"}`}
    >
      {sede.image ? (
        <Image src={sede.image} alt={`Sede ${sede.name}`} fill sizes="(min-width:1024px) 33vw, 100vw" quality={75} className="-z-20 object-cover transition duration-700 group-hover:scale-105" />
      ) : (
        <div className="pattern-waves absolute inset-0 -z-20 grid place-items-center bg-[radial-gradient(circle_at_50%_35%,rgb(240_82_67/0.25),transparent_60%)]">
          <Logo size={190} className="-translate-y-12 rounded-full opacity-90" />
        </div>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/55 to-black/10" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(340px circle at var(--mx,50%) var(--my,50%), rgb(240 82 67 / 0.25), transparent 65%)" }}
      />

      <span className="absolute left-5 top-3 font-display text-7xl text-outline">0{index + 1}</span>
      <span className="absolute right-5 top-6 flex h-12 w-12 items-center justify-center" aria-hidden>
        <span className="animate-ping-soft absolute h-4 w-4 rounded-full bg-coral" />
        <span className="grid h-10 w-10 place-items-center rounded-full bg-coral">
          <MapPin size={20} />
        </span>
      </span>

      <div className="p-6">
        <h3 className="font-display text-3xl uppercase leading-none">{sede.name}</h3>
        {sede.subtitle ? <p className="mt-1 text-xs font-bold uppercase tracking-widest text-coral">{sede.subtitle}</p> : null}

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex gap-3">
            <dt className="mt-0.5 text-coral"><MapPin size={16} aria-label="Dirección" /></dt>
            <dd className={sede.address ? "text-white/85" : "text-white/45"}>{sede.address ?? "Dirección por confirmar"}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="mt-0.5 text-coral"><Clock size={16} aria-label="Horario" /></dt>
            <dd className={sede.hours ? "text-white/85" : "text-white/45"}>{sede.hours ?? "Horario por confirmar"}</dd>
          </div>
          {sede.whatsapp ? (
            <div className="flex gap-3">
              <dt className="mt-0.5 text-coral"><WhatsAppIcon size={16} aria-label="WhatsApp" /></dt>
              <dd className="text-white/85">{formatPhone(sede.whatsapp)}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <a
            href={mapsUrl(sede)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 text-sm font-bold backdrop-blur transition hover:border-white hover:bg-white hover:text-carbon"
          >
            Ver en Maps <ExternalLink size={15} />
          </a>
          <button
            type="button"
            onClick={order}
            className="inline-flex h-12 items-center justify-center rounded-full bg-coral text-sm font-bold transition hover:bg-coral-deep active:scale-95"
          >
            {selected ? "Sede elegida" : "Pedir aquí"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function Sedes() {
  return (
    <section id="sedes" className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading index="04" eyebrow="Nuestras sedes" title={<>Encuentra tu <span className="text-coral">parche</span></>}>
          Tres lugares para antojarte. Elige la tuya y pide directo por WhatsApp.
        </SectionHeading>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {siteConfig.sedes.map((sede, index) => (
            <SedeCard key={sede.id} sede={sede} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
