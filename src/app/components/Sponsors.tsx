"use client";

import Image from "next/image";
import Link from "next/link";
import { useDonations } from "../context/DonationsContext";
import { formatSats } from "../lib/hackathon";

export default function Sponsors() {
  const { total, basePool, allDonations, isLoading } = useDonations();

  return (
    <section id="sponsors" className="harvest px-6 py-24 text-cream">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <h2
            className="text-5xl sm:text-6xl leading-[0.95]"
            style={{ fontFamily: "var(--font-sauce-tm)" }}
          >
            Grow the prize pool
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-cream">
            Send sats over Lightning and they&apos;re split evenly across all five prizes.
          </p>

          <p
            className="mt-10 text-5xl font-extrabold leading-none tabular-nums sm:text-6xl"
            aria-live="polite"
          >
            {formatSats(total + basePool)}
          </p>
          <p className="mt-3 font-mono text-sm font-bold uppercase tracking-[0.14em] text-cream">
            {isLoading
              ? "Counting zaps…"
              : allDonations.length === 0
                ? "No donations yet. Be the first."
                : `From ${allDonations.length} ${allDonations.length === 1 ? "donation" : "donations"} so far`}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/donate"
              className="inline-block border-4 border-bark bg-cream px-10 py-5 text-center font-mono text-lg font-bold text-bark btn-sticker hover:bg-white"
            >
              Donate sats
            </Link>
            <Link
              href="/donations"
              className="inline-block border-4 border-cream px-10 py-5 text-center font-mono text-lg font-bold text-cream transition-colors hover:bg-cream/10"
            >
              See all donations
            </Link>
          </div>
        </div>

        <div className="lg:justify-self-end">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.14em] text-cream">
            Sponsored by
          </p>
          <a
            href="https://opencash.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rotate-2 border-4 border-bark bg-cream p-6 card-sticker transition-transform hover:rotate-0"
          >
            <Image
              src="/open-cash-logo.png"
              alt="OpenCash"
              width={200}
              height={100}
              className="h-auto max-w-full"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
