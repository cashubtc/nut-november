import { useEffect, useState } from "react";
import { Event, SimplePool } from "nostr-tools";
import { nutnovemberPubkey } from "@/pubkey";

export function useReceiptSubscription(receiptId: string | null) {
  const [isPaid, setIsPaid] = useState<boolean>(false);

  useEffect(() => {
    // Reset isPaid when receiptId changes or becomes null
    setIsPaid(false);

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

    console.log(receiptId);
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
              console.log(parsed);
              if (parsed.id === receiptId && isMounted) {
                console.log("Receipt found");
                setIsPaid(true);
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

  return isPaid;
}
