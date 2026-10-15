"use client";

import { useSyncExternalStore } from "react";

// Nut November 2026 runs Nov 1–27 (UTC).
export const STARTS_AT = Date.UTC(2026, 10, 1);
export const ENDS_AT = Date.UTC(2026, 10, 28); // submissions close at the end of Nov 27
/** Shown wherever the deadline is spelled out. */
export const DEADLINE_LABEL = "Nov 27, 23:59 UTC";
export const DATES_LABEL = "Nov 1–27, 2026";

export type Phase =
  | { kind: "upcoming"; days: number }
  | { kind: "live"; daysLeft: number }
  | { kind: "over" };

const DAY = 86_400_000;

export function phaseAt(now: number): Phase {
  if (now < STARTS_AT) return { kind: "upcoming", days: Math.ceil((STARTS_AT - now) / DAY) };
  if (now < ENDS_AT) return { kind: "live", daysLeft: Math.ceil((ENDS_AT - now) / DAY) };
  return { kind: "over" };
}

// Snapshots must be stable between renders, so the store hands out a string
// key and the hook turns it back into a Phase.
const phaseKey = () => JSON.stringify(phaseAt(Date.now()));

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 60 * 60 * 1000);
  return () => window.clearInterval(id);
}

/**
 * Where we are in the hackathon. Null on the server and first paint (the page
 * is prerendered, so "now" is only known in the browser).
 */
export function usePhase(): Phase | null {
  const key = useSyncExternalStore(subscribe, phaseKey, () => null);
  return key ? (JSON.parse(key) as Phase) : null;
}

/** "437,335 sats" — prize money is always shown in sats. */
export function formatSats(n: number) {
  const r = Math.round(n);
  return `${r.toLocaleString("en-US")} ${r === 1 ? "sat" : "sats"}`;
}
