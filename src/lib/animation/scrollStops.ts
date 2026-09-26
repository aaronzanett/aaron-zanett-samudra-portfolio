/**
 * Scroll stop points for smooth scrolling. A scene with tightly spaced slides registers a function
 * that returns the document Y positions where a single scroll gesture should come to rest (see
 * useLenis, which clamps a glide so it can travel at most to the next stop). Positions are read on
 * demand, so they follow the layout through resizes and font loads.
 */

type StopsProvider = () => number[];

const providers = new Set<StopsProvider>();

/** Registers a scene's stop positions; returns the cleanup that unregisters them. */
export function registerScrollStops(provider: StopsProvider): () => void {
  providers.add(provider);
  return () => {
    providers.delete(provider);
  };
}

/** Every registered stop, ascending, as document Y positions in px. */
export function getScrollStops(): number[] {
  const stops: number[] = [];
  providers.forEach((provider) => stops.push(...provider()));
  return stops.filter(Number.isFinite).sort((a, b) => a - b);
}
