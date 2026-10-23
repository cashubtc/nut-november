import { useEffect, useState } from "react";
import type { Event } from "nostr-tools";
import { nostrPool } from "@/nostr-pool";
import { nutnovemberPubkey, ZAP_RECEIPT_PUBKEY } from "@/pubkey";
import { ZAP_RELAYS } from "@/zap-relays";

export function useReceiptSubscription(receiptId: string | null) {
  // The receipt we've seen paid; a new receiptId is unpaid until proven.
  const [paidId, setPaidId] = useState<string | null>(null);

  useEffect(() => {
    if (!receiptId) {
      return;
    }

    let isMounted = true;
    const sub = nostrPool.subscribeMany(
      ZAP_RELAYS,
      {
        "#p": [nutnovemberPubkey],
        kinds: [9735],
        authors: [ZAP_RECEIPT_PUBKEY],
        since: Math.floor(Date.now() / 1000) - 60,
      },
      {
        onevent: (event: Event) => {
          if (
            !isMounted ||
            event.kind !== 9735 ||
            event.pubkey !== ZAP_RECEIPT_PUBKEY
          ) return;

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
      void sub.close();
    };
  }, [receiptId]);

  return receiptId !== null && paidId === receiptId;
}
