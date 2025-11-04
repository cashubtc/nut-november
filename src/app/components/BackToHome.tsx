import Link from "next/link";

export default function BackToHome() {
  return (
    <Link
      href="/"
      className="text-gray-700 hover:text-white transition-colors text-sm sm:text-base font-mono underline mb-4"
    >
      ← Back to Home
    </Link>
  );
}

