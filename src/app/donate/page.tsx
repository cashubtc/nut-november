"use client";

import { nutnovemberPubkey } from "@/pubkey";
import { finalizeEvent, generateSecretKey, nip19, nip57 } from "nostr-tools";
import type { WindowNostr } from "nostr-tools/nip07";
import Link from "next/link";
import { FormEvent, useState, useSyncExternalStore } from "react";
import PacketPage, {
  PoolAmount,
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
const MESSAGE_THRESHOLD = 1000;
const MESSAGE_MAX_LENGTH = 280;
const RELAYS = ["wss://relay.damus.io", "wss://relay.snort.social", "wss://relay.primal.net"];

function hasNostrSigner() {
  return typeof (window as Window & { nostr?: WindowNostr }).nostr?.signEvent === "function";
}

function subscribeToSigner(onChange: () => void) {
  // Extensions can inject their signer after the page has hydrated.
  const interval = window.setInterval(onChange, 1000);
  window.addEventListener("focus", onChange);
  return () => {
    window.clearInterval(interval);
    window.removeEventListener("focus", onChange);
  };
}

function Page() {
  const { total } = useDonations();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const canAddMessage = Number.isInteger(Number(amount)) && Number(amount) > MESSAGE_THRESHOLD;
  const [error, setError] = useState<string | null>(null);
  const [preferredIdentity, setIdentity] = useState<"anonymous" | "profile">("anonymous");
  const hasSigner = useSyncExternalStore(subscribeToSigner, hasNostrSigner, () => false);
  const identity = hasSigner ? preferredIdentity : "anonymous";
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<"signing" | "invoice" | null>(null);
  const isSubmitting = submission !== null;
  const [invoice, setInvoice] = useState<string | null>(null);
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const isPaid = useReceiptSubscription(receiptId);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setSubmissionError(null);
    const sats = Number(amount);
    if (!Number.isInteger(sats) || sats < 1) {
      setError("Enter a whole number of sats, 1 or more.");
      return;
    }

    setError(null);
    setSubmission(identity === "profile" ? "signing" : "invoice");

    try {
      const zap = nip57.makeZapRequest({
        pubkey: nutnovemberPubkey,
        amount: sats * 1000,
        relays: RELAYS,
        comment: sats > MESSAGE_THRESHOLD ? message.trim() : "",
      });
      let signed;
      if (identity === "profile") {
        const signer = (window as Window & { nostr?: WindowNostr }).nostr;
        if (!signer || typeof signer.signEvent !== "function") {
          setSubmissionError("No Nostr signing extension found. Enable your extension and try again, or choose Anonymous.");
          return;
        }
        try {
          signed = await signer.signEvent(zap);
        } catch {
          setSubmissionError("Your extension didn't sign the donation request. Try again, or choose Anonymous.");
          return;
        }
      } else {
        signed = finalizeEvent(zap, generateSecretKey());
      }

      setSubmission("invoice");
      const npub = nip19.npubEncode(nutnovemberPubkey);
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
      setSubmissionError("We couldn't create an invoice. Check your connection and try again.");
    } finally {
      setSubmission(null);
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
    setMessage("");
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
      <PoolAmount sats={total}>sats in the pool now</PoolAmount>

      <div className="mx-auto mt-12 max-w-md">
        {invoice ? (
          <InvoiceDisplay invoice={invoice} amount={Number(amount)} onBack={handleBack} />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <fieldset disabled={isSubmitting}>
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
                      className={`border-2 border-bark px-2 py-3 text-base font-bold tabular-nums transition-colors sm:text-lg ${
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
                  disabled={isSubmitting}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError(null);
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "amount-error" : "amount-hint"}
                  className={`${field} pr-20 tabular-nums`}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-lg font-bold text-bark"
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

            <fieldset disabled={isSubmitting} aria-describedby="identity-hint">
              <legend className={fieldLabel}>Donate as</legend>
              <div className="mt-3 flex flex-col gap-3">
                {([
                  ["anonymous", "Anonymous"],
                  ["profile", "My Nostr profile"],
                ] as const).filter(([value]) => value === "anonymous" || hasSigner).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-3 text-lg font-semibold text-bark-dark">
                    <input
                      type="radio"
                      name="identity"
                      value={value}
                      checked={identity === value}
                      onChange={() => {
                        setIdentity(value);
                        setSubmissionError(null);
                      }}
                      className="h-5 w-5 accent-bark"
                    />
                    {label}
                  </label>
                ))}
              </div>
              <p id="identity-hint" className={`${fieldHint} mt-3`}>
                {identity === "anonymous"
                  ? "Your Nostr profile won't be attached. The donation amount will still be public."
                  : "Requires a Nostr signing extension. Your donation will be publicly linked to the profile you sign with."}
              </p>
            </fieldset>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className={fieldLabel}>
                Message (optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                maxLength={MESSAGE_MAX_LENGTH}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!canAddMessage || isSubmitting}
                aria-describedby="message-hint message-count"
                className={`${field} resize-y disabled:cursor-not-allowed disabled:bg-bark/5 disabled:opacity-60`}
              />
              <p id="message-hint" className={fieldHint}>
                {canAddMessage
                  ? "Your message will be public on Nostr, even if you donate anonymously."
                  : "Donate more than 1,000 sats to unlock a public message with your donation."}
              </p>
              <p id="message-count" className={`${fieldHint} text-right tabular-nums`}>
                {message.length}/{MESSAGE_MAX_LENGTH} characters
              </p>
            </div>

            {submissionError && (
              <p role="alert" className={fieldError}>{submissionError}</p>
            )}

            <button type="submit" disabled={isSubmitting} className={`${primaryButton} mt-2 self-center`}>
              {submission === "signing" ? "Confirm in your extension…" : submission === "invoice" ? "Creating invoice…" : "Get invoice"}
            </button>
          </form>
        )}
      </div>

      <p className="mt-12 text-center">
        <Link href="/donations" className="font-semibold text-pumpkin-dark hover:text-bark">
          See every donation so far
        </Link>
      </p>
    </PacketPage>
  );
}

export default Page;
