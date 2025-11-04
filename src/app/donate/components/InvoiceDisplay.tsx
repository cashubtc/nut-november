import { useEffect, useRef, useState } from "react";
import QRCodeSVG from "react-qr-code";

interface InvoiceDisplayProps {
  invoice: string;
  onCopyInvoice: () => void;
  onBack: () => void;
}

export default function InvoiceDisplay({
  invoice,
  onCopyInvoice,
  onBack,
}: InvoiceDisplayProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = () => {
    onCopyInvoice();
    setCopied(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Waiting for payment indicator */}
      <p
        className="text-lg sm:text-xl text-gray-600 font-mono animate-pulse"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        Waiting for payment...
      </p>

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
          onClick={handleCopy}
          className={`inline-block px-8 py-4 text-white font-bold border-4 text-lg font-mono transition-all ${
            copied
              ? "bg-green-500 border-green-500 hover:bg-green-600"
              : "bg-[#B7CF4F] border-[#B7CF4F] hover:bg-[#9fb63e]"
          }`}
        >
          {copied ? "Copied!" : "Copy Invoice"}
        </button>
        <button
          onClick={onBack}
          className="inline-block px-8 py-4 bg-gray-500 text-white font-bold border-4 border-gray-500 hover:bg-gray-600 text-lg font-mono"
        >
          Back
        </button>
      </div>
    </div>
  );
}
