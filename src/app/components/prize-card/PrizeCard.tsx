"use client";

import Image from "next/image";
import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { peelAt, Point, toClipPath } from "./peelGeometry";
import { playSnap, PeelVoice, startPeel } from "./peelSound";
import type { PrizeCardData } from "./prizes";

// Lanyard-pass silhouette: rounded corners, a slot for the clip and two
// notches marking the tear-off stub. Drawn on a 500×800 box, which matches the
// card's 5:8 aspect ratio so the mask never distorts.
const SHAPE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 800" preserveAspectRatio="none"><path fill="#fff" fill-rule="evenodd" d="M28 0H472A28 28 0 0 1 500 28V582A18 18 0 0 0 500 618V772A28 28 0 0 1 472 800H28A28 28 0 0 1 0 772V618A18 18 0 0 0 0 582V28A28 28 0 0 1 28 0ZM211 30H289A11 11 0 0 1 289 52H211A11 11 0 0 1 211 30Z"/></svg>`;
const SHAPE_URL = `url("data:image/svg+xml,${encodeURIComponent(SHAPE)}")`;
const shapeMask: CSSProperties = {
  maskImage: SHAPE_URL,
  WebkitMaskImage: SHAPE_URL,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
};

const MAX_TILT = 12;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function PrizeCard({
  prize,
  amount,
}: {
  prize: PrizeCardData;
  amount: number;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [corner, setCorner] = useState<Point | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });
  const [visible, setVisible] = useState(false);

  const cornerRef = useRef<Point | null>(null);
  const drag = useRef<{
    offset: Point;
    last: Point;
    travelled: number;
    voice: PeelVoice | null;
  } | null>(null);
  const anim = useRef<number | null>(null);
  const hold = useRef<number | null>(null);
  const [peeling, setPeeling] = useState(false);

  const rest = useCallback(
    (w: number): Point => ({ x: w - w * 0.075, y: w * 0.075 }),
    []
  );

  const moveCorner = useCallback((p: Point) => {
    cornerRef.current = p;
    setCorner(p);
  }, []);

  // Track the card's pixel size; the peel maths needs real dimensions.
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
      if (!drag.current && anim.current === null && hold.current === null)
        moveCorner(rest(width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [moveCorner, rest]);

  // Only animate the artwork while the card is on screen.
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "100px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (anim.current !== null) cancelAnimationFrame(anim.current);
      if (hold.current !== null) clearTimeout(hold.current);
    },
    []
  );

  const local = (e: ReactPointerEvent): Point => {
    const r = sceneRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const clampCorner = (p: Point): Point => ({
    x: Math.min(size.w - 1, Math.max(-size.w * 0.9, p.x)),
    y: Math.min(size.h * 1.4, Math.max(1, p.y)),
  });

  const stopAnim = () => {
    if (anim.current !== null) cancelAnimationFrame(anim.current);
    if (hold.current !== null) clearTimeout(hold.current);
    anim.current = null;
    hold.current = null;
  };

  /** Ease the corner back onto the card and slap it down. */
  const springBack = () => {
    stopAnim();
    const home = rest(size.w);
    const from = cornerRef.current ?? home;
    const distance = Math.hypot(from.x - home.x, from.y - home.y);
    const step = () => {
      const cur = cornerRef.current ?? home;
      const next = { x: cur.x + (home.x - cur.x) * 0.2, y: cur.y + (home.y - cur.y) * 0.2 };
      if (Math.hypot(home.x - next.x, home.y - next.y) < 0.5) {
        moveCorner(home);
        anim.current = null;
        if (distance > 30) playSnap(distance / size.h);
        return;
      }
      moveCorner(next);
      anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  };

  /** Tap or keyboard: peel most of the way, hold, then let go. */
  const autoPeel = () => {
    stopAnim();
    const from = cornerRef.current ?? rest(size.w);
    const to = { x: size.w * 0.12, y: size.h * 0.62 };
    const voice = startPeel();
    const t0 = performance.now();
    const duration = 520;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - k, 3);
      moveCorner({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e });
      voice?.update((1 - e) * 30);
      if (k < 1) {
        anim.current = requestAnimationFrame(step);
      } else {
        voice?.stop();
        anim.current = null;
        hold.current = window.setTimeout(springBack, 1100);
      }
    };
    anim.current = requestAnimationFrame(step);
  };

  const onHandleDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!size.w) return;
    e.preventDefault();
    stopAnim();
    e.currentTarget.setPointerCapture(e.pointerId);
    setTilt({ x: 0, y: 0, active: false });
    const p = local(e);
    const c = cornerRef.current ?? rest(size.w);
    drag.current = {
      offset: { x: p.x - c.x, y: p.y - c.y },
      last: p,
      travelled: 0,
      voice: startPeel(),
    };
    setPeeling(true);
  };

  const onHandleMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const p = local(e);
    const speed = Math.hypot(p.x - d.last.x, p.y - d.last.y);
    d.travelled += speed;
    d.last = p;
    d.voice?.update(speed);
    moveCorner(clampCorner({ x: p.x - d.offset.x, y: p.y - d.offset.y }));
  };

  const onHandleUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    setPeeling(false);
    d.voice?.stop();
    if (d.travelled < 4) autoPeel();
    else springBack();
  };

  const onSceneMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || drag.current || prefersReducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -ny * 2 * MAX_TILT, y: nx * 2 * MAX_TILT, active: true });
  };

  const peel = size.w && corner ? peelAt(size.w, size.h, corner) : null;
  const keptClip = peel ? toClipPath(peel.kept) : undefined;

  const amountLabel = `₿${amount.toLocaleString("en-US")}`;

  return (
    <div
      ref={sceneRef}
      className="prize-card-scene relative w-full aspect-[5/8] [perspective:1100px] select-none"
      onPointerMove={onSceneMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0, active: false })}
      style={
        {
          "--hue": `${tilt.y * 6}deg`,
          "--mx": `${50 + tilt.y * 3}%`,
          "--my": `${50 - tilt.x * 3}%`,
          containerType: "inline-size",
        } as CSSProperties
      }
    >
      <div
        className="prize-card relative h-full w-full"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: peeling
            ? "none"
            : `transform ${tilt.active ? 120 : 600}ms cubic-bezier(.2,.8,.2,1)`,
        }}
      >
        {/* Everything that lives inside the card silhouette */}
        <div className="absolute inset-0 overflow-hidden" style={shapeMask}>
          {/* 1. The art: drifting colour blobs and the prize nut */}
          <div
            className="prize-art absolute inset-0"
            data-paused={visible ? undefined : ""}
            style={
              {
                background: prize.palette.base,
                "--c1": prize.palette.c1,
                "--c2": prize.palette.c2,
                "--c3": prize.palette.c3,
              } as CSSProperties
            }
          >
            <span className="prize-art-blob prize-art-blob-1" />
            <span className="prize-art-blob prize-art-blob-2" />
            <span className="prize-art-blob prize-art-blob-3" />
            <div className="prize-art-nut absolute left-[10%] top-[30%] w-[80%] aspect-square">
              <Image
                src={prize.art}
                alt=""
                fill
                sizes="(min-width: 1024px) 320px, 80vw"
                className="object-contain"
                draggable={false}
              />
            </div>
          </div>

          {/* 2. The sticker: black with white type, multiplied over the art so
                 the art only shows through the lettering. */}
          <div
            className="absolute inset-0 bg-black mix-blend-multiply"
            style={{ clipPath: keptClip }}
          >
            <p
              className="absolute inset-x-0 top-[13.5%] text-center text-white leading-none whitespace-nowrap"
              style={{
                fontFamily: "var(--font-sauce-tm)",
                fontSize: `${Math.min(35, 86 / (prize.word.length * 0.42))}cqw`,
              }}
            >
              {prize.word}
            </p>
          </div>

          {/* 3. The print: sits on the sticker (and peels with it) but isn't blended */}
          <div
            className="absolute inset-0 text-white"
            style={{ clipPath: keptClip }}
            aria-hidden
          >
            <TreeRings />
            <div className="absolute left-[7%] right-[7%] top-[9.5%] flex justify-between font-mono font-bold uppercase tracking-[0.18em] text-[2.6cqw]">
              <span>Nut November</span>
              <span>Nov 1–30 · 2026</span>
            </div>

            <div className="absolute left-[7%] right-[7%] top-[47%] flex items-center justify-between gap-[3cqw]">
              <div className="min-w-0">
                <p
                  className="font-bold leading-tight text-[7.4cqw] truncate"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {prize.winner ?? "Could be you"}
                </p>
                <p className="mt-[1.5cqw] flex items-center gap-[2cqw] text-[3cqw] text-white/70">
                  <span className="rounded-full bg-white px-[2.2cqw] py-[0.4cqw] font-mono font-bold uppercase tracking-wider text-black text-[2.4cqw]">
                    Winner
                  </span>
                  <span className="truncate">{prize.title}</span>
                </p>
              </div>
              <FoilSeal />
            </div>

            <div className="absolute left-[7%] right-[7%] top-[62%] grid grid-cols-[1.25fr_1fr_1fr] gap-[2cqw]">
              <Field label="Amount" value={amountLabel} />
              <Field label="Deadline" value="Nov 30" />
              <Field label="Track" value={prize.track} />
            </div>

            <div className="absolute left-[5%] right-[5%] top-[75%] border-t-2 border-dashed border-white/25" />

            <div className="absolute left-[7%] right-[7%] top-[79%] bottom-[5%] flex flex-col justify-between">
              <p className="text-[3.3cqw] leading-snug text-white/80">{prize.blurb}</p>
              <div className="flex justify-between font-mono font-bold uppercase tracking-[0.18em] text-[2.6cqw]">
                <span>No. {prize.number}</span>
                <span>One winner</span>
              </div>
            </div>
          </div>

          {/* Tilt sheen across the whole card */}
          <div className="prize-card-sheen pointer-events-none absolute inset-0" />
        </div>

        {/* The lifted flap, mirrored across the fold */}
        {peel && (
          <div className="pointer-events-none absolute inset-0 [filter:drop-shadow(-4px_8px_10px_rgba(0,0,0,0.45))]">
            <div
              className="absolute inset-0 origin-top-left"
              style={{
                ...shapeMask,
                clipPath: toClipPath(peel.lifted),
                transform: peel.mirror,
                background: peel.shading,
              }}
            />
          </div>
        )}

        <button
          type="button"
          aria-label={`Peel back the ${prize.title} sticker`}
          className="absolute right-0 top-0 z-10 h-[20%] w-[20%] cursor-grab touch-none rounded-tr-[6%] outline-none focus-visible:ring-4 focus-visible:ring-pumpkin active:cursor-grabbing"
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              autoPeel();
            }
          }}
        />
      </div>
      <p className="sr-only">
        {prize.title}: {amountLabel}. {prize.blurb}
      </p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="font-mono uppercase tracking-[0.16em] text-white/55 text-[2.3cqw]">
        {label}
      </p>
      <p
        className="mt-[0.6cqw] font-semibold truncate text-[3.8cqw]"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {value}
      </p>
    </div>
  );
}

