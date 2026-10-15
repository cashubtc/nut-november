"use client";

import Link from "next/link";
import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  RefObject,
  useId,
  useRef,
} from "react";
import CircularText from "./CircularText";
import NutParticles from "./NutParticles";
import { useDonations } from "../context/DonationsContext";
import { DATES_LABEL, usePhase } from "../lib/hackathon";

const display: CSSProperties = { fontFamily: "var(--font-sauce-tm)", letterSpacing: "0.05em" };
const wordmarkSize =
  "text-[76px] sm:text-[96px] md:text-[120px] lg:text-[150px] xl:text-[170px] leading-[0.85]";

function Wordmark() {
  return (
    <>
      NUT
      <br />
      NOVEMBER
    </>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { total } = useDonations();
  const phase = usePhase();
  const outlineId = `hero-outline-${useId().replace(/[^\w-]/g, "")}`;
  // Pointer position drives the foil's shine. Written straight to the
  // wordmark once per frame, without re-rendering (Safari stuttered).
  const foilRef = useRef<HTMLDivElement>(null);
  const lightFrame = useRef<number | null>(null);

  const status =
    phase?.kind === "upcoming"
      ? `Starts in ${phase.days} ${phase.days === 1 ? "day" : "days"}`
      : phase?.kind === "live"
        ? `${phase.daysLeft} ${phase.daysLeft === 1 ? "day" : "days"} left to submit`
        : phase?.kind === "over"
          ? "Submissions are closed"
          : null;
  const live = phase?.kind === "live";

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    if (lightFrame.current !== null) cancelAnimationFrame(lightFrame.current);
    lightFrame.current = requestAnimationFrame(() => {
      lightFrame.current = null;
      const el = foilRef.current;
      if (!el) return;
      el.style.setProperty("--mx", `${50 + x * 60}%`);
      el.style.setProperty("--my", `${40 + y * 60}%`);
      el.style.setProperty("--hx", `${x * 6}%`);
      el.style.setProperty("--hy", `${y * 6}%`);
    });
  };

  return (
    <section
      ref={heroRef}
      onPointerMove={onPointerMove}
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden hero-autumn px-5 pt-20 pb-16 sm:p-12 md:p-16"
    >
      {/* The master seed packet. Its hard shadow follows the zigzag silhouette. */}
      <div className="relative z-20 w-full max-w-6xl [filter:drop-shadow(10px_10px_0_var(--bark))]">
        <div className="packet-edge bg-bark p-1">
          <div className="packet-edge relative bg-cream-deep px-6 pt-14 pb-16 text-center sm:px-12 sm:pt-20 sm:pb-20">
            {/* Foil wordmark: the letters are cut out of the packet paper
                (same layering as the prize cards). The isolate group keeps
                the blends inside the wordmark. */}
            <div ref={foilRef} className="relative isolate mx-auto w-fit">
              <div className="prize-holo absolute inset-0" data-finish="gold" aria-hidden>
                <span className="prize-holo-bands" />
                <span className="prize-holo-foil" />
                <span className="prize-holo-glare" />
              </div>
              <h1 className={`relative bg-white text-black mix-blend-screen ${wordmarkSize}`} style={display}>
                <Wordmark />
              </h1>
              <div
                aria-hidden
                className={`absolute inset-0 bg-cream-deep text-white mix-blend-multiply ${wordmarkSize}`}
                style={display}
              >
                <Wordmark />
              </div>
              {/* One outline around the whole word (see PrizeCard) */}
              <svg width="0" height="0" className="absolute" aria-hidden>
                <filter id={outlineId} x="-5%" y="-10%" width="110%" height="120%">
                  <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="fat" />
                  <feMorphology in="SourceAlpha" operator="erode" radius="0.6" result="thin" />
                  <feComposite in="fat" in2="thin" operator="out" result="ring" />
                  <feFlood floodColor="#5C2E12" />
                  <feComposite in2="ring" operator="in" />
                </filter>
              </svg>
              <div
                aria-hidden
                className={`absolute inset-0 text-bark [transform:translateZ(0)] ${wordmarkSize}`}
                style={{ ...display, filter: `url(#${outlineId})` }}
              >
                <Wordmark />
              </div>
            </div>

            <p className="mx-auto mt-7 max-w-[30ch] text-xl sm:text-2xl font-medium text-bark text-balance">
              A month-long hackathon for Cashu builders
            </p>

            {/* The prize pool, as the packet's price tag */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="-rotate-2 inline-flex items-baseline gap-3 bg-pumpkin px-6 py-3 font-extrabold leading-none text-cream tabular-nums shadow-[6px_6px_0_var(--bark)] text-4xl sm:text-6xl">
                {Math.round(total).toLocaleString("en-US")}
                <span className="font-mono text-base font-bold uppercase tracking-[0.14em] sm:text-xl">
                  sats
                </span>
              </p>
              <p className="mt-2 font-mono text-sm font-bold uppercase tracking-[0.16em] text-bark">
                in prizes
              </p>
              {status && (
                <p className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-pumpkin-dark">
                  {status}
                </p>
              )}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
              <Link
                href={live ? "/form" : "#prizes"}
                className="inline-block px-10 py-5 btn-sticker bg-pumpkin text-white font-bold border-4 border-pumpkin hover:bg-pumpkin-dark text-lg font-mono"
              >
                {live ? "Submit your project" : "See the prizes"}
              </Link>
              <a
                href={live ? "#prizes" : "#participate"}
                className="font-mono text-lg font-bold text-bark underline decoration-2 underline-offset-4 hover:text-pumpkin-dark"
              >
                {live ? "See the prizes" : "How it works"}
              </a>
            </div>
          </div>
        </div>

        {/* The dates, stuck on like a label at the bottom edge */}
        <p className="absolute -bottom-5 left-1/2 -translate-x-1/2 sm:left-10 sm:translate-x-0 -rotate-3 whitespace-nowrap bg-bark px-5 py-2 font-mono font-bold uppercase tracking-[0.2em] text-cream-deep text-sm sm:text-base shadow-[4px_4px_0_var(--pumpkin)]">
          {DATES_LABEL}
        </p>

        {/* Circular sticker, overlapping the top-right corner */}
        <div className="absolute -top-12 -right-3 z-30 origin-top-right scale-[0.7] sm:-top-8 sm:-right-8 sm:scale-100 md:-top-10 md:-right-10">
          <div className="bg-bark rounded-full border-4 border-cream p-1">
            <CircularText />
          </div>
        </div>
      </div>

      <NutParticles heroSectionRef={heroRef as RefObject<HTMLElement>} />
    </section>
  );
}
