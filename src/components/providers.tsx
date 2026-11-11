"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ShopProvider } from "@/store/shop";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ShopProvider>{children}</ShopProvider>
    </MotionConfig>
  );
}
