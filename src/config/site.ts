/**
 * Configuración del sitio.
 *
 * Los números de WhatsApp se pueden sobrescribir con variables de entorno
 * (ver .env.example) sin tocar el código. Formato: solo dígitos con indicativo
 * de país, por ejemplo 573001234567.
 *
 * Origen de los valores por defecto: textos de las publicaciones de Instagram
 * @gourmetperritos y la carta 2026. Confírmalos antes de publicar.
 */

export type SedeId = "uva" | "sabaneta" | "provenza";

export interface Sede {
  id: SedeId;
  name: string;
  /** Nombre corto para chips y mensajes. */
  short: string;
  subtitle?: string;
  /** null = dato pendiente por confirmar. */
  address: string | null;
  /** null = dato pendiente por confirmar. */
  hours: string | null;
  /** WhatsApp de la sede (solo dígitos). null = pendiente. */
  whatsapp: string | null;
  /** Consulta que se envía a Google Maps. */
  mapsQuery: string;
  /** Foto real de la sede, o null si todavía no hay. */
  image: string | null;
}

const env = (value: string | undefined, fallback: string | null) =>
  value && value.trim() !== "" ? value.replace(/\D/g, "") : fallback;

export const siteConfig = {
  name: "Perritos Gourmet de la UVA",
  tagline: "Mucho más que perritos",
  instagram: {
    handle: "@gourmetperritos",
    url: "https://www.instagram.com/gourmetperritos/",
  },
  /** Línea general: la que aparece en la carta 2026. */
  whatsappGeneral: env(process.env.NEXT_PUBLIC_WHATSAPP_GENERAL, "573007919582"),
  sedes: [
    {
      id: "uva",
      name: "UVA de El Poblado",
      short: "UVA El Poblado",
      address: "Cra 29A # 3B Sur - 40",
      hours: null,
      whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_UVA, "573007919582"),
      mapsQuery: "Perritos Gourmet de la UVA, Cra 29A #3B Sur 40, Medellín",
      image: "/img/sede-uva.jpg",
    },
    {
      id: "sabaneta",
      name: "Sabaneta",
      short: "Sabaneta",
      address:
        "Calle 67 Sur # 44-36, frente al parqueadero público del barrio Santa Ana",
      hours: null,
      whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_SABANETA, "573013559762"),
      mapsQuery: "Perritos Gourmet, Calle 67 Sur 44-36, Sabaneta, Antioquia",
      image: null,
    },
    {
      id: "provenza",
      name: "Provenza",
      short: "Provenza",
      subtitle: "El Coctelazo by Perritos Gourmet",
      address: null,
      hours: null,
      whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_PROVENZA, null),
      mapsQuery: "El Coctelazo by Perritos Gourmet de la UVA, Provenza, Medellín",
      image: "/img/sede-provenza.jpg",
    },
  ] satisfies Sede[],
};

export const getSede = (id: SedeId) =>
  siteConfig.sedes.find((sede) => sede.id === id);

export const mapsUrl = (sede: Sede) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sede.mapsQuery)}`;

/** Formatea 573007919582 como +57 300 791 9582. */
export const formatPhone = (digits: string) =>
  digits.startsWith("57") && digits.length === 12
    ? `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
    : `+${digits}`;
