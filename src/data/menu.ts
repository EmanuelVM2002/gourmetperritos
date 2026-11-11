/**
 * Datos del menú — Carta 2026 de Perritos Gourmet de la UVA.
 *
 * Los nombres, ingredientes y precios salen de la carta oficial. Las fotos son
 * fotos reales del negocio (Instagram @gourmetperritos). Cuando una foto no es
 * del plato exacto se marca con `imageIsReference: true`; cuando no hay foto
 * de esa familia de platos, `image` es null y la tarjeta muestra la marca.
 *
 * Este archivo es la única fuente del menú. Para conectarlo a una base de datos
 * (Neon/PostgreSQL) basta con cambiar la implementación de
 * src/lib/menu-repository.ts: los componentes no leen este archivo directamente.
 */
import type { Category, Product, ProductOption } from "@/types/menu";

export const categories: Category[] = [
  {
    id: "sushi",
    name: "Sushi",
    description: "Los rollos de la casa",
    image: "/img/sushi-01.jpg",
    order: 1,
  },
  {
    id: "perritos",
    name: "Perritos gourmet",
    description: "Mini perritos desde $10.000",
    image: "/img/perrito-3.jpg",
    order: 2,
  },
  {
    id: "baos",
    name: "Baos",
    description: "Pan al vapor, relleno de la casa",
    image: "/img/bao-1.jpg",
    order: 3,
  },
  {
    id: "hamburguesas",
    name: "Hamburguesas",
    description: "Minis desde $12.000",
    image: "/img/burger-camaron.jpg",
    order: 4,
  },
  {
    id: "arroces",
    name: "Arroces",
    description: "Salteados al wok",
    image: "/img/arroz-tsumago.jpg",
    order: 5,
  },
  {
    id: "otros",
    name: "Otros antojos",
    description: "Entradas, ceviches, parrilla y postres",
    image: "/img/parrilla-1.jpg",
    order: 6,
  },
  {
    id: "bebidas",
    name: "Bebidas",
    description: "Sodas, limonadas y cervezas",
    image: "/img/bebida-2.jpg",
    order: 7,
  },
];

/* ------------------------------------------------------------------ */
/* Perritos y hamburguesas: se arman según la proteína (carta, p. 3-4) */
/* ------------------------------------------------------------------ */

interface Protein {
  id: string;
  name: string;
  /** Nota de la carta cuando la proteína cambia el topping crocante. */
  note?: string;
}

const proteins: Protein[] = [
  { id: "lomo-cerdo", name: "lomo de cerdo" },
  { id: "tocino-ahumado", name: "tocino ahumado" },
  { id: "bondiola", name: "bondiola de cerdo" },
  { id: "chorizo", name: "chorizo artesanal" },
  { id: "chicharron", name: "chicharrón crocante acevichado" },
  { id: "pollo", name: "pollo crocante" },
  { id: "palmito-apanado", name: "palmito de cangrejo apanado" },
  {
    id: "palmito-acevichado",
    name: "palmito de cangrejo acevichado",
    note: "Lleva yacón crocante caramelizado en vez de cebolla puerro.",
  },
  {
    id: "camaron-apanado",
    name: "camarón apanado",
    note: "Lleva coco crocante caramelizado en vez de cebolla puerro.",
  },
  { id: "camaron-acevichado", name: "camarón acevichado" },
  { id: "calamar-apanado", name: "calamar apanado" },
  { id: "ceviche-pescado", name: "ceviche de pescado blanco" },
  { id: "pescado-apanado", name: "pescado blanco apanado" },
  { id: "salmon-apanado", name: "salmón apanado" },
];

const burgerToppings = [
  "Guacamole de la casa",
  "Cebolla cruda",
  "Tomate",
  "Pepino dulce",
  "Lechuga",
  "Ensalada de repollo",
  "Queso mozzarella",
  "Tocineta",
  "Ripio de papa",
  "Cebolla puerro crocante caramelizada",
];

