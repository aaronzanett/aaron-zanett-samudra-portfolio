"use client";

/*
 * Scenes 03 (The Process) and 04 (The Work) — ported from `Scene 03 Process.dc.html`.
 *
 * The design drives both scenes from ONE component on a single tall track: the
 * first half is the process diagram (a camera flying across a 2700x2100 world),
 * the second half is the work showcase, and the process's held product frame
 * hands off into the first project. Logic, constants and math below are the
 * design's, unchanged; only the template syntax (sc-for / sc-if / x-import)
 * became JSX, and the design-system Label is inlined with its exact styles.
 *
 * Deviations from the source, both deliberate:
 *  - project screenshots load from /projects/<key>/<n>.png (the design's
 *    uploads/assets/ files, copied into public/);
 *  - under prefers-reduced-motion the time-based clocks (intro fade, typing,
 *    shot cross-fade, hold/"more" fades) snap to their end state instead of
 *    running. Scroll still drives the camera, and no content is gated.
 */

import React, { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import { registerScrollStops } from "@/lib/animation/scrollStops";
import { useRegisterScene } from "@/lib/hooks/useSceneProgress";

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const S = (t: number) => {
  t = clamp01(t);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

interface RowConfig {
  y: number;
  accent: string;
  a: number;
  b: number;
  mode: "plain" | "chaos" | "zero";
  steps: string[];
}

const ROWS: RowConfig[] = [
  { y: 300, accent: "var(--cream-100)", a: 0.06, b: 0.185, mode: "plain", steps: ["PRD", "Figma", "Frontend", "Integration", "Product"] },
  { y: 1000, accent: "var(--cream-100)", a: 0.205, b: 0.33, mode: "chaos", steps: ["PRD", "Research", "Design", "Frontend", "Integration", "Product"] },
  { y: 1700, accent: "var(--cream-100)", a: 0.35, b: 0.475, mode: "zero", steps: ["Idea", "Research", "Design", "Frontend", "Integration", "Product"] },
];

const CAM = [
  { p: 0.0, x: 700, y: 300 },
  { p: 0.06, x: 560, y: 300 },
  { p: 0.185, x: 880, y: 300 },
  { p: 0.235, x: 560, y: 1000 },
  { p: 0.33, x: 880, y: 1000 },
  { p: 0.38, x: 560, y: 1700 },
  { p: 0.475, x: 880, y: 1700 },
];

const SPLIT = 0.48;
const HOLD = 0.03;
const TYPE_MS = 2000;
const SHOT_MS = 300;
const HOLD_MS = 900;
const HOLD_OUT_MS = 400;
const MORE_MS = 700;
const GATE = 0.04;
const TAIL = 0.028;

interface Project {
  key: string;
  name: string;
  role: string;
  year: string;
  desc: string;
}

const PROJECTS: Project[] = [
  {
    key: "apotekpro",
    name: "Apotek Pro",
    role: "Full-stack",
    year: "2024",
    desc: "A pharmacy operating system — point of sale, prescriptions, stock and expiry, finance. Built end to end, from schema to interface.",
  },
  {
    key: "alhikmah",
    name: "Al-Hikmah",
    role: "Frontend",
    year: "2024",
    desc: "Public site and portals for a modern Islamic boarding school: admissions, guardian and student dashboards, billing and savings.",
  },
  {
    key: "zanscode",
    name: "Zanscode",
    role: "Frontend",
    year: "2025",
    desc: "Company site and internal OS for a software studio — service pages, product suite, and an operations dashboard behind one system.",
  },
  {
    key: "trimly",
    name: "Trimly",
    role: "Frontend",
    year: "2026",
    desc: "Barbershop management across owner, staff and customer roles: booking, cashier, commission and multi-branch reporting.",
  },
  {
    key: "wowrack",
    name: "Wowrack Recruitment Portal",
    role: "Frontend",
    year: "2026",
    desc: "Careers site and candidate portal — job listings, a long structured application flow, and applicant stage tracking.",
  },
];

const shotSrc = (key: string, j: number) => `/projects/${key}/${j + 1}.png`;

interface State {
  p: number;
  vw: number;
  vh: number;
  m: number;
  fx: number;
  fy: number;
  fw: number;
  fh: number;
  tIdx: number;
  tP: number;
  sIdx: number;
  sPrev: number;
  sP: number;
  outSrc: string | null;
  hOn: boolean;
  hP: number;
  mOn: boolean;
  mP: number;
}

interface StepVM {
  label: string;
  num: string;
  hasLine: boolean;
  slotStyle: CSSProperties;
  lineStyle: CSSProperties;
  wrapStyle: CSSProperties;
  fillStyle: CSSProperties;
}

interface WorkVM {
  num: string;
  name: string;
  nameTyped: string;
  roleTyped: string;
  yearTyped: string;
  descTyped: string;
  caretStyle: CSSProperties;
  dashStyle: CSSProperties;
  ruleStyle: CSSProperties;
  dots: { style: CSSProperties }[];
  shots: { style: CSSProperties }[];
  metaIn: number;
}

/** The design system's Label (components/core/Label.jsx), default `span` / primary tone. */
function DsLabel({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-grotesk)",
        fontSize: "var(--type-label)",
        fontWeight: "var(--type-label-weight)",
        letterSpacing: "var(--type-label-tracking)",
        textTransform: "uppercase",
        lineHeight: 1,
        color: "var(--text-primary)",
      }}
    >
      {children}
    </span>
  );
}

interface TrackProps {
  scrollLength?: number;
}

