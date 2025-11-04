interface SuccessMessageProps {
  onReset: () => void;
}

export default function SuccessMessage({ onReset }: SuccessMessageProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* Checkmark */}
      <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-[#B7CF4F] rounded-full flex items-center justify-center">
        <svg
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Success Message */}
      <div className="text-center space-y-4">
        <h2
          className="text-[32px] sm:text-[48px] md:text-[64px] font-bold text-[#B7CF4F]"
          style={{
            fontFamily: "var(--font-sauce-tm)",
            letterSpacing: "0.05em",
          }}
        >
          PAYMENT SUCCESSFUL!
        </h2>
        <p
          className="text-xl sm:text-2xl md:text-3xl text-gray-600"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Thank you for your generous donation!
        </p>
        <p
          className="text-lg sm:text-xl text-gray-500"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Your contribution helps make Nut November amazing 🥜
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onReset}
        className="inline-block px-10 py-5 bg-[#B7CF4F] text-white font-bold border-4 border-[#B7CF4F] hover:bg-[#9fb63e] text-lg font-mono transition-all"
      >
        Donate Again
      </button>
    </div>
  );
}