const perritoPhotos = ["/img/perrito-3.jpg", "/img/perrito-2.jpg", "/img/perrito-4.jpg"];
const burgerPhotos = ["/img/burger-2.jpg", "/img/burger-3.jpg"];

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const perritos: Product[] = proteins.map((protein, index) => {
  const isHouseFavorite = protein.id === "chicharron";
  return {
    id: `perrito-${protein.id}`,
    categoryId: "perritos",
    name: `Perrito de ${protein.name}`,
    description: `Mini perrito gourmet con ${protein.name}. Los toppings y las salsas los elige la casa según la proteína.`,
    ingredients: [capitalize(protein.name), "Toppings de la casa", "Salsas de la casa"],
    price: 10000,
    image: isHouseFavorite ? "/img/perrito-chicharron.jpg" : perritoPhotos[index % perritoPhotos.length],
    imageIsReference: !isHouseFavorite,
    badge: isHouseFavorite ? "Preferido de la casa" : undefined,
    available: true,
  };
});

const hamburguesas: Product[] = proteins.map((protein, index) => {
  const isHouseFavorite = protein.id === "camaron-apanado";
  return {
    id: `hamburguesa-${protein.id}`,
    categoryId: "hamburguesas",
    name: `Hamburguesa de ${protein.name}`,
    description: `Mini hamburguesa con ${protein.name}, todos los toppings de la casa y la salsa recomendada para la proteína. ${protein.note ?? ""}`.trim(),
    ingredients: [capitalize(protein.name), ...burgerToppings],
    price: 12000,
    image: isHouseFavorite ? "/img/burger-camaron.jpg" : burgerPhotos[index % burgerPhotos.length],
    imageIsReference: !isHouseFavorite,
    badge: isHouseFavorite ? "Preferida de la casa" : undefined,
    available: true,
  };
});

/* ------------------------------ Sushi ------------------------------ */

interface Roll {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
}

