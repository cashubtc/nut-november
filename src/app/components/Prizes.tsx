"use client";
import Link from "next/link";
import { useDonations } from "../context/DonationsContext";
import PrizeCard from "./prize-card/PrizeCard";
import { prizeCards } from "./prize-card/prizes";

export default function Prizes() {
  const { prizes } = useDonations();

  return (
    <section
      id="prizes"
      className="py-20 px-6 bg-cream border-t border-bark"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Mobile Title - shows on top for mobile only */}
        <h2 className="text-base font-semibold text-bark/70 font-mono tracking-[0.2em] mb-6 md:hidden">
          PRIZES
        </h2>
        {/* Vertical Label - hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-shrink-0 w-16 sm:w-20 md:w-24 items-center justify-center">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-bark/70 font-mono tracking-[0.2em] whitespace-nowrap transform -rotate-90 origin-center">
            PRIZES
          </h2>
        </div>
        {/* Main Content */}
        <div className="flex-1 md:pl-12 lg:pl-16">
          <p className="mb-10 font-mono text-bark/70 text-sm sm:text-base">
            Five passes. Five winners. Grab a corner and peel ↗
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14 mb-16">
            {prizeCards.map((card) => (
              <div key={card.key} className="mx-auto w-full max-w-[340px]">
                <PrizeCard prize={card} amount={prizes[card.key]} />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/form"
              className="inline-block px-10 py-5 btn-sticker bg-white text-pumpkin font-bold border-4 border-pumpkin hover:bg-pumpkin-wash text-lg font-mono"
            >
              Submit Your Project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
