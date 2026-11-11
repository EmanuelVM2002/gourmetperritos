import type { Sede } from "@/config/site";
import { formatCOP } from "@/lib/pricing";
import type { CartLine } from "@/store/shop";

interface OrderInput {
  lines: CartLine[];
  sede: Sede;
  name: string;
  notes: string;
}

export const cartTotal = (lines: CartLine[]) =>
  lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);

/** Mensaje de pedido, ordenado y listo para WhatsApp (usa *negritas* de WhatsApp). */
export function buildOrderMessage({ lines, sede, name, notes }: OrderInput): string {
  const items = lines.map((line) => {
    const extras = Object.entries(line.options)
      .map(([label, value]) => `${label}: ${value}`)
      .join("; ");
    const detail = extras ? ` (${extras})` : "";
    return `• ${line.qty} x ${line.name}${detail} — ${formatCOP(line.unitPrice * line.qty)}`;
  });

  const parts = [
    "Hola, Perritos Gourmet de la UVA. Quiero hacer este pedido:",
    "",
    `*Sede:* ${sede.name}`,
    name.trim() ? `*Nombre:* ${name.trim()}` : null,
    "",
    "*Mi pedido*",
    ...items,
    "",
    `*Total: ${formatCOP(cartTotal(lines))}*`,
    notes.trim() ? `\n*Notas:* ${notes.trim()}` : null,
    "",
    "Pedido enviado desde la página web.",
  ];

  return parts.filter((part): part is string => part !== null).join("\n");
}

/** Enlace wa.me. Sin número, WhatsApp deja elegir el contacto. */
export function buildWhatsappUrl(phone: string | null, message: string): string {
  const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}
