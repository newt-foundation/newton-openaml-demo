"use client";

/**
 * OpenAML's index as a slowly turning globe of points.
 *
 * Most dots are dim Bone for the Flagged list. The blocking lists (Sanctioned,
 * Blocked, Fraud) are red. The red dots are drawn more often than their real
 * share (1,322 of 364,486 addresses) so they can be seen: to scale there would
 * be nine. A scan ring sweeps the globe; bright dots flare as it passes,
 * standing for the screening.
 *
 * Canvas 2D with its own projection, no 3D library. Pauses off screen and in
 * background tabs. Reduced motion draws one still frame and stops.
 */

import { useEffect, useRef } from "react";
import { SEVERE_TIERS, TIER_COUNTS, TIER_INFO, TOTAL_ADDRESSES, type Tier } from "@/lib/openaml";
import { MOTION } from "@/lib/ds";

const DOTS = 2600;
const PER_DOT = TOTAL_ADDRESSES / DOTS;

// A black and white globe: the common tier is dim Bone. The three severe tiers
// are the page's one spot of colour at rest, the demo red.
const GOLD = [254, 253, 249] as const;
const RED = [224, 85, 46] as const;

type Pt = { x: number; y: number; z: number; red: boolean; phase: number };

/** Small deterministic PRNG so the globe looks the same on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Red dots to scale would be nine, too few to notice. Fifty more are drawn for visibility. */
const RED_TO_SCALE = SEVERE_TIERS.reduce((n, t) => n + Math.max(1, Math.round(TIER_COUNTS[t] / PER_DOT)), 0);
export const RED_DOTS = RED_TO_SCALE + 50;

function buildPoints(): Pt[] {
  const rand = mulberry32(364503);
  const pts: Pt[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < DOTS; i++) {
    const y = 1 - (i / (DOTS - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, red: false, phase: rand() * Math.PI * 2 });
  }
  // Spread the red dots over the globe rather than clustering them.
  let placed = 0;
  while (placed < RED_DOTS) {
    const p = pts[Math.floor(rand() * DOTS)];
    if (!p.red && Math.abs(p.y) < 0.85) {
      p.red = true;
      placed++;
    }
  }
  return pts;
}

type Focus = Tier | "clean" | null;

/**
 * deny:  the lists the visitor's rule blocks. Their chips turn red.
 * focus: the kind of wallet just picked. One dot of that kind flares.
 * kick:  bump it to make the scan ring sweep the globe once, top to bottom.
 */
