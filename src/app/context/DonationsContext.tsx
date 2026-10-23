"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { SimplePool } from "nostr-tools";
import { nutnovemberPubkey, ZAP_RECEIPT_PUBKEY } from "@/pubkey";

// Only zaps paid after this count toward Nut November 2026, so last year's
// donations stay out of the pool.
const DONATIONS_SINCE = Math.floor(Date.UTC(2026, 0, 1) / 1000);

const PRIZE_KEYS = ["golden", "hardest", "nuttiest", "design", "fresh"] as const;

export type PrizeKey = (typeof PRIZE_KEYS)[number];

// OpenCash's 400,000 sat commitment seeds each prize. Donations then add to
// it, split evenly across the prizes.
const SPONSOR_PRIZES: Record<PrizeKey, number> = {
  golden: 150_000,
  hardest: 100_000,
  nuttiest: 50_000,
  design: 50_000,
  fresh: 50_000,
};
const SPONSOR_TOTAL = Object.values(SPONSOR_PRIZES).reduce((sum, amount) => sum + amount, 0);

interface DonationsContextType {
  donations: number[];
  allDonations: number[];
  /** The whole pool: the sponsor commitment plus donations. */
  total: number;
  /** Donations alone. */
  donationTotal: number;
  sortedDonations: number[];
  isLoading: boolean;
  prizes: Record<PrizeKey, number>;
}

const DonationsContext = createContext<DonationsContextType | undefined>(
  undefined
);

export function DonationsProvider({ children }: { children: ReactNode }) {
  const [donations, setDonations] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    // The same zap receipt arrives once per relay; count each event once.
    const seen = new Set<string>();
    const pool = new SimplePool();
    const relays = [
      "wss://relay.damus.io",
      "wss://relay.snort.social",
      "wss://relay.primal.net",
    ];

    const sub = pool.subscribeMany(
      relays,
      {
        "#p": [nutnovemberPubkey],
        kinds: [9735],
        authors: [ZAP_RECEIPT_PUBKEY],
        since: DONATIONS_SINCE,
      },
      {
        onevent: (event) => {
          if (
            !isMounted ||
            event.pubkey !== ZAP_RECEIPT_PUBKEY ||
            seen.has(event.id)
          ) return;
          seen.add(event.id);

          const receiptTag = event.tags.find((tag) => tag[0] === "description");
          if (receiptTag) {
            try {
              const receipt = receiptTag[1];
              const parsed = JSON.parse(receipt);
              const amountTag = parsed.tags.find(
                (tag: string[]) => tag[0] === "amount"
              );
              if (amountTag) {
                const amount = Number(amountTag[1]) / 1000;
                setDonations((prev) => {
                  return [...prev, amount];
                });
              }
            } catch (error) {
              console.error("Error parsing receipt:", error);
            }
          }
        },
        oneose: () => {
          // Called when initial batch of events is done loading
          if (isMounted) {
            setIsLoading(false);
          }
        },
      }
    );

    return () => {
      isMounted = false;
      sub.close();
    };
  }, []);

  const allDonations = donations;
  const donationTotal = allDonations.reduce((sum, amount) => sum + amount, 0);
  const total = SPONSOR_TOTAL + donationTotal;
  const sortedDonations = [...allDonations].sort((a, b) => b - a);
  const donationShare = Math.floor(donationTotal / PRIZE_KEYS.length);
  const prizes = Object.fromEntries(
    PRIZE_KEYS.map((k) => [k, SPONSOR_PRIZES[k] + donationShare])
  ) as Record<PrizeKey, number>;

  return (
    <DonationsContext.Provider
      value={{
        donations,
        allDonations,
        total,
        donationTotal,
        sortedDonations,
        isLoading,
        prizes,
      }}
    >
      {children}
    </DonationsContext.Provider>
  );
}

export function useDonations() {
  const context = useContext(DonationsContext);
  if (context === undefined) {
    throw new Error("useDonations must be used within a DonationsProvider");
  }
  return context;
}
