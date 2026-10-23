"use client";

import { PoolAmount } from "../components/PacketPage";
import { DonationData, useDonorProfiles } from "../context/DonationsContext";
import type { DonationSnapshot } from "../lib/donations";
import { formatSats } from "../lib/hackathon";
import { HIDDEN_DONATION_MESSAGE_IDS } from "../lib/donationMessages";
import DonorIdentity from "./DonorIdentity";

// Bigger zaps get bigger produce.
function produce(sats: number) {
  if (sats >= 10_000) return "🎃";
  if (sats >= 1_000) return "🌰";
  if (sats >= 100) return "🥜";
  return "🍂";
}

export default function DonationHistory() {
  return (
    <DonationData>
      {(data) => <DonationHistoryContent data={data} />}
    </DonationData>
  );
}

function DonationHistoryContent({ data }: { data: DonationSnapshot }) {
  const { donations, donationCount: count, donationTotal, isLoading } = data;
  const profiles = useDonorProfiles();
  return (
    <>
      <div className="flex flex-col items-center gap-3 text-center">
        <PoolAmount sats={donationTotal}>sats</PoolAmount>
        <p className="mt-1 max-w-[44ch] text-lg text-bark-dark text-balance" aria-live="polite">
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
        <ul className="mt-12 divide-y-2 divide-bark/20 border-y-2 border-bark/20" aria-label="Donations, largest first">
          {donations.map((donation) => (
            <li
              key={donation.id}
              className="py-5 text-bark-dark"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                <div className="flex shrink-0 items-center gap-3 text-xl font-semibold tabular-nums">
                  <span aria-hidden>{produce(donation.amount)}</span>
                  <span>{formatSats(donation.amount)}</span>
                </div>
                <DonorIdentity
                  pubkey={donation.pubkey}
                  profile={donation.pubkey && !HIDDEN_DONATION_MESSAGE_IDS.has(donation.id)
                    ? profiles.get(donation.pubkey)
                    : undefined}
                />
              </div>
              {donation.content && !HIDDEN_DONATION_MESSAGE_IDS.has(donation.id) && (
                <p className="mt-2 whitespace-pre-wrap text-base leading-relaxed [overflow-wrap:anywhere]">
                  {donation.content}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