const rolls: Roll[] = [
  {
    id: "acevichado",
    name: "Acevichado",
    description: "Camarón apanado enrollado con caviar y bañado en salsa acevichada de tilapia y mango.",
    ingredients: ["Queso crema", "Aguacate", "Camarón apanado", "Caviar", "Salsa acevichada de tilapia y mango", "Quinoa crocante", "Pasta japonesa crocante"],
  },
  {
    id: "apanado",
    name: "Apanado",
    description: "Rollo apanado de salmón y palmito, con salsas pique, teriyaki y blanca de la casa.",
    ingredients: ["Queso crema", "Aguacate", "Salmón", "Palmito importado", "Salsa pique, teriyaki y blanca", "Palmito aderezado", "Cebolla puerro crocante caramelizada"],
  },
  {
    id: "calamar-acevichado",
    name: "Calamar acevichado",
    description: "Salmón y palmito bañados en chile-spacy y acevichada, coronados con calamares apanados.",
    ingredients: ["Queso crema", "Aguacate", "Salmón", "Palmito importado", "Salsa chile-spacy y acevichada", "Calamares apanados", "Soya crocante caramelizada", "Queso granapadano", "Explosiones de lychee", "Ajonjolí negro"],
  },
  {
    id: "california",
    name: "California",
    description: "El clásico: camarón precocido y palmito, enrollado con caviar y ajonjolí negro.",
    ingredients: ["Queso crema", "Aguacate", "Palmito importado", "Camarón precocido", "Caviar", "Ajonjolí negro", "Masago de arroz"],
  },
  {
    id: "camaron-spacy",
    name: "Camarón spacy",
    description: "Salmón y palmito con salsa chile-spacy, coronado con camarón apanado en miel rocoto.",
    ingredients: ["Queso crema", "Aguacate", "Salmón", "Palmito aderezado", "Salsa chile-spacy", "Camarón apanado", "Miel rocoto", "Ajonjolí negro"],
  },
  {
    id: "carrot-crispy",
    name: "Carrot crispy",
    description: "Palmito apanado encostrado en parmesano y zanahoria crocante caramelizada.",
    ingredients: ["Queso crema", "Aguacate", "Salmón", "Palmito aderezado", "Palmito apanado con queso parmesano", "Chile-spacy y teriyaki", "Zanahoria crocante caramelizada"],
  },
  {
    id: "coco-roll",
    name: "Coco roll",
    description: "En hoja de soya, con langostino apanado encostrado en parmesano y coco crocante.",
    ingredients: ["Hoja de soya", "Queso crema", "Aguacate", "Langostino apanado con queso parmesano", "Salsa pique y chile-spacy", "Palmito aderezado", "Coco crocante caramelizado"],
  },
  {
    id: "dinamita",
    name: "Dinamita",
    description: "Camarón apanado por dentro, aguacate y pasta japonesa por fuera, bañado en miel rocoto.",
    ingredients: ["Queso crema", "Camarón apanado", "Aguacate", "Palmito aderezado", "Pasta japonesa crocante", "Miel rocoto"],
  },
  {
    id: "dragon-roll",
    name: "Dragón roll",
    description: "Langostino apanado, teriyaki y chile-spacy, coronado con caviar y anguila flameada.",
    ingredients: ["Queso crema", "Aguacate", "Langostino apanado con queso parmesano", "Teriyaki y chile-spacy", "Palmito aderezado", "Caviar", "Anguila flameada"],
  },
  {
    id: "mystical",
    name: "Mystical",
    description: "Rollo tempura con tilapia y maduro, bañado en salsa acevichada de salmón y palmito.",
    ingredients: ["Queso crema", "Aguacate", "Maduro", "Tilapia", "Palmito apanado", "Salsa acevichada de salmón y palmito", "Soya crocante caramelizada"],
  },
  {
    id: "philadelphia",
    name: "Philadelphia",
    description: "Salmón, queso crema y aguacate enrollados en ajonjolí negro, con caviar.",
    ingredients: ["Queso crema", "Aguacate", "Salmón", "Ajonjolí negro", "Caviar", "Masago de arroz"],
  },
  {
    id: "prendido",
    name: "Prendido",
    description: "Palmito aderezado por dentro, camarón apanado y salsas de la casa por fuera.",
    ingredients: ["Queso crema", "Aguacate", "Palmito aderezado", "Camarón apanado", "Salsas de la casa", "Coco crocante caramelizado", "Masago de arroz"],
  },
  {
    id: "primavera",
    name: "Primavera (8 bocados)",
    description: "En hoja de arroz, con palmito aderezado y salsa chile-spacy y teriyaki.",
    ingredients: ["Hoja de arroz", "Queso crema", "Aguacate", "Palmito aderezado", "Chile-spacy y teriyaki", "Ajonjolí negro"],
  },
  {
    id: "pulpo",
    name: "Pulpo",
    description: "Palmito apanado por dentro y pulpo acevichado en salsa de la casa por encima.",
    ingredients: ["Queso crema", "Aguacate", "Palmito apanado", "Pulpo acevichado", "Queso granapadano", "Cebolla puerro crocante caramelizada"],
  },
  {
    id: "pulpo-crunch",
    name: "Pulpo crunch",
    description: "Salmón enrollado en quinua crocante, coronado con pulpo apanado y caviar.",
    ingredients: ["Queso crema", "Aguacate", "Salmón", "Quinua crocante", "Pulpo apanado", "Caviar", "Miel rocoto"],
  },
  {
    id: "tataki-atun",
    name: "Tataki de atún",
    description: "Salmón en quinua crocante, teriyaki y tataki de atún con explosiones de lychee.",
    ingredients: ["Queso crema", "Aguacate", "Salmón", "Quinua crocante", "Teriyaki", "Tataki de atún", "Caviar", "Explosiones de lychee", "Miel de rocoto"],
  },
  {
    id: "tempura",
    name: "Tempura",
    description: "Rollo tempura bocado por bocado, con salsa blanca y teriyaki de la casa.",
    ingredients: ["Queso crema", "Aguacate", "Salmón", "Palmito importado", "Salsa blanca y teriyaki", "Palmito aderezado", "Ajonjolí negro"],
  },
  {
    id: "unagui",
    name: "Unagui roll",
    description: "Salmón enrollado en ajonjolí negro, bañado en teriyaki con anguila flameada.",
    ingredients: ["Queso crema", "Aguacate", "Salmón", "Ajonjolí negro", "Teriyaki", "Anguila flameada", "Masago de arroz"],
  },
];

