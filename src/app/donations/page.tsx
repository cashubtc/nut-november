"use client";

import { useEffect, useState } from "react";
import BackToHome from "../components/BackToHome";
import { nutnovemberPubkey } from "@/pubkey";
import { SimplePool } from "nostr-tools";

const preZapDontations = [42171, 5000, 5000, 5000, 1, 8, 10, 3, 21, 100];

export default function Page() {
  const [donations, setDonations] = useState<number[]>([]);

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
                setDonations((prev) => [...prev, amount]);
              }
            } catch (error) {
              console.error("Error parsing receipt:", error);
            }
          }
        },
      }
    );

    return () => {
      isMounted = false;
      sub.close();
    };
  }, []);

  // Combine preZapDonations (assumed to be in sats) with subscription donations
  // Convert preZapDonations from sats to match the format (divide by 1000 if they're in millisats, or keep as is if in sats)
  // Assuming preZapDonations are already in sats to match the subscription format
  const allDonations = [...preZapDontations, ...donations];
  const total = allDonations.reduce((sum, amount) => sum + amount, 0);
  const sortedDonations = [...allDonations].sort((a, b) => b - a);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#B7CF4F] p-6 sm:p-8 md:p-12 lg:p-16">
      <div className="relative z-20 max-w-6xl w-full flex flex-col items-center">
        <BackToHome />
        <div className="bg-[#FAFAFA] border-4 border-[#B7CF4F] p-8 sm:p-12 md:p-16 lg:p-20 w-full">
          <div className="text-center mb-8">
            <h1
              className="text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px] font-bold leading-[0.85] tracking-wider text-[#B7CF4F] mb-4"
              style={{
                fontFamily: "var(--font-sauce-tm)",
                letterSpacing: "0.05em",
              }}
            >
              DONATIONS
            </h1>
            <p
              className="text-xl sm:text-2xl md:text-3xl text-gray-500 mb-8 uppercase"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Thank you to all our contributors
            </p>
          </div>

          {/* Total Sum */}
          <div className="bg-[#B7CF4F] border-4 border-[#B7CF4F] p-6 mb-8 text-center">
            <p
              className="text-lg sm:text-xl text-gray-600 mb-2 uppercase"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Total Donations
            </p>
            <p
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ₿
              {total.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          {/* Donations List */}
          <div>
            <h2
              className="text-xl sm:text-2xl font-bold text-[#B7CF4F] mb-4 font-mono"
              style={{ fontFamily: "var(--font-sauce-tm)" }}
            >
              Donations ({allDonations.length})
            </h2>
            {allDonations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No donations yet. Be the first to contribute!
              </p>
            ) : (
              <div className="space-y-2">
                {sortedDonations.map((amount, index) => (
                  <div
                    key={index}
                    className="bg-white border-4 border-[#B7CF4F] p-4 flex justify-between items-center"
                  >
                    <span className="text-gray-700 font-mono">
                      #{index + 1}
                    </span>
                    <span className="text-gray-800 font-bold font-mono">
                      ₿
                      {amount.toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
