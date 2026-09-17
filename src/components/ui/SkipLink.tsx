/**
 * Bypasses the scroll-driven narrative for keyboard/screen-reader users.
 * Target moves to the real #work-index once Scene 04 (The Work) exists;
 * until then it lands on the end of the built narrative.
 */
export function SkipLink() {
  return (
    <a
      href="#work-index"
      className="absolute left-[-9999px] top-0 z-40 rounded-(--radius-panel) border-0 bg-ink-900 px-4 py-2.5 text-cream-100 text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)] focus-visible:left-(--gutter) focus-visible:top-(--space-3)"
    >
      Skip the scroll story
    </a>
  );
}