const sushiPhotos = [
  "/img/sushi-02.jpg",
  "/img/sushi-03.jpg",
  "/img/sushi-04.jpg",
  "/img/sushi-05.jpg",
  "/img/sushi-06.jpg",
  "/img/sushi-07.jpg",
  "/img/sushi-08.jpg",
  "/img/sushi-09.jpg",
  "/img/sushi-10.jpg",
  "/img/sushi-11.jpg",
  "/img/sushi-12.jpg",
];

const sushi: Product[] = rolls.map((roll, index) => {
  const exact = roll.id === "pulpo-crunch";
  return {
    id: `sushi-${roll.id}`,
    categoryId: "sushi",
    name: roll.name,
    description: roll.description,
    ingredients: roll.ingredients,
    price: 39500,
    image: exact ? "/img/sushi-01.jpg" : sushiPhotos[index % sushiPhotos.length],
    imageIsReference: !exact,
    available: true,
  };
});

/* ------------------------------- Baos ------------------------------- */

const baoBase = ["Queso crema", "Pepino dulce", "Repollo morado", "Cebolla dulce", "Aguacate"];
const baoPhotos = ["/img/bao-1.jpg", "/img/bao-2.jpg", "/img/bao-3.jpg", "/img/bao-4.jpg"];

const baoRows: Array<{ id: string; name: string; description: string; ingredients: string[] }> = [
  {
    id: "chicharron",
    name: "Bao de chicharrón crocante",
    description: "Chicharrón crocante sobre queso crema y cebolla dulce, con pique y teriyaki.",
    ingredients: ["Chicharrón crocante", "Queso crema", "Cebolla dulce", "Salsa pique y teriyaki", "Coco crocante caramelizado", "Brotes"],
  },
  {
    id: "lomo",
    name: "Bao de lomo de cerdo salteado",
    description: "Lomo de cerdo salteado con acevichada y teriyaki, coronado con quinua y maní.",
    ingredients: ["Lomo de cerdo salteado", ...baoBase, "Salsa acevichada y teriyaki", "Quinua crocante caramelizada", "Maní", "Brotes"],
  },
  {
    id: "salmon",
    name: "Bao de salmón salteado",
    description: "Salmón salteado con salsa de chile y teriyaki, coronado con puerro crocante.",
    ingredients: ["Salmón salteado", ...baoBase, "Salsa de chile y teriyaki", "Cebolla puerro crocante caramelizada", "Brotes"],
  },
  {
    id: "atun",
    name: "Bao de atún salteado",
    description: "Atún salteado con pique y teriyaki, quinua crocante y caviar blanco.",
    ingredients: ["Atún salteado", ...baoBase, "Salsa de pique y teriyaki", "Quinua crocante", "Caviar blanco", "Brotes"],
  },
  {
    id: "palmito-apanado",
    name: "Bao de palmito apanado",
    description: "Palmito apanado con teriyaki y miel rocoto, coronado con pasta japonesa crocante.",
    ingredients: ["Palmito apanado", ...baoBase, "Teriyaki y miel rocoto", "Pasta japonesa crocante", "Brotes"],
  },
  {
    id: "palmito-acevichado",
    name: "Bao de palmito acevichado",
    description: "Palmito acevichado con salsa dinamita, yacón crocante y ajonjolí negro.",
    ingredients: ["Palmito acevichado", "Aguacate", "Pepino dulce", "Repollo morado", "Cebolla dulce", "Salsa dinamita", "Yacón crocante caramelizado", "Ajonjolí negro", "Brotes"],
  },
  {
    id: "camaron",
    name: "Bao de camarón apanado",
    description: "Camarón apanado con chile-miel y miel rocoto, coronado con coco crocante.",
    ingredients: ["Camarón apanado", ...baoBase, "Chile-miel y miel rocoto", "Coco crocante caramelizado", "Brotes"],
  },
];

