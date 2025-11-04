"use client";

import { nutnovemberPubkey } from "@/pubkey";
import {
  finalizeEvent,
  generateSecretKey,
  getPublicKey,
  nip19,
  nip57,
} from "nostr-tools";
import { useRef, useState } from "react";
import QRCodeSVG from "react-qr-code";

function Page() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<string | null>(null);

  const amountRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    setIsSubmitting(true);
    setInvoice(null);

    const amount = amountRef.current?.value;
    if (!amount) {
      return;
    }

    const sk = generateSecretKey();

    const zap = nip57.makeZapRequest({
      pubkey: nutnovemberPubkey,
      amount: Number(amount) * 1000,
      relays: [
        "wss://relay.damus.io",
        "wss://relay.snort.social",
        "wss://relay.primal.net",
      ],
    });
    const signed = finalizeEvent(zap, sk);
    const npub = nip19.npubEncode(nutnovemberPubkey);

    try {
      const req = await fetch(
        `https://npubx.cash/.well-known/lnurlp/${npub}?amount=${
          Number(amount) * 1000
        }&nostr=${encodeURIComponent(JSON.stringify(signed))}`
      );

      const data = (await req.json()) as { pr: string };

      setInvoice(data.pr);
    } catch (error) {
      console.error("Error fetching invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCopyInvoice() {
    if (invoice) {
      navigator.clipboard.writeText(invoice);
    }
  }

  function handleBack() {
    setInvoice(null);
    setIsSubmitting(false);
    if (amountRef.current) {
      amountRef.current.value = "";
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#B7CF4F] p-6 sm:p-8 md:p-12 lg:p-16">
      <div className="relative z-20 bg-[#FAFAFA] border-4 border-[#B7CF4F] p-8 sm:p-12 md:p-16 lg:p-20 max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1
            className="text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px] font-bold leading-[0.85] tracking-wider text-[#B7CF4F] mb-4"
            style={{
              fontFamily: "var(--font-sauce-tm)",
              letterSpacing: "0.05em",
            }}
          >
            DONATE TO THE PRIZE POOL
          </h1>
          <p
            className="text-xl sm:text-2xl md:text-3xl text-gray-500 mb-8 uppercase"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Share your nuts with the community
          </p>
        </div>

        {invoice ? (
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white p-6 border-4 border-[#B7CF4F]">
              <QRCodeSVG
                value={invoice}
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            </div>
            <div className="bg-green-100 border-4 border-green-500 p-4 text-green-800 font-mono text-sm break-all max-w-full">
              {invoice}
            </div>
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={handleCopyInvoice}
                className="inline-block px-8 py-4 bg-[#B7CF4F] text-white font-bold border-4 border-[#B7CF4F] hover:bg-[#9fb63e] text-lg font-mono"
              >
                Copy Invoice
              </button>
              <button
                onClick={handleBack}
                className="inline-block px-8 py-4 bg-gray-500 text-white font-bold border-4 border-gray-500 hover:bg-gray-600 text-lg font-mono"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="amount"
                className="text-lg font-bold text-[#B7CF4F] font-mono"
              >
                Amount
              </label>
              <input
                type="number"
                ref={amountRef}
                id="amount"
                name="amount"
                className="border-4 border-[#B7CF4F] bg-white p-4 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B7CF4F] focus:ring-offset-2 font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => handleSubmit()}
              className="inline-block px-10 py-5 bg-[#B7CF4F] text-white font-bold border-4 border-[#B7CF4F] hover:bg-[#9fb63e] disabled:opacity-50 disabled:cursor-not-allowed text-lg font-mono mt-4 self-center"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default Page;
