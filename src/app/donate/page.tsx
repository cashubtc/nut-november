"use client";

import { nutnovemberPubkey } from "@/pubkey";
import { finalizeEvent, generateSecretKey, nip19, nip57 } from "nostr-tools";
import Link from "next/link";
import { FormEvent, useState } from "react";
import PacketPage, {
  PriceTag,
  field,
  fieldError,
  fieldHint,
  fieldLabel,
  primaryButton,
} from "../components/PacketPage";
import { useDonations } from "../context/DonationsContext";
import SuccessMessage from "./components/SuccessMessage";
import InvoiceDisplay from "./components/InvoiceDisplay";
import { useReceiptSubscription } from "./hooks/useReceiptSubscription";

const PRESETS = [21, 1000, 21000];
const RELAYS = ["wss://relay.damus.io", "wss://relay.snort.social", "wss://relay.primal.net"];

function Page() {
  const { total, basePool } = useDonations();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoice, setInvoice] = useState<string | null>(null);
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const isPaid = useReceiptSubscription(receiptId);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    const sats = Number(amount);
    if (!Number.isInteger(sats) || sats < 1) {
      setError("Enter a whole number of sats, 1 or more.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const zap = nip57.makeZapRequest({
      pubkey: nutnovemberPubkey,
      amount: sats * 1000,
      relays: RELAYS,
    });
    const signed = finalizeEvent(zap, generateSecretKey());
    const npub = nip19.npubEncode(nutnovemberPubkey);

    try {
      const res = await fetch(
        `https://npubx.cash/.well-known/lnurlp/${npub}?amount=${sats * 1000}&nostr=${encodeURIComponent(
          JSON.stringify(signed)
        )}`
      );
      const data = (await res.json()) as { pr?: string; reason?: string };
      if (!res.ok || !data.pr) throw new Error(data.reason ?? `HTTP ${res.status}`);
      setReceiptId(signed.id);
      setInvoice(data.pr);
    } catch (err) {
      console.error("Error fetching invoice:", err);
      setError("We couldn't create an invoice. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack() {
    setInvoice(null);
    setReceiptId(null);
  }

  function handleReset() {
    setInvoice(null);
    setReceiptId(null);
    setAmount("");
  }

  if (isPaid) {
    return (
      <PacketPage title="Thank you!">
        <SuccessMessage amount={Number(amount)} onReset={handleReset} />
      </PacketPage>
    );
  }

  return (
    <PacketPage
      title="Grow the prize pool"
      intro="Every sat you send is split evenly across the five prizes."
    >
      <div className="flex flex-col items-center gap-3">
        <PriceTag>
          {Math.round(total + basePool).toLocaleString("en-US")}
          <span className="font-mono text-base font-bold uppercase tracking-[0.14em] sm:text-xl">sats</span>
        </PriceTag>
        <p className="mt-2 font-mono text-sm font-bold uppercase tracking-[0.16em] text-bark">in the pool now</p>
      </div>

      <div className="mx-auto mt-12 max-w-md">
        {invoice ? (
          <InvoiceDisplay invoice={invoice} amount={Number(amount)} onBack={handleBack} />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <fieldset>
              <legend className={fieldLabel}>Pick an amount</legend>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {PRESETS.map((p) => {
                  const on = amount === String(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setAmount(String(p));
                        setError(null);
                      }}
                      className={`border-4 border-bark px-2 py-3 font-mono text-base font-bold tabular-nums transition-colors sm:text-lg ${
                        on ? "bg-bark text-cream" : "bg-cream text-bark hover:bg-white"
                      }`}
                    >
                      {p.toLocaleString("en-US")}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-col gap-2">
              <label htmlFor="amount" className={fieldLabel}>
                Or type your own
              </label>
              <div className="relative">
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError(null);
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "amount-error" : "amount-hint"}
                  className={`${field} pr-20 font-mono tabular-nums`}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-5 flex items-center font-mono text-lg font-bold text-bark"
                >
                  sats
                </span>
              </div>
              {error ? (
                <p id="amount-error" role="alert" className={fieldError}>
                  {error}
                </p>
              ) : (
                <p id="amount-hint" className={fieldHint}>
                  You&apos;ll get a Lightning invoice to pay from any wallet.
                </p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className={`${primaryButton} mt-2 self-center`}>
              {isSubmitting ? "Creating invoice…" : "Get invoice"}
            </button>
          </form>
        )}
      </div>

      <p className="mt-12 text-center">
        <Link href="/donations" className="font-semibold text-bark underline decoration-2 underline-offset-4 hover:text-pumpkin-dark">
          See every donation so far
        </Link>
      </p>
    </PacketPage>
  );
}

export default Page;