class ProcessWorkTrack extends React.Component<TrackProps, State> {
  state: State = {
    p: 0,
    vw: 1440,
    vh: 820,
    m: 0,
    fx: 0,
    fy: 0,
    fw: 0,
    fh: 0,
    tIdx: -1,
    tP: 0,
    sIdx: 0,
    sPrev: 0,
    sP: 1,
    outSrc: null,
    hOn: false,
    hP: 0,
    mOn: false,
    mP: 0,
  };

  trackRef = React.createRef<HTMLDivElement>();
  frameRef = React.createRef<HTMLDivElement>();

  private _t0 = 0;
  private _ready: Record<string, boolean> | undefined;
  private _alive = false;
  private _raf = 0;
  private _rafAt = 0;
  private _tT0 = 0;
  private _sT0 = 0;
  private _mT0 = 0;
  private _mFrom = 0;
  private _hT0 = 0;
  private _hFrom = 0;
  private _reduced = false;
  private _reducedQuery: MediaQueryList | null = null;
  private _el!: () => HTMLDivElement | null;
  private _measure!: () => void;
  private _pump!: () => void;
  private _onScroll!: () => void;
  private _onResize!: () => void;
  private _onMotionChange!: () => void;

  componentDidMount() {
    this._t0 = performance.now();
    this._ready = {};
    this._reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this._reduced = this._reducedQuery.matches;
    PROJECTS.forEach((pr) => {
      for (let j = 0; j < 4; j++) {
        const src = shotSrc(pr.key, j);
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (img.decode) {
            try {
              img.decode().catch(() => {});
            } catch {
              /* decode is an optimisation only */
            }
          }
          if (this._ready) this._ready[src] = true;
          if (this._alive) this.forceUpdate();
        };
        img.src = src;
      }
    });
    this._el = () => this.trackRef.current || document.querySelector<HTMLDivElement>("[data-wf-track]");
    // one measure pass: layout reads first, then a single setState
    this._measure = () => {
      const el = this._el();
      if (!el) return;
      const stage = el.querySelector("[data-wf-stage]");
      const sr = stage ? stage.getBoundingClientRect() : null;
      const tr = el.getBoundingClientRect();
      let fx: number | null = null;
      let fw: number | null = null;
      let fy: number | null = null;
      let fh: number | null = null;
      const fr = this.frameRef.current;
      if (fr && stage && sr && fr.offsetWidth) {
        if (this._raf) {
          cancelAnimationFrame(this._raf);
          this._raf = 0;
        }
        const prev = fr.style.transform;
        fr.style.transform = "none";
        const b = fr.getBoundingClientRect();
        fx = b.left - sr.left;
        fy = b.top - sr.top;
        fw = b.width;
        fh = b.height;
        fr.style.transform = prev;
      }
      const vh = (sr && sr.height) || window.innerHeight;
      const span = tr.height - vh;
      const p = clamp01(span > 0 ? -tr.top / span : 0);
      const next: Partial<State> = {};
      if (sr && sr.width && (Math.abs(sr.width - this.state.vw) > 1 || Math.abs(sr.height - this.state.vh) > 1)) {
        next.vw = sr.width;
        next.vh = sr.height;
      }
      if (
        fw &&
        fx !== null &&
        fy !== null &&
        fh !== null &&
        (Math.abs(fx - this.state.fx) > 2 ||
          Math.abs(fw - this.state.fw) > 2 ||
          Math.abs(fy - (this.state.fy || 0)) > 2 ||
          Math.abs(fh - (this.state.fh || 0)) > 2)
      ) {
        next.fx = fx;
        next.fy = fy;
        next.fw = fw;
        next.fh = fh;
      }
      if (Math.abs(p - this.state.p) > 0.0005) next.p = p;
      const span2 = 1 / PROJECTS.length;
      const mp = next.p !== undefined ? next.p : this.state.p;
      const settled = mp > SPLIT + GATE;
      const idx = settled ? Math.min(PROJECTS.length - 1, Math.floor(clamp01(seg(mp, SPLIT + GATE, 1 - TAIL)) / span2)) : -1;
      if (idx !== this.state.tIdx) {
        this._tT0 = settled ? performance.now() : 0;
        next.tIdx = idx;
        next.tP = 0;
      }
      const local = settled ? clamp01(clamp01(seg(mp, SPLIT + GATE, 1 - TAIL)) / span2 - Math.max(0, idx)) : 0;
      const sIdx = Math.min(3, Math.floor(local * 4.08));
      const mOn = mp > 1 - TAIL + 0.012;
      if (mOn !== this.state.mOn) {
        this._mT0 = performance.now();
        this._mFrom = this.state.mP;
        next.mOn = mOn;
      }
      const hOn = mp < SPLIT - 0.022 && clamp01(mp / (SPLIT - HOLD)) > 0.945;
      if (hOn !== this.state.hOn) {
        this._hT0 = performance.now();
        this._hFrom = this.state.hP;
        next.hOn = hOn;
      }
      const projChanged = next.tIdx !== undefined && next.tIdx !== this.state.tIdx;
      if (sIdx !== this.state.sIdx || projChanged) {
        this._sT0 = performance.now();
        if (projChanged) {
          const old = PROJECTS[this.state.tIdx];
          const oj = this.state.sIdx;
          next.outSrc = old ? shotSrc(old.key, oj) : null;
          next.sPrev = sIdx;
        } else {
          next.outSrc = null;
          next.sPrev = this.state.sIdx;
        }
        next.sIdx = sIdx;
        next.sP = 0;
      }
      if (this._reduced) {
        // Reduced motion: every time-based clock is already at its end state.
        if (this.state.m < 1) next.m = 1;
        const mPEnd = mOn ? 1 : 0;
        if (mPEnd !== this.state.mP) next.mP = mPEnd;
        const hPEnd = hOn ? 1 : 0;
        if (hPEnd !== this.state.hP) next.hP = hPEnd;
        if (this.state.sP < 1 || next.sP !== undefined) next.sP = 1;
        const tPEnd = settled ? 1 : 0;
        if (tPEnd !== this.state.tP || next.tP !== undefined) next.tP = tPEnd;
      }
      if (Object.keys(next).length) this.setState(next as State);
      this._pump();
    };

