import { nip57, verifyEvent, type Event } from "nostr-tools";

export interface Donation {
  id: string;
  amount: number;
  content: string;
  createdAt: number;
}

interface DonationPolicy {
  recipient: string;
  receiptAuthor: string;
  since: number;
}

const PRIZE_KEYS = ["golden", "hardest", "nuttiest", "design", "fresh"] as const;
export type PrizeKey = (typeof PRIZE_KEYS)[number];

// OpenCash seeds the pool; donations are shared equally across the five prizes.
const SPONSOR_PRIZES: Record<PrizeKey, number> = {
  golden: 150_000,
  hardest: 100_000,
  nuttiest: 50_000,
  design: 50_000,
  fresh: 50_000,
};
const SPONSOR_TOTAL = Object.values(SPONSOR_PRIZES).reduce((sum, amount) => sum + amount, 0);

export interface DonationSnapshot {
  donations: Donation[];
  donationCount: number;
  donationTotal: number;
  /** Sponsor commitment plus donations. */
  total: number;
  prizes: Record<PrizeKey, number>;
  isLoading: boolean;
}

function summarize(donations: Donation[], isLoading: boolean): DonationSnapshot {
  const donationTotal = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const donationShare = Math.floor(donationTotal / PRIZE_KEYS.length);
  return {
    donations,
    donationCount: donations.length,
    donationTotal,
    total: SPONSOR_TOTAL + donationTotal,
    prizes: Object.fromEntries(
      PRIZE_KEYS.map((key) => [key, SPONSOR_PRIZES[key] + donationShare])
    ) as Record<PrizeKey, number>,
    isLoading,
  };
}

interface ReceiptHandlers {
  onevent: (event: Event) => void;
  oneose: () => void;
}

type CacheStorage = Pick<Storage, "getItem" | "setItem">;

// Both cached and relayed receipts go through the same trust and amount checks.
export function parseDonation(value: unknown, policy: DonationPolicy): Donation | null {
  try {
    const event = value as Event;
    if (
      !event ||
      event.kind !== 9735 ||
      event.pubkey !== policy.receiptAuthor ||
      !Number.isSafeInteger(event.created_at) ||
      event.created_at < policy.since ||
      !verifyEvent(event)
    ) return null;

    const recipientTags = event.tags.filter(([name]) => name === "p");
    if (recipientTags.length !== 1 || recipientTags[0][1] !== policy.recipient) return null;

    const descriptions = event.tags.filter(([name]) => name === "description");
    const invoices = event.tags.filter(([name]) => name === "bolt11");
    if (descriptions.length !== 1 || invoices.length !== 1) return null;

    const request = JSON.parse(descriptions[0][1]) as Event;
    if (request.kind !== 9734 || !verifyEvent(request)) return null;
    const requestedRecipients = request.tags.filter(([name]) => name === "p");
    if (requestedRecipients.length !== 1 || requestedRecipients[0][1] !== policy.recipient) return null;

    const amount = nip57.getSatoshisAmountFromBolt11(invoices[0][1].toLowerCase());
    const millisats = Math.round(amount * 1000);
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isSafeInteger(millisats) || millisats < 1) return null;

    // The request amount is optional in NIP-57. When present it must match the invoice.
    const requestedAmounts = request.tags.filter(([name]) => name === "amount");
    if (requestedAmounts.length > 1) return null;
    if (requestedAmounts.length === 1) {
      const requestedAmount = requestedAmounts[0][1];
      if (!/^\d+$/.test(requestedAmount) || Number(requestedAmount) !== millisats) return null;
    }

    return {
      id: event.id,
      amount: millisats / 1000,
      content: millisats > 1_000_000 ? Array.from(request.content.trim()).slice(0, 256).join("") : "",
      createdAt: event.created_at,
    };
  } catch {
    return null;
  }
}

export function createDonationStore({
  policy,
  getStorage,
  connect,
}: {
  policy: DonationPolicy;
  getStorage: () => CacheStorage;
  connect: (handlers: ReceiptHandlers) => () => void;
}) {
  const cacheKey = `nutnovember:donations:v1:${policy.recipient}:${policy.receiptAuthor}:${policy.since}`;
  const records = new Map<string, { event: Event; donation: Donation }>();
  const listeners = new Set<() => void>();
  const serverSnapshot = summarize([], true);
  let snapshot = serverSnapshot;
  let cacheLoaded = false;
  let disconnect: (() => void) | undefined;

  function makeSnapshot(isLoading: boolean): DonationSnapshot {
    return summarize(
      [...records.values()].map(({ donation }) => donation).sort(
        (a, b) => b.amount - a.amount || b.createdAt - a.createdAt || a.id.localeCompare(b.id)
      ),
      isLoading
    );
  }

  function update(isLoading = snapshot.isLoading) {
    snapshot = makeSnapshot(isLoading);
    listeners.forEach((listener) => listener());
  }

  function merge(value: unknown) {
    const donation = parseDonation(value, policy);
    if (!donation || records.has(donation.id)) return false;
    records.set(donation.id, { event: value as Event, donation });
    return true;
  }

  function persist() {
    try {
      getStorage().setItem(cacheKey, JSON.stringify([...records.values()].map(({ event }) => event)));
    } catch {
      // Storage can be unavailable or full; keep the live list usable in memory.
    }
  }

  function loadCache() {
    if (cacheLoaded) return;
    cacheLoaded = true;
    try {
      const cached: unknown = JSON.parse(getStorage().getItem(cacheKey) ?? "[]");
      if (Array.isArray(cached)) cached.forEach(merge);
    } catch {
      // A corrupt cache must not prevent a fresh relay sync.
    }
    // Read once for the very first client render, without starting network work
    // or notifying React subscribers during render.
    snapshot = makeSnapshot(records.size === 0);
  }

  function start() {
    loadCache();

    let active = true;
    const close = connect({
      onevent(event) {
        if (!active || !merge(event)) return;
        persist();
        update(false);
      },
      oneose() {
        if (active) update(false);
      },
    });
    return () => {
      active = false;
      close();
    };
  }

  return {
    getSnapshot: () => {
      loadCache();
      return snapshot;
    },
    getServerSnapshot: () => serverSnapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (listeners.size === 1) disconnect = start();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          disconnect?.();
          disconnect = undefined;
        }
      };
    },
  };
}