const baos: Product[] = baoRows.map((bao, index) => ({
  id: `bao-${bao.id}`,
  categoryId: "baos",
  name: bao.name,
  description: bao.description,
  ingredients: bao.ingredients,
  price: 25000,
  image: baoPhotos[index % baoPhotos.length],
  imageIsReference: true,
  available: true,
}));

/* ------------------------------ Arroces ------------------------------ */

const riceBase = ["Cebolla morada", "Cilantro", "Puerro", "Maíz tierno"];

const arroces: Product[] = [
  {
    id: "arroz-hokado",
    name: "Hokado",
    description: "Pollo crocante salteado con vegetales, teriyaki y soya de la casa.",
    ingredients: ["Pollo crocante", ...riceBase, "Zanahoria", "Champiñones", "Zukini", "Calabacín", "Salsa teriyaki y soya", "Pasta crocante"],
  },
  {
    id: "arroz-tsumago",
    name: "Tsumago",
    description: "Pollo salteado y costillas BBQ sobre arroz con vegetales, teriyaki y soya.",
    ingredients: ["Pollo salteado", "Costillas BBQ", ...riceBase, "Zanahoria", "Champiñones", "Zukini", "Calabacín", "Salsa teriyaki y soya", "Cebolla puerro crocante caramelizada"],
  },
  {
    id: "arroz-fulli",
    name: "Fulli",
    description: "Solomito parrillado y calamar apanado bañados en tres quesos y crema de coco.",
    ingredients: ["Solomito parrillado", "Calamar apanado", ...riceBase, "Champiñones", "Tres quesos", "Crema de coco", "Salsa chile-miel", "Pasta japonesa crocante"],
  },
  {
    id: "arroz-noto",
    name: "Noto",
    description: "Camarones y tilapia apanada en tres quesos y crema de coco, con cebolla acevichada.",
    ingredients: ["Camarones precocidos", "Tilapia apanada", ...riceBase, "Champiñones", "Tres quesos", "Crema de coco", "Cebolla acevichada", "Pasta japonesa crocante"],
  },
  {
    id: "arroz-mariscos",
    name: "Mariscos",
    description: "Calamar, camarón, salmón y pulpo reducidos en salsa de coco, con teriyaki y soya.",
    ingredients: ["Calamar", "Camarón precocido", "Salmón", "Pulpo", "Salsa de coco", "Zukini", "Calabacín", "Cebolla morada", "Puerro", "Cilantro", "Teriyaki y soya"],
  },
].map((rice) => {
  const exact = rice.id === "arroz-tsumago";
  return {
    ...rice,
    categoryId: "arroces" as const,
    price: 37000,
    image: "/img/arroz-tsumago.jpg",
    imageIsReference: !exact,
    available: true,
  };
});

/* --------------------- Otros antojos: entradas, ceviches, parrilla, postres --------------------- */

const entradas: Product[] = [
  {
    id: "entrada-palmito-apanado",
    name: "Palmito apanado",
    description: "Palmito apanado en parmesano con relleno de queso crema, salsa blanca y teriyaki.",
    ingredients: ["Palmito apanado en queso parmesano", "Relleno de queso crema", "Salsa blanca de la casa", "Teriyaki", "Puerro crocante caramelizado"],
  },
  {
    id: "entrada-palmito-acevichado",
    name: "Palmito acevichado",
    description: "Palmito importado desmechado en salsa acevichada, con mango en juliana y limón.",
    ingredients: ["Palmito importado desmechado", "Salsa acevichada de la casa", "Mango en juliana", "Limón natural", "Sal", "Salsa picante de la casa"],
  },
  {
    id: "entrada-calamar-apanado",
    name: "Calamar apanado",
    description: "Calamar apanado en parmesano con salsas blanca, de chile y teriyaki.",
    ingredients: ["Calamar apanado en queso parmesano", "Salsa blanca, de chile y teriyaki", "Pasta japonesa crocante", "Puerro crocante caramelizado"],
  },
].map((item) => ({
  ...item,
  categoryId: "otros" as const,
  kind: "Entrada",
  price: 23000,
  image: null,
  available: true,
}));