    // rAF runs ONLY while a time clock is live (intro fade or typing)
    this._pump = () => {
      if (!this._alive || this._reduced) return;
      if (this._raf) {
        if (performance.now() - (this._rafAt || 0) < 400) return;
        cancelAnimationFrame(this._raf);
        this._raf = 0;
      }
      const hSettled = this.state.hOn ? this.state.hP >= 1 : this.state.hP <= 0;
      const tSettled = !this._tT0 || this.state.tP >= 1;
      const mSettled = this.state.mOn ? this.state.mP >= 1 : this.state.mP <= 0;
      if (this.state.m >= 1 && tSettled && this.state.sP >= 1 && hSettled && mSettled) return;
      this._rafAt = performance.now();
      this._raf = requestAnimationFrame(() => {
        this._raf = 0;
        if (!this._alive) return;
        const next: Partial<State> = {};
        const m = clamp01((performance.now() - this._t0 - 180) / 1300);
        if (this.state.m < 1 && m > this.state.m) next.m = m;
        if (this._mT0) {
          const dm = (performance.now() - this._mT0) / (this.state.mOn ? MORE_MS : HOLD_OUT_MS);
          const from = this._mFrom || 0;
          const v = this.state.mOn ? clamp01(from + dm) : clamp01(from - dm);
          if (v !== this.state.mP) next.mP = v;
        }
        if (this._hT0) {
          const d = (performance.now() - this._hT0) / (this.state.hOn ? HOLD_MS : HOLD_OUT_MS);
          const from = this._hFrom || 0;
          const h = this.state.hOn ? clamp01(from + d) : clamp01(from - d);
          if (h !== this.state.hP) next.hP = h;
        }
        if (this.state.sP < 1 && this._sT0) {
          const q = clamp01((performance.now() - this._sT0) / SHOT_MS);
          if (q > this.state.sP) next.sP = q;
        }
        if (this._tT0) {
          const k = clamp01((performance.now() - this._tT0) / TYPE_MS);
          if (k !== this.state.tP) next.tP = k;
        }
        if (Object.keys(next).length) this.setState(next as State);
        else this.forceUpdate();
        this._pump();
      });
    };

