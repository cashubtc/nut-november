/** The site's flat outlined acorn, for stickers and stamps. */
export default function Acorn({ className }: { className?: string }) {
  return (
    <svg viewBox="-1 -1.05 2 2.1" className={className} aria-hidden>
      <g stroke="#5C2E12" strokeWidth="0.09" strokeLinejoin="round">
        <ellipse cx="0" cy="0.18" rx="0.6" ry="0.72" fill="#C98A4B" />
        <path d="M-0.78 -0.28 A0.78 0.42 0 0 1 0.78 -0.28 A0.78 0.14 0 0 1 -0.78 -0.28 Z" fill="#7A4A22" />
      </g>
      <rect x="-0.07" y="-0.95" width="0.14" height="0.28" fill="#5C2E12" />
    </svg>
  );
}