const ceviches: Product[] = [
  {
    id: "ceviche-kansai",
    name: "Ceviche Kansai",
    description: "Calamar, tilapia, salmón y camarón tempura en mezcla acevichada con cuatro salsas.",
    ingredients: ["Calamar", "Tilapia", "Salmón", "Camarón tempura", "Cebolla morada", "Mango", "Limón", "Aceite de ajonjolí", "Salsa de chile, pique, acevichada y miel rocoto", "Soya crocante"],
    price: 36000,
    image: "/img/ceviche-kansai.jpg",
    imageIsReference: false,
  },
  {
    id: "ceviche-yokohama",
    name: "Ceviche Yokohama",
    description: "Calamar, tilapia y camarón precocidos con mango, en salsa acevichada de la casa.",
    ingredients: ["Calamar", "Tilapia", "Camarón precocido", "Cebolla morada", "Mango", "Limón", "Salsa acevichada", "Tocineta", "Chips de plátano verde"],
    price: 36000,
    image: "/img/ceviche-kansai.jpg",
    imageIsReference: true,
  },
  {
    id: "ceviche-tokio",
    name: "Ceviche Tokio",
    description: "Camarón precocido con cebolla morada, aguacate y cilantro, con salsa roja y pique.",
    ingredients: ["Camarón precocido", "Cebolla morada", "Aguacate", "Cilantro", "Salsa roja y pique de la casa", "Pasta japonesa crocante", "Chips de plátano verde"],
    price: 36000,
    image: "/img/ceviche-kansai.jpg",
    imageIsReference: true,
  },
  {
    id: "ceviche-fukuoka",
    name: "Ceviche Fukuoka",
    description: "Chicharrón crocante con mango, aguacate y maíz tierno, en pique y acevichada.",
    ingredients: ["Chicharrón crocante", "Cebolla morada", "Mango", "Aguacate", "Maíz tierno", "Cilantro", "Tomate cherry", "Salsa pique y acevichada", "Ajonjolí negro", "Pasta japonesa crocante"],
    price: 34000,
    image: "/img/ceviche-kansai.jpg",
    imageIsReference: true,
  },
].map((item) => ({ ...item, categoryId: "otros" as const, kind: "Ceviche", available: true }));

const grillProtein: ProductOption = {
  label: "Proteína (200 g)",
  choices: [
    { name: "Salmón parrillado" },
    { name: "Atún parrillado" },
    { name: "Solomito parrillado" },
    { name: "Costillas BBQ parrilladas (4 piezas)" },
  ],
};

const grillSide: ProductOption = {
  label: "Guarnición",
  choices: [
    { name: "Arroz yakimeshi" },
    { name: "Vegetales salteados" },
    { name: "Pastas 3 quesos" },
    { name: "Papa americana" },
    { name: "Papa criolla" },
  ],
};

const parrilla: Product = {
  id: "parrilla",
  categoryId: "otros",
  kind: "Parrilla",
  name: "Parrilla",
  description: "Tu proteína de 200 g a la parrilla con la guarnición que prefieras.",
  ingredients: ["Proteína parrillada de 200 g", "Guarnición a elección"],
  price: 46000,
  image: "/img/parrilla-1.jpg",
  imageIsReference: true,
  options: [grillProtein, grillSide],
  available: true,
};

const postres: Product[] = [
  {
    id: "postre-oreo-frito",
    name: "Oreo frito",
    description: "Cuatro galletas Oreo apanadas con una bola de helado y arequipe.",
    ingredients: ["4 galletas Oreo apanadas", "Bola de helado", "Arequipe"],
    price: 16000,
    image: null,
  },
  {
    id: "postre-brownie",
    name: "Brownie",
    description: "Brownie de chocolate con una bola de helado, coronado con arequipe.",
    ingredients: ["Brownie de chocolate", "Bola de helado", "Arequipe"],
    price: 13000,
    image: "/img/postre-brownie.jpg",
    imageIsReference: true,
  },
  {
    id: "postre-arepa-queso",
    name: "Arepa de queso",
    description: "Arepa de queso acompañada de arequipe, lecherita y queso philadelphia.",
    ingredients: ["Arepa de queso", "Arequipe", "Lecherita", "Queso philadelphia"],
    price: 12000,
    image: null,
  },
].map((item) => ({ ...item, categoryId: "otros" as const, kind: "Postre", available: true }));