/** Holographic seal whose colours shift as the card tilts. */
function FoilSeal() {
  const points = 18;
  const outer = 50;
  const inner = 44;
  const d =
    Array.from({ length: points * 2 }, (_, i) => {
      const r = i % 2 ? inner : outer;
      const a = (Math.PI * i) / points;
      return `${i ? "L" : "M"}${(50 + r * Math.sin(a)).toFixed(2)} ${(50 - r * Math.cos(a)).toFixed(2)}`;
    }).join("") + "Z";
  const seal = `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${d}" fill="#fff"/></svg>`
  )}")`;
  return (
    <div className="relative w-[19cqw] shrink-0 aspect-square">
      <div
        className="prize-card-foil absolute inset-0"
        style={{ maskImage: seal, WebkitMaskImage: seal, maskSize: "100%", WebkitMaskSize: "100%" }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-[8cqw] drop-shadow">
        🌰
      </span>
    </div>
  );
}

/** Tree-ring line art standing in for the original's wireframe globe. */
function TreeRings() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute -right-[38%] top-[18%] w-[118%] opacity-30"
      fill="none"
      stroke="white"
      strokeWidth="1"
    >
      {Array.from({ length: 11 }, (_, i) => {
        const r = 18 + i * 17;
        const wobble = 3 + i * 0.8;
        const pts = Array.from({ length: 49 }, (_, j) => {
          const a = (j / 48) * Math.PI * 2;
          const rr = r + Math.sin(a * 3 + i) * wobble * 0.6 + Math.cos(a * 5 - i * 0.7) * wobble * 0.4;
          return `${(200 + rr * Math.cos(a) * 1.08).toFixed(1)},${(200 + rr * Math.sin(a)).toFixed(1)}`;
        });
        return <polyline key={i} points={pts.join(" ")} />;
      })}
      <path d="M200 200 L398 150 M200 200 L330 395" strokeDasharray="3 5" />
    </svg>
  );
}
