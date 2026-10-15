"use client";
import Link from "next/link";
import { useDonations } from "../context/DonationsContext";
import { formatSats } from "../lib/hackathon";
import PrizeCard from "./prize-card/PrizeCard";
import { prizeCards } from "./prize-card/prizes";

export default function Prizes() {
  const { prizes, total, basePool } = useDonations();

  return (
    <section id="prizes" className="bg-cream-deep px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div>
          <h2
            className="text-5xl sm:text-6xl leading-[0.95] text-bark"
            style={{ fontFamily: "var(--font-sauce-tm)" }}
          >
            The prizes
          </h2>
          <p className="mt-5 max-w-[52ch] text-lg sm:text-xl text-bark-dark/90">
            Five prizes, paid in sats, from a{" "}
            <strong className="font-semibold tabular-nums">
              {formatSats(total + basePool)}
            </strong>{" "}
            pool that grows with every donation.
          </p>
        </div>

        <ul className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-14">
          {prizeCards.map((card) => (
            <li key={card.key} className="w-full max-w-[340px]">
              <PrizeCard prize={card} amount={prizes[card.key]} />
            </li>
          ))}
        </ul>

        <div className="mt-16 text-center">
          <Link
            href="/form"
            className="inline-block px-10 py-5 btn-sticker bg-white text-pumpkin font-bold border-4 border-pumpkin hover:bg-pumpkin-wash text-lg font-mono"
          >
            Submit your project
          </Link>
        </div>
      </div>
    </section>
  );
}
