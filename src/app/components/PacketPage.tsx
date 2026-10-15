import Link from "next/link";
import { CSSProperties, ReactNode } from "react";

const display: CSSProperties = { fontFamily: "var(--font-sauce-tm)", letterSpacing: "0.03em" };

/**
 * The subpages' shell: the hero's seed packet (zigzag top, bark shadow) on the
 * dotted pumpkin field, with a way home above it.
 */
export default function PacketPage({
  title,
  intro,
  children,
}: {
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main id="main" className="hero-autumn min-h-screen px-5 pt-8 pb-20 sm:px-12 sm:pt-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-block -rotate-2 bg-bark px-4 py-2 font-mono text-base font-bold text-cream-deep shadow-[4px_4px_0_var(--bark-dark)] transition-colors hover:bg-bark-dark"
        >
          ← Nut November
        </Link>

        <div className="mt-8 [filter:drop-shadow(10px_10px_0_var(--bark))]">
          <div className="packet-edge bg-bark p-1">
            <div className="packet-edge bg-cream-deep px-6 pt-14 pb-12 sm:px-14 sm:pt-20 sm:pb-16">
              <h1
                className="text-center text-5xl leading-[0.95] text-bark text-balance sm:text-7xl"
                style={display}
              >
                {title}
              </h1>
              {intro && (
                <div className="mx-auto mt-5 max-w-[40ch] text-center text-lg font-medium text-bark text-balance sm:text-xl">
                  {intro}
                </div>
              )}
              <div className="mt-10">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/** The pumpkin price tag the hero uses for the pool, at subpage size. */
export function PriceTag({ children }: { children: ReactNode }) {
  return (
    <p className="-rotate-2 inline-flex items-baseline gap-3 bg-pumpkin px-5 py-3 text-4xl font-extrabold leading-none text-cream tabular-nums shadow-[6px_6px_0_var(--bark)] sm:text-5xl">
      {children}
    </p>
  );
}

export const field =
  "w-full border-4 border-bark bg-cream p-4 text-lg text-bark-dark placeholder:text-bark/70 aria-[invalid=true]:border-pumpkin-dark";
export const fieldLabel = "text-lg font-semibold text-bark-dark";
export const fieldHint = "text-base text-bark/85";
export const fieldError = "text-base font-semibold text-pumpkin-dark";
export const primaryButton =
  "inline-block border-4 border-pumpkin bg-pumpkin px-10 py-5 text-center font-mono text-lg font-bold text-white btn-sticker hover:bg-pumpkin-dark disabled:cursor-not-allowed disabled:opacity-60";
export const secondaryButton =
  "inline-block border-4 border-bark bg-cream px-8 py-4 text-center font-mono text-lg font-bold text-bark btn-sticker hover:bg-white";
export const textLink =
  "font-mono text-lg font-bold text-bark underline decoration-2 underline-offset-4 hover:text-pumpkin-dark";
