import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { Logo } from "@/components/ui";
import { formatPhone, siteConfig } from "@/config/site";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export function Footer() {
  const general = siteConfig.whatsappGeneral;
  return (
    <footer className="relative border-t border-white/10 bg-carbon px-4 pb-28 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo size={140} className="h-[140px] w-[140px] rounded-full" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            {siteConfig.tagline}. Sushi, baos, arroces, perritos gourmet y hamburguesas en la UVA de El Poblado, Sabaneta y Provenza.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-coral">Sedes</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {siteConfig.sedes.map((sede) => (
              <li key={sede.id}>
                <span className="font-bold">{sede.name}</span>
                {sede.whatsapp ? <span className="block text-white/50">{formatPhone(sede.whatsapp)}</span> : null}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-coral">Contacto</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-white/80 transition hover:text-coral"
              >
                <InstagramIcon size={20} /> {siteConfig.instagram.handle}
              </a>
            </li>
            {general ? (
              <li>
                <a
                  href={buildWhatsappUrl(general, "Hola, Perritos Gourmet de la UVA. Quisiera información.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-white/80 transition hover:text-coral"
                >
                  <WhatsAppIcon size={20} /> {formatPhone(general)}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.</p>
        <p>Precios de la carta 2026, sujetos a cambio.</p>
      </div>
    </footer>
  );
}
