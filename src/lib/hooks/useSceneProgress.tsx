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
  /** Registers a scene's element under a label; returns a function that unregisters it. */
  registerScene: (el: HTMLElement | null, label: string) => () => void;
}

const SceneProgressContext = createContext<SceneProgressContextValue | null>(null);

const INITIAL_LABEL = "Scene 01 — The Idea";
const FALLBACK_HEADER_HEIGHT = 58;

export function SceneProgressProvider({ children }: { children: ReactNode }) {
  const [activeLabel, setActiveLabel] = useState(INITIAL_LABEL);
  const [progress, setProgress] = useState(0);
  const scenes = useRef<Map<HTMLElement, string>>(new Map());

  const registerScene = useCallback((el: HTMLElement | null, label: string) => {
    if (!el) return () => {};
    scenes.current.set(el, label);
    return () => {
      scenes.current.delete(el);
    };
  }, []);

  useEffect(() => {
    /**
     * The label names whichever scene has most recently passed under the header — the last one, in
     * document order, whose top edge is at or above the header's bottom edge (the design's own rule).
     * It is recomputed from scratch on every scroll and resize, so it never depends on which scenes
     * happened to change state — an IntersectionObserver only reports changes, and on short screens
     * two neighbouring scenes can share the trigger band, leaving the label stale or skipping a scene.
     */
    const activeSceneLabel = () => {
      const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hdr")) || FALLBACK_HEADER_HEIGHT;
      const inOrder = Array.from(scenes.current.entries()).sort(([a], [b]) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      );
      let name = INITIAL_LABEL;
      for (const [el, label] of inOrder) {
        if (el.getBoundingClientRect().top <= offset + 1) name = label;
      }
      // A final scene shorter than the viewport can never reach the header, so at the very bottom
      // of the page the last scene is the active one.
      const doc = document.documentElement;
      if (inOrder.length > 0 && window.scrollY >= doc.scrollHeight - doc.clientHeight - 2) {
        name = inOrder[inOrder.length - 1][1];
      }
      return name;
    };

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      const label = activeSceneLabel();
      setActiveLabel(label);
      // Published for non-React readers (useLenis decides per scene whether to smooth-scroll).
      const sceneNumber = /Scene (\d+)/.exec(label)?.[1];
      if (sceneNumber) doc.dataset.scene = sceneNumber;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Fonts and images can move scene tops without a scroll or resize.
    window.addEventListener("load", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("load", update);
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
  useEffect(() => registerScene(ref.current, label), [registerScene, ref, label]);
}
