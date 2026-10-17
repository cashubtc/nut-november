"use client";

import Link from "next/link";
import PacketPage, { PriceTag, primaryButton } from "../components/PacketPage";
import { useDonations } from "../context/DonationsContext";
import { formatSats } from "../lib/hackathon";

// Bigger zaps get bigger produce.
function produce(sats: number) {
  if (sats >= 10_000) return "🎃";
  if (sats >= 1_000) return "🌰";
  if (sats >= 100) return "🥜";
  return "🍂";
}

export default function Page() {
  const { allDonations, donationTotal, sortedDonations, isLoading } = useDonations();
  const count = allDonations.length;

  return (
    <PacketPage title="The harvest" intro="Every zap to the prize pool, biggest first.">
      <div className="flex flex-col items-center gap-3 text-center">
        <PriceTag>
          {Math.round(donationTotal).toLocaleString("en-US")}
          <span className="font-mono text-base font-bold uppercase tracking-[0.14em] sm:text-xl">sats</span>
        </PriceTag>
        <p className="mt-3 max-w-[44ch] text-lg text-bark-dark text-balance" aria-live="polite">
          {isLoading && count === 0 ? (
            "Counting zaps…"
          ) : (
            <>
              From {count} {count === 1 ? "donation" : "donations"} so far.
            </>
          )}
        </p>
      </div>

      {count === 0 ? (
        <p className="mt-12 text-center text-lg text-bark/85">
          {isLoading ? "Gathering the harvest…" : "Nothing in the basket yet. Be the first to donate."}
        </p>
      ) : (
        <ul className="mt-12 flex flex-wrap justify-center gap-3" aria-label="Donations, largest first">
          {sortedDonations.map((sats, i) => (
            <li
              key={i}
              className={`inline-flex items-center gap-2 border-[3px] border-bark bg-cream px-3 py-2 font-semibold text-bark-dark tabular-nums shadow-[3px_3px_0_var(--bark)] ${
                i % 3 === 0 ? "-rotate-1" : i % 3 === 1 ? "rotate-1" : ""
              } ${sats >= 10_000 ? "text-xl" : "text-base"}`}
            >
              <span aria-hidden>{produce(sats)}</span>
              {formatSats(sats)}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-14 text-center">
        <Link href="/donate" className={primaryButton}>
          Donate sats
        </Link>
      </div>
    </PacketPage>
  );
}
