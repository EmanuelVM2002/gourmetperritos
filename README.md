# Perritos Gourmet de la UVA — sitio web

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide.

## Cómo correrlo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # versión de producción
npm run typecheck
```

## Qué hay (y de dónde sale)

| Cosa | Fuente |
|---|---|
| Menú, ingredientes y precios | Carta 2026 (PDF de Heyzine). Solo se resumieron las descripciones. |
| Fotos (`public/img`) | Fotos reales del Instagram @gourmetperritos. **No hay fotos de stock.** |
| WhatsApp UVA 300 791 9582 y Sabaneta 301 355 9762 | Textos de publicaciones de Instagram (la carta trae el 300 791 9582). |
| Dirección UVA (Cra 29A # 3B Sur - 40) y Sabaneta (Calle 67 Sur # 44-36) | Textos de publicaciones de Instagram. |
| Logo | `public/logo.png`, sin modificar. Se funde con el fondo con `mix-blend-lighten`. |

### Pendiente de confirmar (`src/config/site.ts`)

- Horarios de las tres sedes.
- Dirección y WhatsApp de **Provenza**. Mientras no exista el número, el pedido abre WhatsApp sin destinatario.
- Confirmar que la dirección de Sabaneta vigente es la 44-36 (una publicación anterior decía 44-22).
- Los números se pueden cambiar sin tocar código con variables de entorno: ver `.env.example`.

### Fotos

- «Foto de referencia»: es un plato de la misma familia, no el plato exacto (ej. otro rollo de sushi). Se marca en la tarjeta.
- Sin foto de esa familia (entradas, la mayoría de bebidas, algunos postres), la tarjeta muestra el logo en vez de una imagen inventada.
- Para poner una foto real: guardarla en `public/img` y cambiar `image` (y quitar `imageIsReference`) en `src/data/menu.ts`.

## Arquitectura

```
src/
  app/            layout, página y estilos globales
  components/     una pieza por archivo (hero, categorías, menú, carrito, sedes...)
  config/site.ts  sedes, WhatsApp, redes
  data/menu.ts    categorías y productos (fuente única del menú)
  lib/            repositorio del menú, precios, mensaje de WhatsApp, hooks
  store/shop.tsx  carrito, sede elegida y estado de la interfaz
```

### Conectar Neon/PostgreSQL

Los componentes **no** leen `data/menu.ts`: piden el menú a `getMenu()` en `src/lib/menu-repository.ts`.
Para pasar a base de datos solo hay que reemplazar el cuerpo de esa función por dos consultas
(`categories`, `products`) que devuelvan los tipos de `src/types/menu.ts`. Un panel de administración
escribiría en esas mismas tablas. Los productos con opciones (proteína, sabor, marca de cerveza) están
modelados con `options`, y una opción puede cambiar el precio (`price`).

## Notas

- El carrito y la sede elegida se guardan en el navegador (`localStorage`).
- El pedido se envía por WhatsApp con un mensaje ordenado (sede, nombre, productos, cantidades, total, notas).
- Animaciones respetan `prefers-reduced-motion`.
- Las pizzas de masa madre que aparecen en Instagram no están en la carta 2026 ni tienen precio, por eso no se incluyeron.