export default function DataGlobe({ deny = [], focus = null, kick = 0, label }: { deny?: Tier[]; focus?: Focus; kick?: number; label?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  // Read by the draw loop, so a new pick never restarts the animation.
  const live = useRef<{ kick: number; focus: Focus }>({ kick, focus });
  live.current = { kick, focus };

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const pts = buildPoints();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let size = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let spin = 0.6;
    let t = 0;
    // Pointer tilt, eased toward its target.
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;
    // One sweep of the ring and one flaring dot, started by a new kick.
    const SWEEP = 1.1 * MOTION;
    const FLARE = 1.9 * MOTION;
    let seenKick = live.current.kick;
    let kickAt = -10;
    let flare: Pt | null = null;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      size = el.clientWidth;
      cv.width = Math.round(size * dpr);
      cv.height = Math.round(size * dpr);
    };

    const draw = () => {
      const w = size;
      const R = w * 0.36;
      const ox = w / 2;
      const oy = w / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, w);

      // Body of the globe: a faint sphere lit from the upper left.
      const body = ctx.createRadialGradient(ox - R * 0.35, oy - R * 0.4, R * 0.1, ox, oy, R * 1.05);
      body.addColorStop(0, "rgba(255,255,255,0.06)");
      body.addColorStop(0.6, "rgba(255,255,255,0.015)");
      body.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(ox, oy, R * 1.04, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const tilt = 0.38 + cx * 0.25;
      const yaw = spin + cy * 0.4;
      const cosA = Math.cos(yaw),
        sinA = Math.sin(yaw);
      const cosT = Math.cos(tilt),
        sinT = Math.sin(tilt);
      const since = t - kickAt;
      const sweeping = since < SWEEP;
      const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
      // The scan ring's latitude: its slow drift, or one pass from top to bottom.
      const scanY = sweeping ? 0.94 - ease(since / SWEEP) * 1.88 : Math.cos(t * 0.9) * 0.92;
      const project = (x: number, y: number, z: number) => {
        const x1 = x * cosA + z * sinA;
        const z1 = -x * sinA + z * cosA;
        const y2 = y * cosT - z1 * sinT;
        const z2 = y * sinT + z1 * cosT;
        const p = 2.8 / (2.8 - z2);
        return { sx: ox + x1 * R * p, sy: oy - y2 * R * p, depth: z2, p };
      };

      // Gold first, then red on top.
      for (const pt of pts) {
        if (pt.red) continue;
        const q = project(pt.x, pt.y, pt.z);
        const front = (q.depth + 1) / 2;
        const a = 0.06 + front * 0.42;
        const r = (0.7 + front * 0.8) * q.p;
        ctx.fillStyle = `rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${(a * 0.62).toFixed(3)})`;
        ctx.fillRect(q.sx - r / 2, q.sy - r / 2, r, r);
      }

      // Scan ring: the latitude circle at scanY, drawn in front of and behind.
      const ringR = Math.sqrt(Math.max(0, 1 - scanY * scanY));
      ctx.lineWidth = 1.4;
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        for (let i = 0; i <= 96; i++) {
          const a = (i / 96) * Math.PI * 2;
          const q = project(Math.cos(a) * ringR, scanY, Math.sin(a) * ringR);
          const isFront = q.depth >= 0;
          if ((pass === 1) !== isFront) {
            ctx.moveTo(q.sx, q.sy);
            continue;
          }
          ctx.lineTo(q.sx, q.sy);
        }
        ctx.strokeStyle = pass === 1 ? `rgba(254,253,249,${sweeping ? 0.95 : 0.6})` : "rgba(254,253,249,0.14)";
        ctx.shadowColor = "rgba(254,253,249,0.7)";
        ctx.shadowBlur = pass === 1 ? (sweeping ? 22 : 12) : 0;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      for (const pt of pts) {
        if (!pt.red) continue;
        const q = project(pt.x, pt.y, pt.z);
        const front = (q.depth + 1) / 2;
        const near = Math.max(0, 1 - Math.abs(pt.y - scanY) / 0.12); // flare as the ring passes
        const pulse = 0.5 + 0.5 * Math.sin(t * 2 + pt.phase);
        const r = (2.2 + pulse * 0.6 + near * 2.4) * q.p * (0.6 + front * 0.5);
        const a = 0.35 + front * 0.65;
        ctx.shadowColor = `rgba(${RED[0]},${RED[1]},${RED[2]},0.95)`;
        ctx.shadowBlur = 10 + near * 18;
        ctx.fillStyle = `rgba(${RED[0]},${RED[1]},${RED[2]},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(q.sx, q.sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // The picked wallet's kind: one dot swells and sends out a ring.
      if (flare && since < FLARE) {
        const q = project(flare.x, flare.y, flare.z);
        const p = since / FLARE;
        const c = flare.red ? RED : GOLD;
        const fade = Math.sin(Math.PI * Math.min(1, p * 1.05));
        ctx.shadowColor = `rgba(${c[0]},${c[1]},${c[2]},0.95)`;
        ctx.shadowBlur = 26;
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${(0.95 * fade).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(q.sx, q.sy, (3 + 4 * fade) * q.p, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${(0.7 * (1 - p)).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(q.sx, q.sy, (6 + 44 * p) * q.p, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    // The dot of the picked kind nearest the middle of the side facing us.
    const pickFlare = (f: Focus): Pt | null => {
      if (!f || f === "clean") return null;
      const wantRed = SEVERE_TIERS.includes(f);
      const yaw = spin + cy * 0.4;
      let best: Pt | null = null;
      let bestScore = -Infinity;
      for (const pt of pts) {
        if (pt.red !== wantRed) continue;
        const depth = -pt.x * Math.sin(yaw) + pt.z * Math.cos(yaw);
        const score = depth - Math.abs(pt.y) * 0.6;
        if (score > bestScore) {
          bestScore = score;
          best = pt;
        }
      }
      return best;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      spin += dt * 0.12;
      cx += (tx - cx) * Math.min(1, dt * 3);
      cy += (ty - cy) * Math.min(1, dt * 3);
      if (live.current.kick !== seenKick) {
        seenKick = live.current.kick;
        kickAt = t;
        flare = pickFlare(live.current.focus);
      }
      draw();
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduce || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    resize();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(el);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(el);

    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);

    // Pointer tilt: the globe leans toward the cursor. The callouts stay still.
    const onMove = (e: PointerEvent) => {
      if (reduce) return;
      const b = el.getBoundingClientRect();
      const nx = (e.clientX - (b.left + b.width / 2)) / b.width;
      const ny = (e.clientY - (b.top + b.height / 2)) / b.height;
      tx = Math.max(-0.5, Math.min(0.5, ny));
      ty = Math.max(-0.5, Math.min(0.5, nx));
    };
    const onLeave = () => {
      tx = ty = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);

    start();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Flat callouts, one per list, in the four corners the globe leaves empty.
  // Each is a label on a short rule, with a leader to a dot on the globe's
  // edge. They stay still while the globe turns. Units are % of the box.
  const E = 26.6; // the globe's edge on the diagonal: 0.376 of the width, at 45°
  const K = 31.5; // where the leader turns flat
  const callouts: { tier: Tier; sx: -1 | 1; sy: -1 | 1 }[] = [
    { tier: "sanctioned", sx: -1, sy: -1 },
    { tier: "blocked", sx: 1, sy: -1 },
    { tier: "fraud", sx: -1, sy: 1 },
    { tier: "flagged", sx: 1, sy: 1 },
  ];
  const END = 48; // how far out the flat part runs

  return (
    <div ref={wrap} className="oa-globe" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <canvas ref={canvas} />
      <svg className="oa-callout-lines" viewBox="0 0 100 100" aria-hidden>
        {callouts.map((c) => (
          <polyline
            key={c.tier}
            className={focus === c.tier ? "is-focus" : ""}
            points={`${50 + c.sx * E},${50 + c.sy * E} ${50 + c.sx * K},${50 + c.sy * K} ${50 + c.sx * END},${50 + c.sy * K}`}
          />
        ))}
      </svg>
      {callouts.map((c) => {
        const blocked = deny.includes(c.tier);
        return (
          <span key={c.tier} aria-hidden>
            <i
              className={`oa-callout-dot ${blocked ? "is-blocked" : ""}`}
              style={{ left: `${50 + c.sx * E}%`, top: `${50 + c.sy * E}%` }}
            />
            <span
              className={`oa-callout ${focus === c.tier ? "is-focus" : ""} ${c.sx < 0 ? "is-left" : "is-right"} ${c.sy < 0 ? "is-top" : "is-bottom"}`}
              style={{ [c.sx < 0 ? "left" : "right"]: `${50 - END}%`, top: `${50 + c.sy * K}%` }}
            >
              {TIER_INFO[c.tier].name}
              <b>{TIER_COUNTS[c.tier].toLocaleString("en-US")}</b>
            </span>
          </span>
        );
      })}
    </div>
  );
}

/** The legend under the globe, from the same numbers it draws. */
export function globeLegend(): string {
  const blocking = SEVERE_TIERS.reduce((n, t) => n + TIER_COUNTS[t], 0);
  return `OpenAML's lists as ${DOTS.toLocaleString("en-US")} dots. Red: Sanctioned, Blocked and Fraud, ${blocking.toLocaleString("en-US")} addresses, drawn more often than their share so they show. Dim: Flagged, ${TIER_COUNTS.flagged.toLocaleString("en-US")}.`;
}
