"use client";

import Image from "next/image";
import Link from "next/link";
import { useDonations } from "../context/DonationsContext";
import { formatSats } from "../lib/hackathon";

export default function Sponsors() {
  const { total, allDonations, isLoading } = useDonations();

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
            OpenCash seeded the pool with 400,000 sats. Send sats over Lightning and they&apos;re split evenly across all five prizes on top.
          </p>

          <p
            className="mt-10 text-5xl leading-none font-extrabold font-stretch-expanded tracking-[-0.01em] tabular-nums sm:text-6xl"
            aria-live="polite"
          >
            {formatSats(total)}
          </p>
          <p className="mt-3 text-lg text-cream">
            {isLoading
              ? "Counting zaps…"
              : allDonations.length === 0
                ? "From OpenCash. No donations yet, be the first."
                : `From OpenCash and ${allDonations.length} ${allDonations.length === 1 ? "donation" : "donations"} so far.`}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/donate"
              className="inline-block bg-cream px-8 py-4 text-center text-lg font-bold text-bark transition-colors duration-150 hover:bg-white"
            >
              Donate sats
            </Link>
            <Link
              href="/donations"
              className="inline-block border-2 border-cream px-8 py-[14px] text-center text-lg font-bold text-cream transition-colors duration-150 hover:bg-cream hover:text-bark"
            >
              See all donations
            </Link>
          </div>
        </div>

        <div className="lg:justify-self-end">
          <p className="text-lg font-bold font-stretch-condensed uppercase tracking-[0.04em] text-cream">
            Sponsored by
          </p>
          <a
            href="https://opencash.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block bg-cream p-6 transition-colors duration-150 hover:bg-white"
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
