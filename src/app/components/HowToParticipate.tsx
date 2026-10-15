"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePhase } from "../lib/hackathon";

const shareText = "Cashu builders are going nuts this November. https://nutnovember.org/ #NutNovember";
const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

const link = "font-semibold text-pumpkin underline decoration-2 hover:text-pumpkin-dark";

const steps: { title: string; body: ReactNode }[] = [
  {
    title: "Pick a project",
    body: "Find a Cashu project on GitHub to contribute to, or start your own. No idea is too nutty.",
  },
  {
    title: "Build it",
    body: "Make a new tool, improve an existing one, or fix the bug that's been driving you nuts.",
  },
  {
    title: "Share your progress",
    body: (
      <>
        Post updates on Nostr or X with #NutNovember so the community can follow along.{" "}
        <a href={shareUrl} target="_blank" rel="noopener noreferrer" className={link}>
          Post on X
        </a>
      </>
    ),
  },
  {
    title: "Submit by Nov 30",
    body: (
      <>
        Send your project in before the end of November 30.{" "}
        <Link href="/form" className={link}>
          Open the submission form
        </Link>
      </>
    ),
  },
];

const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

export default function HowToParticipate() {
  const phase = usePhase();
  // Day of November it is now, while the hackathon is running.
  const today = phase?.kind === "live" ? phase.day : null;
  const over = phase?.kind === "over";

  return (
    <section id="participate" className="bg-cream px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2
          className="text-5xl sm:text-6xl leading-[0.95] text-bark"
          style={{ fontFamily: "var(--font-sauce-tm)" }}
        >
          How it works
        </h2>

        {/* November, day by day */}
        <figure className="mt-12">
          <ol
            className="grid grid-cols-10 gap-1.5 sm:gap-2 lg:grid-cols-[repeat(30,minmax(0,1fr))]"
            aria-label="November 2026"
          >
            {DAYS.map((day) => {
              const isLast = day === 30;
              const isToday = day === today;
              const isPast = over || (today !== null && day < today);
              return (
                <li
                  key={day}
                  aria-current={isToday ? "date" : undefined}
                  className={[
                    "flex aspect-square items-center justify-center rounded-[3px] border-2 font-mono text-xs font-bold tabular-nums sm:text-sm",
                    isLast
                      ? "border-pumpkin bg-pumpkin text-white"
                      : isToday
                        ? "border-bark bg-bark text-cream"
                        : isPast
                          ? "border-bark/25 bg-cream-deep text-bark/50"
                          : "border-bark/25 text-bark",
                  ].join(" ")}
                >
                  {day}
                </li>
              );
            })}
          </ol>
          <figcaption className="mt-3 flex flex-col gap-1 font-mono text-sm font-bold uppercase tracking-[0.14em] text-bark sm:flex-row sm:justify-between">
            <span>Nov 1 · Kickoff</span>
            <span className="text-pumpkin">Nov 30 · Submissions close</span>
          </figcaption>
        </figure>

        <ol className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="border-t-4 border-bark pt-5">
              <p className="font-mono text-sm font-bold text-pumpkin tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-bark-dark">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-bark-dark/85">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
