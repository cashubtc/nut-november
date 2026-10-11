"use client";

import Image from "next/image";
import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { peelAt, Point, toClipPath } from "./peelGeometry";
import { playSnap, PeelVoice, startPeel } from "./peelSound";
import type { PrizeCardData } from "./prizes";

// Seed-packet silhouette: a pinked (zig-zag) top edge where the packet was
// cut, and rounded bottom corners. Drawn on a 500×630 box, which matches the
// card's 50:63 aspect ratio so the mask never distorts.
const TEETH = 25;
const PINKED_EDGE = Array.from({ length: TEETH * 2 + 1 }, (_, i) =>
  `L${(i * 500) / (TEETH * 2)} ${i % 2 ? 0 : 9}`
).join("");
const SHAPE_PATH = `M0 9${PINKED_EDGE}V604A26 26 0 0 1 474 630H26A26 26 0 0 1 0 604Z`;
const SHAPE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 630" preserveAspectRatio="none"><path fill="#fff" d="${SHAPE_PATH}"/></svg>`;
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
      className="prize-card-scene relative w-full aspect-[50/63] [perspective:1100px] select-none"
      onPointerMove={onSceneMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0, active: false })}
      style={
        {
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
            <div className="prize-art-nut absolute left-[10%] top-[26%] w-[80%] aspect-square">
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

          {/* 2. The sticker: cream paper with black type, screen-blended over the
                 art. Screen keeps light paper light and lets black show the art
                 untouched, so the art only comes through the lettering (and,
                 faintly, through the darker print dots). */}
          <div
            className="prize-sticker absolute inset-0 mix-blend-screen"
            style={{ clipPath: keptClip }}
          >
            <p
              className="absolute inset-x-0 top-[15.5%] text-center text-black leading-none whitespace-nowrap"
              style={{
                fontFamily: "var(--font-sauce-tm)",
                fontSize: `${Math.min(35, 86 / (prize.word.length * 0.42))}cqw`,
              }}
            >
              {prize.word}
            </p>
          </div>

          {/* Warms the white paper to cream (and the art in the letters with it).
                 Its own layer: the print's clip-path would isolate the blend. */}
          <div
            className="prize-paper-tint absolute inset-0"
            style={{ clipPath: keptClip }}
          />

          {/* 3. The print: sits on the sticker (and peels with it) but isn't blended */}
          <div
            className="absolute inset-0 text-bark"
            style={{ clipPath: keptClip }}
            aria-hidden
          >
            {/* Chunky outline around the knockout word, like the hero type */}
            <p
              className="prize-word-outline absolute inset-x-0 top-[15.5%] text-center leading-none whitespace-nowrap"
              style={{
                fontFamily: "var(--font-sauce-tm)",
                fontSize: `${Math.min(35, 86 / (prize.word.length * 0.42))}cqw`,
              }}
            >
              {prize.word}
            </p>

            <div className="absolute left-[7%] right-[7%] top-[7.5%] flex items-center justify-between font-mono font-bold uppercase tracking-[0.18em] text-[2.6cqw]">
              <span>Nut November Seed Co.</span>
              <span className="mr-[9cqw] -rotate-3 bg-bark px-[2cqw] py-[0.8cqw] text-cream-deep">
                No. {prize.number}
              </span>
            </div>

            <div className="absolute left-[7%] right-[7%] top-[50%] flex items-center justify-between gap-[3cqw]">
              <div className="min-w-0">
                <p
                  className="font-bold leading-tight text-[7cqw]"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {prize.title}
                </p>
                <p className="mt-[1.5cqw] text-[3.4cqw] leading-snug text-bark/75">
                  {prize.blurb}
                </p>
              </div>
              <NuttyStamp />
            </div>

            <div className="absolute left-[7%] right-[7%] bottom-[6%] grid grid-cols-[1.3fr_1fr_1fr] gap-[2cqw] border-t-[0.6cqw] border-bark pt-[3cqw]">
              <Field label="Net wt" value={amountLabel} />
              <Field label="Sow by" value="Nov 30" />
              <Field label="Variety" value={prize.track} />
            </div>

            {/* Thick packet outline; half the stroke falls outside the mask */}
            <svg
              viewBox="0 0 500 630"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              fill="none"
            >
              <path d={SHAPE_PATH} stroke="var(--bark)" strokeWidth="12" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Tilt sheen across the whole card */}
          <div className="prize-card-sheen pointer-events-none absolute inset-0" />
        </div>

        {/* The lifted flap, mirrored across the fold */}
        {peel && (
          <div className="pointer-events-none absolute inset-0">
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
      <p className="font-mono font-bold uppercase tracking-[0.16em] text-pumpkin text-[2.3cqw]">
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

/** The hero's "100% nutty" sticker, shrunk down for the packet. */
function NuttyStamp() {
  const ringId = useId();
  return (
    <div className="relative w-[25cqw] shrink-0 aspect-square rotate-6 rounded-full border-[0.9cqw] border-cream-deep bg-bark outline outline-[0.6cqw] outline-bark">
      <span className="absolute inset-0 flex items-center justify-center text-[7cqw]">
        🌰
      </span>
      <svg viewBox="0 0 100 100" className="prize-stamp-ring absolute inset-0">
        <defs>
          <path id={ringId} d="M50 50m-34 0a34 34 0 1 0 68 0a34 34 0 1 0-68 0" />
        </defs>
        <text
          fill="currentColor"
          style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10.5px", fontWeight: 700, letterSpacing: "1.2px" }}
        >
          <textPath href={`#${ringId}`}>100% NUTTY • CERTIFIED ORGANIC •</textPath>
        </text>
      </svg>
    </div>
  );
}
