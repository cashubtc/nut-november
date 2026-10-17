import Link from "next/link";
import CircularText from "../../components/CircularText";
import { primaryButton, secondaryButton } from "../../components/PacketPage";
import { useDonations } from "../../context/DonationsContext";
import { formatSats } from "../../lib/hackathon";

interface SuccessMessageProps {
  amount: number;
  onReset: () => void;
}

export default function SuccessMessage({ amount, onReset }: SuccessMessageProps) {
  const { total } = useDonations();

  return (
    <div role="status" className="flex flex-col items-center gap-8 text-center">
      <div className="sticker-lift rounded-full border-4 border-cream bg-bark p-1">
        <CircularText />
      </div>

      <div className="space-y-3">
        <p className="text-2xl font-semibold text-bark-dark text-balance">
          {amount > 0 ? `${formatSats(amount)} just landed in the pool.` : "Your sats just landed in the pool."}
        </p>
        <p className="text-lg text-bark/85">
          It&apos;s now <strong className="font-semibold tabular-nums">{formatSats(total)}</strong>, split
          across all five prizes. 🥜
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Link href="/#prizes" className={primaryButton}>
          See the prizes
        </Link>
        <button type="button" onClick={onReset} className={secondaryButton}>
          Donate again
        </button>
      </div>
    </div>
  );
}
