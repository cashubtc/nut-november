import { useEffect, useRef, useState } from "react";
import QRCodeSVG from "react-qr-code";
import { primaryButton, secondaryButton } from "../../components/PacketPage";
import { formatSats } from "../../lib/hackathon";

interface InvoiceDisplayProps {
  invoice: string;
  amount: number;
  onBack: () => void;
}

export default function InvoiceDisplay({ invoice, amount, onBack }: InvoiceDisplayProps) {
  const [copied, setCopied] = useState<"yes" | "failed" | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invoice);
      setCopied("yes");
    } catch {
      setCopied("failed");
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="text-lg font-medium text-bark">
        Scan with any Lightning wallet to send{" "}
        <strong className="font-semibold tabular-nums">{formatSats(amount)}</strong>.
      </p>

      <div className="w-full max-w-[300px] border-4 border-bark bg-white p-4">
        <QRCodeSVG
          value={invoice}
          size={256}
          fgColor="#43200C"
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          viewBox="0 0 256 256"
        />
      </div>

      <p role="status" className="flex items-center gap-2 font-mono text-base font-bold text-bark">
        <span aria-hidden className="inline-block animate-pulse motion-reduce:animate-none">🌰</span>
        Waiting for payment…
      </p>

      <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <a href={`lightning:${invoice}`} className={primaryButton}>
          Open in wallet
        </a>
        <button type="button" onClick={handleCopy} className={secondaryButton}>
          {copied === "yes" ? "Copied!" : copied === "failed" ? "Copy failed" : "Copy invoice"}
        </button>
      </div>
      <span aria-live="polite" className="sr-only">
        {copied === "yes" ? "Invoice copied" : copied === "failed" ? "Couldn't copy the invoice" : ""}
      </span>

      <button
        type="button"
        onClick={onBack}
        className="font-mono text-base font-bold text-bark underline decoration-2 underline-offset-4 hover:text-pumpkin-dark"
      >
        Change the amount
      </button>
    </div>
  );
}