/* ------------------------------ Bebidas ------------------------------ */

const flavors = (names: string[]) => names.map((name) => ({ name }));

const bebidas: Product[] = [
  {
    id: "bebida-soda-saborizada",
    name: "Soda saborizada",
    description: "Soda con el sabor que elijas.",
    ingredients: ["Soda", "Sabor a elección"],
    price: 12000,
    image: "/img/bebida-1.jpg",
    imageIsReference: true,
    options: [{ label: "Sabor", choices: flavors(["Natural", "Coco", "Cereza", "Lychee", "Mango", "Fresa", "Sandía", "Hierbabuena"]) }],
  },
  {
    id: "bebida-limonada-natural",
    name: "Limonada natural",
    description: "Limonada natural en combinaciones de fruta.",
    ingredients: ["Limón natural", "Sabor a elección"],
    price: 12000,
    image: "/img/bebida-2.jpg",
    imageIsReference: true,
    options: [{ label: "Sabor", choices: flavors(["Sandía-Lychee", "Sandía-Cereza", "Frutos rojos", "Frutos amarillos", "Mango michelado", "Tamarindo michelado"]) }],
  },
  { id: "bebida-agua-hatsu", name: "Agua Hatsu", description: "Agua Hatsu.", ingredients: ["Agua Hatsu"], price: 6000, image: null },
  {
    id: "bebida-te-hatsu",
    name: "Té Hatsu",
    description: "Té Hatsu en dos versiones.",
    ingredients: ["Té Hatsu"],
    price: 9500,
    image: null,
    options: [{ label: "Versión", choices: flavors(["Amarillo", "Blanco"]) }],
  },
  { id: "bebida-manzana", name: "Manzana (400 ml)", description: "Gaseosa de manzana de 400 ml.", ingredients: ["Manzana 400 ml"], price: 6500, image: null },
  { id: "bebida-pepsi", name: "Pepsi", description: "Gaseosa Pepsi.", ingredients: ["Pepsi"], price: 6500, image: null },
  { id: "bebida-soda-limon", name: "Soda con limón", description: "Soda con limón.", ingredients: ["Soda", "Limón"], price: 8000, image: null },
  { id: "bebida-soda-michelada", name: "Soda michelada", description: "Soda michelada.", ingredients: ["Soda", "Michelada"], price: 9000, image: null },
  { id: "bebida-bretana", name: "Bretaña", description: "Bretaña.", ingredients: ["Bretaña"], price: 6000, image: null },
  {
    id: "bebida-cerveza",
    name: "Cerveza",
    description: "Cerveza fría. Elige tu marca.",
    ingredients: ["Cerveza"],
    price: 9000,
    image: null,
    options: [
      {
        label: "Marca",
        choices: [
          { name: "3 Cordilleras", price: 10000 },
          { name: "Corona", price: 10000 },
          { name: "Coronita", price: 9000 },
          { name: "Heineken", price: 10000 },
          { name: "Club Colombia", price: 10000 },
          { name: "Sol", price: 10000 },
          { name: "Águila", price: 10000 },
          { name: "Águila light", price: 10000 },
          { name: "Pilsen", price: 10000 },
        ],
      },
    ],
  },
].map((item) => ({ ...item, categoryId: "bebidas" as const, available: true }));

export const products: Product[] = [
  ...sushi,
  ...perritos,
  ...baos,
  ...hamburguesas,
  ...arroces,
  ...entradas,
  ...ceviches,
  parrilla,
  ...postres,
  ...bebidas,
];
