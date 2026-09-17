"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface SceneProgressContextValue {
  activeLabel: string;
  progress: number; // 0–100
  registerScene: (el: HTMLElement | null, label: string) => void;
}

const SceneProgressContext = createContext<SceneProgressContextValue | null>(null);

const INITIAL_LABEL = "Scene 01 — The Idea";

export function SceneProgressProvider({ children }: { children: ReactNode }) {
  const [activeLabel, setActiveLabel] = useState(INITIAL_LABEL);
  const [progress, setProgress] = useState(0);
  const scenes = useRef<Map<HTMLElement, string>>(new Map());
  const observer = useRef<IntersectionObserver | null>(null);

  const registerScene = useCallback((el: HTMLElement | null, label: string) => {
    if (!el) return;
    scenes.current.set(el, label);
    observer.current?.observe(el);
  }, []);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const label = scenes.current.get(visible[0].target as HTMLElement);
          if (label) setActiveLabel(label);
        }
      },
      { rootMargin: "-1px 0px -85% 0px", threshold: 0 }
    );
    scenes.current.forEach((_, el) => observer.current?.observe(el));
    return () => observer.current?.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <SceneProgressContext.Provider value={{ activeLabel, progress, registerScene }}>
      {children}
    </SceneProgressContext.Provider>
  );
}

export function useSceneProgress() {
  const ctx = useContext(SceneProgressContext);
  if (!ctx) throw new Error("useSceneProgress must be used within SceneProgressProvider");
  return ctx;
}

/** Call from a scene component to register its section for header label tracking. */
export function useRegisterScene(ref: React.RefObject<HTMLElement | null>, label: string) {
  const { registerScene } = useSceneProgress();
  useEffect(() => {
    registerScene(ref.current, label);
  }, [registerScene, ref, label]);
}
