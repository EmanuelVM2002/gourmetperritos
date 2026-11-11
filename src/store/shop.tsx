"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { SedeId } from "@/config/site";
import { resolvePrice } from "@/lib/pricing";
import type { CategoryId, Product, SelectedOptions } from "@/types/menu";

export interface CartLine {
  key: string;
  productId: string;
  name: string;
  unitPrice: number;
  qty: number;
  options: SelectedOptions;
  image: string | null;
}

type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: CartLine }
  | { type: "qty"; key: string; delta: number }
  | { type: "remove"; key: string }
  | { type: "clear" };

const MAX_QTY = 50;

function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const existing = lines.find((line) => line.key === action.line.key);
      if (existing) {
        return lines.map((line) =>
          line.key === action.line.key
            ? { ...line, qty: Math.min(MAX_QTY, line.qty + action.line.qty) }
            : line,
        );
      }
      return [...lines, action.line];
    }
    case "qty":
      return lines
        .map((line) =>
          line.key === action.key
            ? { ...line, qty: Math.min(MAX_QTY, line.qty + action.delta) }
            : line,
        )
        .filter((line) => line.qty > 0);
    case "remove":
      return lines.filter((line) => line.key !== action.key);
    case "clear":
      return [];
  }
}

export type CategoryFilter = CategoryId | "todo";

interface ShopContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  addItem: (product: Product, options?: SelectedOptions, qty?: number) => void;
  changeQty: (key: string, delta: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;

  sedeId: SedeId | null;
  setSedeId: (id: SedeId | null) => void;

  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  detail: Product | null;
  openDetail: (product: Product) => void;
  closeDetail: () => void;

  activeCategory: CategoryFilter;
  setActiveCategory: (id: CategoryFilter) => void;
  goToCategory: (id: CategoryId) => void;

  toast: { id: number; message: string } | null;
  notify: (message: string) => void;

  scrollToId: (id: string) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

const CART_KEY = "pgu-cart-v1";
const SEDE_KEY = "pgu-sede-v1";

const lineKey = (productId: string, options: SelectedOptions) =>
  `${productId}|${Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => `${label}=${value}`)
    .join(";")}`;

export function ShopProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, []);
  const [hydrated, setHydrated] = useState(false);
  const [sedeId, setSedeIdState] = useState<SedeId | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [detail, setDetail] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("todo");
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recupera el pedido guardado en este navegador (si el almacenamiento está disponible).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", lines: parsed as CartLine[] });
      }
      const savedSede = localStorage.getItem(SEDE_KEY);
      if (savedSede === "uva" || savedSede === "sabaneta" || savedSede === "provenza") {
        setSedeIdState(savedSede);
      }
    } catch {
      /* sin almacenamiento: el carrito funciona igual, solo no se recuerda */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      /* ignorar */
    }
  }, [lines, hydrated]);

  const setSedeId = useCallback((id: SedeId | null) => {
    setSedeIdState(id);
    try {
      if (id) localStorage.setItem(SEDE_KEY, id);
      else localStorage.removeItem(SEDE_KEY);
    } catch {
      /* ignorar */
    }
  }, []);

  const notify = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const addItem = useCallback(
    (product: Product, options: SelectedOptions = {}, qty = 1) => {
      dispatch({
        type: "add",
        line: {
          key: lineKey(product.id, options),
          productId: product.id,
          name: product.name,
          unitPrice: resolvePrice(product, options),
          qty,
          options,
          image: product.image,
        },
      });
      notify(`${qty > 1 ? `${qty} × ` : ""}${product.name} agregado al pedido`);
    },
    [notify],
  );

  const scrollToId = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goToCategory = useCallback(
    (id: CategoryId) => {
      setActiveCategory(id);
      scrollToId("menu");
    },
    [scrollToId],
  );

  const value = useMemo<ShopContextValue>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      subtotal: lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0),
      addItem,
      changeQty: (key, delta) => dispatch({ type: "qty", key, delta }),
      removeLine: (key) => dispatch({ type: "remove", key }),
      clearCart: () => dispatch({ type: "clear" }),
      sedeId,
      setSedeId,
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      detail,
      openDetail: setDetail,
      closeDetail: () => setDetail(null),
      activeCategory,
      setActiveCategory,
      goToCategory,
      toast,
      notify,
      scrollToId,
    }),
    [lines, addItem, sedeId, setSedeId, cartOpen, detail, activeCategory, goToCategory, toast, notify, scrollToId],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop debe usarse dentro de <ShopProvider>");
  return context;
}
