import type { ElementType, ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  as?: ElementType;
  muted?: boolean;
  className?: string;
}

/** The site's micro-label — 11px, 700 weight, wide tracking, uppercase. Used for every eyebrow/kicker/meta string. */
export function Label({ children, as: Tag = "span", muted = false, className = "" }: LabelProps) {
  return (
    <Tag
      className={`text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)] ${
        muted ? "text-(--text-muted)" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
