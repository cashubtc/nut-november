"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { nostrPool } from "@/nostr-pool";
import { nutnovemberPubkey, ZAP_RECEIPT_PUBKEY } from "@/pubkey";
import { ZAP_RELAYS } from "@/zap-relays";
import { createDonationStore, type DonationSnapshot } from "../lib/donations";
import { createDonorProfileStore } from "../lib/donorProfiles";

export type { PrizeKey } from "../lib/donations";

// Only zaps paid after this count toward Nut November 2026, so last year's
// donations stay out of the pool.
const DONATIONS_SINCE = Math.floor(Date.UTC(2026, 0, 1) / 1000);

const donationStore = createDonationStore({
  policy: {
    recipient: nutnovemberPubkey,
    receiptAuthor: ZAP_RECEIPT_PUBKEY,
    since: DONATIONS_SINCE,
  },
  getStorage: () => window.localStorage,
  connect(handlers) {
    const sub = nostrPool.subscribeMany(
      ZAP_RELAYS,
      {
        "#p": [nutnovemberPubkey],
        kinds: [9735],
        authors: [ZAP_RECEIPT_PUBKEY],
        since: DONATIONS_SINCE,
      },
      { ...handlers, maxWait: 10_000 }
    );
    return () => {
      void sub.close();
    };
  },
});

const donorProfileStore = createDonorProfileStore({
  donations: donationStore,
  getStorage: () => window.localStorage,
  connect(authors, handlers) {
    const sub = nostrPool.subscribeManyEose(ZAP_RELAYS, { kinds: [0], authors }, {
      ...handlers,
      maxWait: 10_000,
    });
    return () => {
      void sub.close();
    };
  },
});

const DonationsContext = createContext<typeof donationStore | undefined>(
  undefined
);

export function DonationsProvider({ children }: { children: ReactNode }) {
  // Own the sync for the lifetime of the app, including client-side navigation.
  // Additional readers share this connection through the store's subscriptions.
  useEffect(() => donationStore.subscribe(() => {}), []);
  useEffect(() => donorProfileStore.subscribe(() => {}), []);
  return <DonationsContext.Provider value={donationStore}>{children}</DonationsContext.Provider>;
}

export function useDonorProfiles() {
  return useSyncExternalStore(donorProfileStore.subscribe, donorProfileStore.getSnapshot, donorProfileStore.getServerSnapshot);
}

function useDonations(): DonationSnapshot {
  const store = useContext(DonationsContext);
  if (store === undefined) {
    throw new Error("DonationData must be used within a DonationsProvider");
  }
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

function DonationDataContent({ children }: { children: (data: DonationSnapshot) => ReactNode }) {
  return children(useDonations());
}

const DonationFallbackContext = createContext<ReactNode>(null);

function DonationFallback() {
  return useContext(DonationFallbackContext);
}

// Every live donation display uses this boundary: first render from localStorage,
// then update from the provider's shared relay sync. Keep static page content on
// the server and bundle this component eagerly, without an extra chunk fetch.
const ClientDonationData = dynamic(() => Promise.resolve(DonationDataContent), {
  ssr: false,
  loading: DonationFallback,
});

export function DonationData({ children, fallback = null }: {
  children: (data: DonationSnapshot) => ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <DonationFallbackContext.Provider value={fallback}>
      <ClientDonationData>{children}</ClientDonationData>
    </DonationFallbackContext.Provider>
  );
}
