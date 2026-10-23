import type { ReactNode } from "react";

/** Reserve the final text's font metrics without displaying a guessed value. */
export default function LoadingText({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden className="relative">
      <span className="invisible">{children}</span>
      <span className="absolute inset-x-0 top-[0.15em] bottom-[0.05em] rounded-sm bg-current opacity-15" />
    </span>
  );
}