    this._alive = true;
    this._onScroll = () => {
      if (this._alive) this._measure();
    };
    this._onResize = () => {
      if (this._alive) this._measure();
    };
    this._onMotionChange = () => {
      this._reduced = !!this._reducedQuery && this._reducedQuery.matches;
      if (this._alive) this._measure();
    };
    this._measure();
    setTimeout(() => this._alive && this._measure(), 300);
    window.addEventListener("scroll", this._onScroll, { passive: true, capture: true });
    window.addEventListener("resize", this._onResize);
    this._reducedQuery.addEventListener("change", this._onMotionChange);
  }

  componentWillUnmount() {
    this._alive = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    window.removeEventListener("scroll", this._onScroll, { capture: true });
    window.removeEventListener("resize", this._onResize);
    if (this._reducedQuery) this._reducedQuery.removeEventListener("change", this._onMotionChange);
  }

  camera(p: number, vw: number, vh: number) {
    let i = 0;
    while (i < CAM.length - 2 && p > CAM[i + 1].p) i++;
    const A = CAM[i];
    const B = CAM[i + 1];
    const t = S(seg(p, A.p, B.p));
    const mob = vw < 760;
    const sWork = mob ? Math.max(0.3, Math.min(0.82, vw / 540)) : Math.max(0.3, Math.min(1.05, vw / 1300));
    let ax = A.x;
    let bx = B.x;
    if (mob) {
      // traverse derived from row bounds: first card flush left, last flush right
      const half = vw / (2 * sWork);
      const xMin = 90 + half;
      const xMax = 1190 - half;
      const map = (v: number) => {
        if (xMax < xMin) return 640;
        const q = clamp01((v - 560) / (880 - 560));
        return lerp(xMin, xMax, q);
      };
      ax = map(A.x);
      bx = map(B.x);
    }
    let x = lerp(ax, bx, t);
    let y = lerp(A.y, B.y, t);
    let s = sWork;
    const cv = S(seg(p, 0.478, 0.575));
    if (cv > 0) {
      const sAll = mob ? Math.min(vw / 1500, vh / 1900) : Math.min(vw / 2200, vh / 2060);
      x = lerp(x, 1010, cv);
      y = lerp(y, 1010, cv);
      s = lerp(s, sAll, cv);
    }
    const fin = S(seg(p, 0.665, 0.735));
    if (fin > 0) {
      const sFin = Math.min(vw / 1120, vh / 680);
      x = lerp(x, 2150, fin);
      y = lerp(y, 1000, fin);
      s = lerp(s, sFin, fin);
    }
    const zoom = S(seg(p, 0.878, 0.95));
    if (zoom > 0) {
      const cw = 812;
      const sZoom = Math.min((vw * 0.75) / cw, (vh * 0.75) / 400);
      x = lerp(x, 2115 + cw / 2, zoom);
      y = lerp(y, 1000, zoom);
      s = lerp(s, sZoom, zoom);
    }
    return { x, y, s };
  }

  buildRow(cfg: RowConfig, p: number): StepVM[] {
    const local = seg(p, cfg.a, cfg.b);
    const n = cfg.steps.length;
    const stride = 1 / (n + 0.5);
    const past = p > cfg.b;
    return cfg.steps.map((label, i) => {
      const t = clamp01((local - i * stride * 0.88) / (stride * 1.85));
      const rev = S(t);
      const nextT = i < n - 1 ? S(clamp01((local - (i + 1) * stride * 0.88) / (stride * 1.6))) : 0;
      const last = i === n - 1;
      const act = last ? rev : rev * (1 - 0.68 * nextT);
      let ty = lerp(20, 0, rev);
      let rot = 0;
      let sc = 1;
      if (cfg.mode !== "chaos" && i === 0) {
        const chaos = clamp01(1 - local * 2.1);
        rot = -3.4 * chaos;
        ty += chaos * 16;
      }
      if (cfg.mode === "chaos") {
        const chaos = clamp01(1 - local * 2.1) * (1 - i / (n - 1));
        rot = (i % 2 ? 1 : -1) * 3.4 * chaos;
        ty += chaos * 16 * ((i % 3) - 1);
      }
      if (cfg.mode === "zero") sc = lerp(i === 0 ? 0.42 : 0.82, 1, rev);
      return {
        label,
        num: "0" + (i + 1),
        hasLine: i > 0,
        slotStyle: { display: "flex", alignItems: "center", flex: "1 1 0", minWidth: 0 },
        lineStyle: {
          flex: "0 0 36px",
          display: "flex",
          alignItems: "center",
          transform: "scaleX(" + S(clamp01((local - (i - 0.55) * stride * 0.88) / (stride * 1.15))) + ")",
          transformOrigin: "left center",
          opacity: past ? 0.5 : 0.85,
        },
        wrapStyle: {
          flex: "1 1 0",
          minWidth: 0,
          opacity: rev * (0.34 + 0.66 * (past && !last ? 0.45 : act)),
          transform: "translateY(" + ty.toFixed(2) + "px) rotate(" + rot.toFixed(2) + "deg) scale(" + sc.toFixed(3) + ")",
          willChange: "transform, opacity",
        },
        fillStyle: {
          position: "absolute",
          inset: 0,
          background: last ? "var(--amber-500)" : "var(--cream-100)",
          opacity: (past && !last ? act * 0.35 : act) * (last ? 1 : 0.95),
        },
      };
    });
  }

  showcase(mp: number, k: number, cur: number, prev: number, sP: number, outSrc: string | null): WorkVM {
    const t0 = clamp01(seg(mp, SPLIT + GATE, 1 - TAIL));
    const span = 1 / PROJECTS.length;
    const raw = t0 / span;
    const i = Math.min(PROJECTS.length - 1, Math.floor(raw));
    const pr = PROJECTS[i];

    // short type-on, long hold
    const type = (str: string, a: number, b: number) => {
      const q = clamp01((k - a) / (b - a));
      return str.slice(0, Math.ceil(str.length * q));
    };
    const nameK = clamp01(k / 0.35);
    const descK = clamp01((k - 0.3) / 0.7);

    const n = 4;
    const shots = Array.from({ length: n }, (_, j) => {
      const src = shotSrc(pr.key, j);
      const loaded = !this._ready || this._ready[src];
      const opening = i === 0 && cur === 0 && prev === 0 && !outSrc;
      let o = j === cur ? (opening ? 1 : S(sP)) : j === prev && prev !== cur ? 1 - S(sP) : 0;
      if (!loaded) o = 0;
      return {
        style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          backgroundImage: 'url("' + src + '")',
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: o,
          willChange: "opacity",
        } as CSSProperties,
        dot: { width: 26, height: 2, background: "var(--ink-900)", opacity: 0.18 + 0.82 * o } as CSSProperties,
      };
    });

    return {
      num: "0" + (i + 1),
      name: pr.name,
      nameTyped: type(pr.name, 0, 0.35),
      roleTyped: type(pr.role, 0.3, 0.44),
      yearTyped: type(pr.year, 0.4, 0.52),
      descTyped: type(pr.desc, 0.3, 1),
      caretStyle: {
        display: "inline-block",
        width: 3,
        height: "0.82em",
        marginLeft: 6,
        verticalAlign: "baseline",
        background: "var(--ink-900)",
        opacity: nameK < 1 ? 0.85 : 0,
      },
      dashStyle: {
        width: 18,
        height: 1,
        background: "var(--rule-strong)",
        opacity: S(clamp01((k - 0.36) / 0.08)),
      },
      ruleStyle: {
        height: 1,
        background: "var(--rule)",
        transform: "scaleX(" + S(clamp01((k - 0.1) / 0.2)).toFixed(3) + ")",
        transformOrigin: "left center",
      },
      dots: shots.map((s) => ({ style: s.dot })),
      shots: (outSrc && sP < 1
        ? [
            {
              style: {
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                backgroundImage: 'url("' + outSrc + '")',
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: 1 - S(sP),
                willChange: "opacity",
              } as CSSProperties,
            },
          ]
        : []
      ).concat(shots.map((s) => ({ style: s.style }))),
      metaIn: descK,
    };
  }

  renderVals() {
    const mp = this.state.p;
    const p = clamp01(mp / (SPLIT - HOLD));
    const xf = S(seg(mp, SPLIT - 0.012, SPLIT + 0.006));
    const ho = S(seg(mp, SPLIT + 0.006, SPLIT + GATE));
    const showIn = xf;
    const metaIn = mp > SPLIT + GATE ? 1 : 0;
    const vw = this.state.vw;
    const vh = this.state.vh;
    const nar = vw < 900 && vh >= 620;
    const cam = this.camera(p, vw, vh);
    const s = cam.s;
    const ox = vw / 2 - cam.x * s;
    const oy = vh / 2 - cam.y * s;

    const restOut = S(seg(p, 0.878, 0.93));

    const rowStyle = (cfg: RowConfig): CSSProperties => {
      const active = p >= cfg.a - 0.05 && p <= cfg.b + 0.05;
      const conv = S(seg(p, 0.478, 0.575));
      const started = p > cfg.a - 0.06;
      const base = active ? 1 : started ? 0.3 : 0.16;
      const restOutRow = S(seg(p, 0.878, 0.93));
      return {
        position: "absolute",
        left: 90,
        top: cfg.y - 78,
        width: 1100,
        height: 156,
        display: "flex",
        alignItems: "center",
        opacity: lerp(base, started ? 0.82 : 0.2, conv) * (1 - 0.68 * S(seg(p, 0.685, 0.745))) * (1 - restOutRow),
        transition: "none",
      };
    };

    const dash = (from: number, to: number): CSSProperties => {
      const d = S(seg(p, from, to));
      return {
        strokeDasharray: 100,
        strokeDashoffset: 100 - 100 * d,
        opacity: d > 0 ? (1 - 0.72 * S(seg(p, 0.685, 0.745))) * (1 - restOut) : 0,
      };
    };

    const headOut = S(seg(p, 0.025, 0.06));
    const headIn = S(this.state.m);
    const youR = S(seg(p, 0.575, 0.635));
    const prodR = S(seg(p, 0.685, 0.745));
    const swap = S(seg(p, 0.755, 0.855));
    const hA = S(clamp01(this.state.hP / 0.62));
    const hB = hA;

    const cap = (a: number, b: number, c: number, d: number): CSSProperties => ({
      opacity: S(seg(p, a, b)) * (1 - S(seg(p, c, d))),
      gridArea: "1 / 1",
      transform: "translateY(" + (6 - 6 * S(seg(p, a, b))).toFixed(2) + "px)",
    });

    const labels = ["Opening", "01 PRD → product", "02 PRD without UI/UX", "03 From zero", "Convergence", "Completed product"].concat(
      PROJECTS.map((pr, i) => "Work 0" + (i + 1) + " " + pr.name)
    );
    const showIdx = Math.min(PROJECTS.length - 1, Math.floor(clamp01(seg(mp, SPLIT + GATE, 1)) * PROJECTS.length));
    const li = mp > SPLIT ? 6 + showIdx : p < 0.06 ? 0 : p < 0.2 ? 1 : p < 0.345 ? 2 : p < 0.49 ? 3 : p < 0.675 ? 4 : 5;

    return {
      sceneLabel: labels[li],
      trackStyle: { position: "relative", width: "100%", height: (this.props.scrollLength ?? 2560) + "vh" } as CSSProperties,
      worldStyle: {
        position: "absolute",
        left: 0,
        top: 0,
        width: 2700,
        height: 2100,
        transformOrigin: "0 0",
        transform: "translate(" + ox.toFixed(2) + "px," + oy.toFixed(2) + "px) scale(" + s.toFixed(4) + ")",
        opacity: xf >= 1 ? 0 : 1,
        backfaceVisibility: "hidden",
      } as CSSProperties,
      s1: this.buildRow(ROWS[0], p),
      s2: this.buildRow(ROWS[1], p),
      s3: this.buildRow(ROWS[2], p),
      row1Style: rowStyle(ROWS[0]),
      row2Style: rowStyle(ROWS[1]),
      row3Style: rowStyle(ROWS[2]),
      path1Style: dash(0.5, 0.59),
      path2Style: dash(0.505, 0.59),
      path3Style: dash(0.5, 0.59),
      path4Style: dash(0.665, 0.72),
      youStyle: {
        position: "absolute",
        left: 1700,
        top: 890,
        opacity: youR * (1 - restOut),
        transform: "translateY(" + lerp(26, 0, youR).toFixed(2) + "px)",
      } as CSSProperties,
      moreStyle: (() => {
        const a = S(this.state.mP);
        return {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "clamp(26px,5vh,64px)",
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          opacity: a,
          transform: "translateY(" + lerp(16, 0, a).toFixed(2) + "px)",
        } as CSSProperties;
      })(),
      holdTopStyle: {
        position: "absolute",
        left: 0,
        right: 0,
        top: "clamp(26px,5vh,64px)",
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: hA,
        transform: "translateY(" + lerp(-14, 0, hA).toFixed(2) + "px)",
      } as CSSProperties,
      holdBottomStyle: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: "clamp(26px,5vh,64px)",
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: hB,
        transform: "translateY(" + lerp(14, 0, hB).toFixed(2) + "px)",
      } as CSSProperties,
      productStyle: {
        position: "absolute",
        left: 2115,
        top: 800,
        width: lerp(480, 812, S(seg(p, 0.755, 0.855))),
        height: 400,
        opacity: prodR,
        transform: "translateY(" + lerp(30, 0, prodR).toFixed(2) + "px) scale(" + lerp(0.94, 1, prodR).toFixed(3) + ")",
      } as CSSProperties,
      headingStyle: {
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
        opacity: headIn * (1 - headOut),
        transform: "translateY(" + (lerp(30, 0, headIn) - 38 * headOut).toFixed(2) + "px)",
      } as CSSProperties,
      kickerStyle: { opacity: 0.9 } as CSSProperties,
      cap1Style: cap(0.068, 0.1, 0.168, 0.198),
      cap2Style: cap(0.213, 0.245, 0.313, 0.343),
      cap3Style: cap(0.358, 0.39, 0.458, 0.488),
      cap4Style: cap(0.5, 0.535, 0.645, 0.672),
      cap5Style: cap(0.685, 0.715, 0.895, 0.925),
      cap6Style: {
        gridArea: "1 / 1",
        opacity: showIn * (1 - S(seg(mp, 0.975, 1))),
        transform: "translateY(" + (6 - 6 * showIn).toFixed(2) + "px)",
      } as CSSProperties,
      showcaseStyle: {
        position: "absolute",
        inset: 0,
        opacity: xf >= 1 ? 1 : 0,
        pointerEvents: xf >= 1 ? "auto" : "none",
      } as CSSProperties,
      workFrameStyle: (() => {
        const narrow = nar;
        const padX = narrow ? Math.min(28, Math.max(16, vw * 0.045)) : Math.min(52, Math.max(20, vw * 0.035));
        const padY = narrow ? 64 : Math.min(92, Math.max(72, vw * 0.06));
        const metaW = narrow ? 0 : 264;
        const gap = narrow ? 24 : Math.min(58, Math.max(24, vw * 0.04));
        const availW = Math.min(1560, vw) - 2 * padX - metaW - (narrow ? 0 : gap);
        const metaH = narrow ? 320 : 0;
        const availH = Math.max(120, vh - 2 * padY - metaH);
        const shotW = Math.max(160, Math.min(availW, (availH * 812) / 400));
        const fw = this.state.fw || 0;
        const fx = this.state.fx || 0;
        const fy = this.state.fy || 0;
        const fh = this.state.fh || 0;

        const base: CSSProperties = {
          position: "relative",
          minWidth: 0,
          minHeight: 0,
          width: Math.round(shotW) + "px",
          height: Math.round((shotW * 400) / 812) + "px",
          justifySelf: "center",
          flex: "0 0 auto",
          background: "var(--cream-100)",
          borderRadius: "0 0 20px 0",
          overflow: "hidden",
          gridArea: nar ? "shot" : "auto",
          alignSelf: "center",
          willChange: "transform",
        };
        if (!fw || !fh || ho >= 1) return base;
        const sz = Math.min((vw * 0.75) / 812, (vh * 0.75) / 400);
        const holdW = 812 * sz;
        const holdH = 400 * sz;
        const sc0 = Math.min(holdW / fw, holdH / fh);
        const dx = vw / 2 - (fx + fw / 2);
        const dy = vh / 2 - (fy + fh / 2);
        base.transformOrigin = "50% 50%";
        const sc = lerp(sc0, 1, ho);
        base.borderRadius = "0 0 " + (20 / sc).toFixed(2) + "px 0";
        base.transform = "translate(" + (dx * (1 - ho)).toFixed(2) + "px," + (dy * (1 - ho)).toFixed(2) + "px) scale(" + sc.toFixed(4) + ")";
        return base;
      })(),
      work: this.showcase(mp, this.state.tP, this.state.sIdx, this.state.sPrev, this.state.sP, this.state.outSrc),
      workWrapStyle: {
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: nar ? "minmax(0,1fr)" : "minmax(0,264px) minmax(0,1fr)",
        gridTemplateRows: nar ? "auto auto" : "auto",
        gridTemplateAreas: nar ? '"shot" "meta"' : "none",
        justifyContent: "center",
        justifyItems: "stretch",
        alignItems: "center",
        alignContent: "center",
        maxWidth: 1560,
        marginInline: "auto",
        gap: "clamp(24px,4vw,58px)",
        padding: nar ? "64px 16px" : "clamp(72px,6vw,92px) clamp(20px,3.5vw,52px)",
        boxSizing: "border-box",
      } as CSSProperties,
      workMetaStyle: {
        display: "flex",
        flexDirection: "column",
        gap: 18,
        minWidth: 0,
        gridArea: nar ? "meta" : "auto",
        paddingInline: nar ? 10 : 0,
        opacity: metaIn,
      } as CSSProperties,
      mockStyle: {
        position: "absolute",
        inset: 0,
        padding: 26,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        opacity: 1 - swap,
      } as CSSProperties,
      prodShotStyle: (() => {
        const cw = lerp(480, 812, S(seg(p, 0.755, 0.855)));
        return {
          position: "absolute",
          left: Math.round(ox + 2115 * s),
          top: Math.round(oy + 800 * s),
          width: Math.round(cw * s),
          height: Math.round(400 * s),
          overflow: "hidden",
          borderRadius: "0 0 20px 0",
          background: "var(--surface-cream)",
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          opacity: xf >= 1 ? 0 : swap * prodR,
          pointerEvents: "none",
        } as CSSProperties;
      })(),
      hintStyle: {
        position: "absolute",
        left: "50%",
        bottom: 34,
        transform: "translateX(-50%)",
        opacity: 1 - S(seg(p, 0.01, 0.05)),
      } as CSSProperties,
    };
  }

  renderRow(rowStyle: CSSProperties, steps: StepVM[]) {
    return (
      <div style={rowStyle}>
        {steps.map((st, i) => (
          <div key={i} style={st.slotStyle}>
            {st.hasLine && (
              <div style={st.lineStyle}>
                <div style={{ width: "100%", height: 1, background: "var(--rule-strong)" }}></div>
              </div>
            )}
            <div style={st.wrapStyle}>
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  height: 136,
                  background: "var(--clay-100)",
                  borderRadius: "0 0 20px 0",
                  padding: 15,
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={st.fillStyle}></div>
                <span style={{ position: "relative", fontSize: 13, fontWeight: 700, letterSpacing: "0.09em", color: "var(--text-muted)" }}>{st.num}</span>
                <span
                  style={{
                    position: "relative",
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "0.045em",
                    textTransform: "uppercase",
                    lineHeight: 1.22,
                    color: "var(--text-primary)",
                    wordBreak: "break-word",
                  }}
                >
                  {st.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const v = this.renderVals();
    const work = v.work;
    return (
      <div data-wf-track="1" ref={this.trackRef} style={v.trackStyle}>
        <div
          style={{
            position: "sticky",
            top: "var(--hdr,73px)",
            height: "calc(100vh - var(--hdr,73px))",
            overflow: "hidden",
            background: "var(--surface-page)",
          }}
        >
          <div
            data-wf-stage="1"
            data-screen-label={v.sceneLabel}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              background: "var(--surface-page)",
              fontFamily: "var(--font-grotesk)",
              color: "var(--text-primary)",
            }}
          >
            <div style={v.worldStyle}>
              {this.renderRow(v.row1Style, v.s1)}
              {this.renderRow(v.row2Style, v.s2)}
              {this.renderRow(v.row3Style, v.s3)}

              <svg
                viewBox="0 0 2700 2100"
                width="2700"
                height="2100"
                fill="none"
                aria-hidden="true"
                style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
              >
                <path d="M1205 300 C1420 300 1480 1000 1700 1000" pathLength={100} stroke="var(--ink-900)" strokeWidth={2} style={v.path1Style}></path>
                <path d="M1205 1000 L1700 1000" pathLength={100} stroke="var(--ink-900)" strokeWidth={2} style={v.path2Style}></path>
                <path d="M1205 1700 C1420 1700 1480 1000 1700 1000" pathLength={100} stroke="var(--ink-900)" strokeWidth={2} style={v.path3Style}></path>
                <path d="M1925 1000 L2115 1000" pathLength={100} stroke="var(--ink-900)" strokeWidth={2} style={v.path4Style}></path>
              </svg>

              <div style={v.youStyle}>
                <div
                  style={{
                    position: "relative",
                    width: 220,
                    height: 220,
                    background: "var(--surface-red)",
                    borderRadius: "0 0 20px 0",
                    padding: 18,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: "var(--type-label)",
                      fontWeight: 700,
                      letterSpacing: "var(--type-label-tracking)",
                      textTransform: "uppercase",
                      color: "var(--cream-100)",
                      opacity: 0.8,
                    }}
                  >
                    Same maker
                  </span>
                  <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 82, lineHeight: 0.86, color: "var(--cream-100)" }}>me</span>
                </div>
              </div>

              <div style={v.productStyle}>
                <div style={{ position: "relative", width: "100%", height: "100%", background: "var(--surface-cream)", borderRadius: "0 0 20px 0", overflow: "hidden" }}>
                  <div style={v.mockStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span
                        style={{
                          fontSize: "var(--type-label)",
                          fontWeight: 700,
                          letterSpacing: "var(--type-label-tracking)",
                          textTransform: "uppercase",
                          color: "var(--text-primary)",
                        }}
                      >
                        Product
                      </span>
                      <span
                        style={{
                          fontSize: "var(--type-label)",
                          fontWeight: 700,
                          letterSpacing: "var(--type-label-tracking)",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                        }}
                      >
                        Shipped
                      </span>
                    </div>
                    <div style={{ height: 1, background: "var(--rule-strong)" }}></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, flex: "1 1 auto" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ height: 78, background: "var(--amber-500)", borderRadius: "0 0 14px 0" }}></div>
                        <div style={{ height: 1, background: "var(--rule)" }}></div>
                        <div style={{ height: 1, background: "var(--rule)" }}></div>
                        <div style={{ height: 1, background: "var(--rule)" }}></div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ height: 1, background: "var(--rule)" }}></div>
                        <div style={{ height: 1, background: "var(--rule)" }}></div>
                        <div style={{ flex: "1 1 auto", background: "var(--clay-100)", borderRadius: "0 0 14px 0" }}></div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 44, lineHeight: 0.86, color: "var(--text-primary)" }}>complete</span>
                      <span
                        style={{
                          fontSize: "var(--type-label)",
                          fontWeight: 700,
                          letterSpacing: "var(--type-label-tracking)",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                        }}
                      >
                        One outcome
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={v.prodShotStyle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/projects/apotekpro-product.png"
                alt="Apotek Pro product"
                style={{ height: "100%", width: "auto", maxWidth: "none", display: "block", flex: "0 0 auto" }}
              />
            </div>

            <div style={v.moreStyle}>
              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(24px,2.6vw,38px)", lineHeight: 1.1, color: "var(--text-primary)" }}>
                And there&apos;s more.
              </span>
            </div>

            <div style={v.holdTopStyle}>
              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(24px,2.6vw,38px)", lineHeight: 1.1, color: "var(--text-primary)" }}>
                And then, it came out to life
              </span>
            </div>

            <div style={v.holdBottomStyle}>
              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(18px,1.8vw,26px)", lineHeight: 1.2, color: "var(--text-primary)" }}>
                Built from an idea. Made for impact.
              </span>
            </div>

            <div style={v.showcaseStyle}>
              <div style={v.workWrapStyle}>
                <div style={v.workMetaStyle}>
                  <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 34, lineHeight: 1, color: "var(--text-primary)" }}>{work.num}</span>
                  <h2
                    style={{
                      margin: 0,
                      minHeight: "1.1em",
                      fontSize: "clamp(30px,3.4vw,52px)",
                      lineHeight: 1.02,
                      letterSpacing: "var(--type-display-tracking)",
                      fontWeight: 600,
                      textWrap: "pretty",
                    }}
                  >
                    {work.nameTyped}
                    <span style={work.caretStyle}></span>
                  </h2>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", minHeight: 14 }}>
                    <span
                      style={{
                        fontSize: "var(--type-label)",
                        fontWeight: 700,
                        letterSpacing: "var(--type-label-tracking)",
                        textTransform: "uppercase",
                        color: "var(--text-primary)",
                      }}
                    >
                      {work.roleTyped}
                    </span>
                    <span style={work.dashStyle}></span>
                    <span style={{ fontSize: "var(--type-label)", fontWeight: 700, letterSpacing: "var(--type-label-tracking)", color: "var(--text-primary)" }}>
                      {work.yearTyped}
                    </span>
                  </div>
                  <div style={work.ruleStyle}></div>
                  <p
                    style={{
                      margin: 0,
                      maxWidth: "34ch",
                      minHeight: "4.5em",
                      fontSize: "var(--type-body)",
                      lineHeight: 1.5,
                      color: "var(--text-primary)",
                      textWrap: "pretty",
                    }}
                  >
                    {work.descTyped}
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    {work.dots.map((d, i) => (
                      <span key={i} style={d.style}></span>
                    ))}
                  </div>
                </div>
                <div data-wf-frame="1" ref={this.frameRef} style={v.workFrameStyle}>
                  {work.shots.map((sh, i) => (
                    <div key={i} role="img" aria-label={work.name} style={sh.style}></div>
                  ))}
                </div>
              </div>
            </div>

            <div style={v.headingStyle}>
              <div style={{ maxWidth: 1040, padding: "0 clamp(24px,6vw,110px)" }}>
                <div style={v.kickerStyle}>
                  <DsLabel>How the work begins</DsLabel>
                </div>
                <h1
                  style={{
                    margin: "14px 0 0",
                    fontSize: "var(--type-display-2)",
                    lineHeight: "var(--type-display-lh)",
                    letterSpacing: "var(--type-display-tracking)",
                    fontWeight: 600,
                    textWrap: "pretty",
                  }}
                >
                  Every project starts differently.
                </h1>
                <p style={{ margin: "26px 0 0", maxWidth: "46ch", fontSize: "var(--type-lead)", lineHeight: 1.45, color: "var(--text-primary)" }}>
                  Different beginnings. One finished product.
                </p>
              </div>
            </div>

            <div style={{ position: "absolute", left: "clamp(24px,4vw,52px)", top: "clamp(24px,4vw,44px)", display: "grid" }}>
              <div style={v.cap1Style}>
                <DsLabel>01 — PRD to frontend</DsLabel>
              </div>
              <div style={v.cap2Style}>
                <DsLabel>02 — PRD without UI/UX</DsLabel>
              </div>
              <div style={v.cap3Style}>
                <DsLabel>03 — From zero</DsLabel>
              </div>
              <div style={v.cap4Style}>
                <DsLabel>Different starting points → me</DsLabel>
              </div>
              <div style={v.cap5Style}>
                <DsLabel>Process → completed product</DsLabel>
              </div>
              <div style={v.cap6Style}>
                <DsLabel>Selected work</DsLabel>
              </div>
            </div>

            <div style={v.hintStyle}>
              <DsLabel>Scroll</DsLabel>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const stripLabel: CSSProperties = {
  fontSize: "var(--type-label)",
  fontWeight: 700,
  letterSpacing: "var(--type-label-tracking)",
  textTransform: "uppercase",
};

