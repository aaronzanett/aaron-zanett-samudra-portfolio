"use client";

import type { ReactNode } from "react";
import { useLenis } from "@/lib/hooks/useLenis";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  useLenis(reducedMotion);
  return <>{children}</>;
}
