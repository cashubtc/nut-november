"use client";

import Link from "next/link";
import { RefObject, useRef } from "react";
import CircularText from "./CircularText";
import NutParticles from "./NutParticles";
import { useDonations } from "../context/DonationsContext";
import { DATES_LABEL, formatSats, usePhase } from "../lib/hackathon";

const primaryBtn =
  "inline-block px-10 py-5 btn-sticker bg-pumpkin text-white font-bold border-4 border-pumpkin hover:bg-pumpkin-dark text-lg font-mono";
const secondaryBtn =
  "inline-block px-10 py-5 btn-sticker bg-white text-pumpkin font-bold border-4 border-pumpkin hover:bg-pumpkin-wash text-lg font-mono";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { total, basePool } = useDonations();
  const phase = usePhase();

  const status =
    phase?.kind === "upcoming"
      ? `Starts in ${phase.days} ${phase.days === 1 ? "day" : "days"}`
      : phase?.kind === "live"
        ? `${phase.daysLeft} ${phase.daysLeft === 1 ? "day" : "days"} left to submit`
        : phase?.kind === "over"
          ? "Submissions are closed"
          : null;

  // Submitting only leads while the hackathon is running.
  const submitLeads = phase?.kind === "live";

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden hero-autumn p-6 sm:p-8 md:p-12 lg:p-16"
    >
      <div className="relative z-20 bg-cream border-4 border-bark card-sticker px-6 pt-10 pb-14 sm:p-12 sm:pb-16 md:p-16 md:pb-20 max-w-6xl w-full text-center">
        <h1
          className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[140px] leading-[0.85] text-pumpkin"
          style={{ fontFamily: "var(--font-sauce-tm)", letterSpacing: "0.05em" }}
        >
          <span className="inline-block animate-slide-up">NUT</span>
          <br />
          <span className="inline-block animate-slide-up-delay">NOVEMBER</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[28ch] text-2xl sm:text-3xl font-medium text-bark text-balance">
          A month-long hackathon for Cashu builders.
        </p>

        <p className="mt-4 text-lg sm:text-xl text-bark/80">
          <strong className="font-semibold text-bark-dark tabular-nums">
            {formatSats(total + basePool)}
          </strong>{" "}
          in prizes
          {status && (
            <span className="block sm:inline">
              <span aria-hidden className="mx-2 hidden text-pumpkin sm:inline">
                ●
              </span>
              {status}
            </span>
          )}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          {submitLeads ? (
            <>
              <Link href="/form" className={primaryBtn}>
                Submit your project
              </Link>
              <a href="#prizes" className={secondaryBtn}>
                See the prizes
              </a>
            </>
          ) : (
            <>
              <a href="#prizes" className={primaryBtn}>
                See the prizes
              </a>
              <a href="#participate" className={secondaryBtn}>
                How it works
              </a>
            </>
          )}
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