/**
 * Wrapper strip + the shared track, matching the main design file's
 * `<section data-scene="03">` and `<dc-import name="Scene 03 Process">`.
 * The header label switches from 03 to 04 at the track's 48% mark (the
 * design's own SPLIT), reproduced here with two absolutely-positioned
 * markers that the scene-progress observer can register.
 */
export function SceneProcessWork() {
  const processMarker = useRef<HTMLDivElement>(null);
  const workMarker = useRef<HTMLDivElement>(null);
  useRegisterScene(processMarker, "Scene 03 — The Process");
  useRegisterScene(workMarker, "Scene 04 — The Work");

  // Smooth-scroll stop points for Scene 04 so one flick can't carry the page past the next slide: the
  // middle of each of the 20 shots (5 projects x 4, spaced exactly as the track's own math above
  // spaces them) and the end of the track. Progress is measured the way ProcessWorkTrack measures
  // it: track top over (track height - stage height).
  useEffect(() => {
    return registerScrollStops(() => {
      const track = document.querySelector<HTMLElement>("[data-wf-track]");
      const stage = document.querySelector<HTMLElement>("[data-wf-stage]");
      if (!track || !stage) return [];
      const rect = track.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const length = rect.height - stage.getBoundingClientRect().height;
      if (length <= 0) return [];
      const shots = PROJECTS.length * 4;
      const shotSpan = (1 - TAIL - (SPLIT + GATE)) / shots;
      const shotMids = Array.from({ length: shots }, (_, s) => SPLIT + GATE + (s + 0.5) * shotSpan);
      return [...shotMids, 1].map((progress) => top + progress * length);
    });
  }, []);

  const splitAt = "calc((100% - 100vh + var(--hdr, 73px)) * 0.48)";

  return (
    <>
      <section aria-labelledby="s3-h" data-scene="03" style={{ padding: "var(--space-4) var(--gutter) 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            borderTop: "var(--hairline-ink)",
            paddingTop: "var(--space-2)",
            ...stripLabel,
          }}
        >
          <span>Scene 03 — 04</span>
          <span>The Process · The Work</span>
        </div>
        <h2 id="s3-h" style={{ position: "absolute", left: -9999 }}>
          The Process and The Work
        </h2>
      </section>

      <div style={{ position: "relative" }}>
        <div ref={processMarker} aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: splitAt, pointerEvents: "none" }} />
        <div ref={workMarker} aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: splitAt, bottom: 0, pointerEvents: "none" }} />
        <ProcessWorkTrack />
      </div>
    </>
  );
}
