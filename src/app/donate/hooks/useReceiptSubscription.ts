import { useEffect, useState } from "react";
import { Event, SimplePool } from "nostr-tools";
import { nutnovemberPubkey } from "@/pubkey";

export function useReceiptSubscription(receiptId: string | null) {
  // The receipt we've seen paid; a new receiptId is unpaid until proven.
  const [paidId, setPaidId] = useState<string | null>(null);

  useEffect(() => {
    if (!receiptId) {
      return;
    }

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
        since: Math.floor(Date.now() / 1000) - 60,
      },
      {
        onevent: (event: Event) => {
          if (!isMounted) return;

          const receiptTag = event.tags.find((tag) => tag[0] === "description");
          if (receiptTag) {
            try {
              const receipt = receiptTag[1];
              const parsed = JSON.parse(receipt);
              if (parsed.id === receiptId && isMounted) {
                setPaidId(receiptId);
              }
            } catch (error) {
              console.error("Error parsing receipt:", error);
            }
          }
        },
      }
    );

    // Cleanup function
    return () => {
      isMounted = false;
      sub.close();
      pool.close(relays);
    };
  }, [receiptId]);

  return receiptId !== null && paidId === receiptId;
}
