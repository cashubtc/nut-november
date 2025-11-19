"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { SimplePool } from "nostr-tools";
import { nutnovemberPubkey } from "@/pubkey";

const preZapDonations = [42171, 5000, 5000, 5000, 1, 8, 10, 3, 21, 100];

const basePrizes = {
  golden: 150000,
  hardest: 80000,
  nuttiest: 60000,
  design: 50000,
  fresh: 40000,
  crowd: 20000,
};

interface DonationsContextType {
  donations: number[];
  allDonations: number[];
  total: number;
  sortedDonations: number[];
  isLoading: boolean;
  prizes: Record<keyof typeof basePrizes, number>;
}

const DonationsContext = createContext<DonationsContextType | undefined>(
  undefined
);

export function DonationsProvider({ children }: { children: ReactNode }) {
  const [donations, setDonations] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
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
      },
      {
        onevent: (event) => {
          if (!isMounted) return;

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

  // Combine preZapDonations with subscription donations
  const allDonations = [...preZapDonations, ...donations];
  const total = allDonations.reduce((sum, amount) => sum + amount, 0);
  const sortedDonations = [...allDonations].sort((a, b) => b - a);
  const prizeShare = Math.floor(total / 6);

  const prizes: Record<keyof typeof basePrizes, number> = {
    golden: 0,
    hardest: 0,
    nuttiest: 0,
    design: 0,
    fresh: 0,
    crowd: 0,
  };
  Object.entries(basePrizes).forEach(([key, value]) => {
    prizes[key as keyof typeof basePrizes] = value + prizeShare;
  });

  return (
    <DonationsContext.Provider
      value={{
        donations,
        allDonations,
        total,
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
