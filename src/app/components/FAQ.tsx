"use client";

import { ReactNode, useId, useState } from "react";

const link = "font-semibold text-pumpkin underline decoration-2 hover:text-pumpkin-dark";

const faqs: { question: string; answer: ReactNode }[] = [
  {
    question: "Do I need to be a developer?",
    answer:
      "No. Designers, writers and community builders are all welcome. If you can contribute to Cashu in any way, you're in.",
  },
  {
    question: "What if my nut isn't finished?",
    answer:
      "Submit it anyway. Half-cracked nuts are still nuts, and progress counts for more than polish.",
  },
  {
    question: "Is this serious or a joke?",
    answer: "Yes. It's a real hackathon with real prizes, but we don't take ourselves too seriously.",
  },
  {
    question: "Why nuts?",
    answer: "Because Cashu. And 'No Nut November' exists, so we're flipping it and going nuts for ecash.",
  },
  {
    question: "What's Cashu?",
    answer: (
      <>
        <a href="https://cashu.space/" target="_blank" rel="noopener noreferrer" className={link}>
          Cashu
        </a>{" "}
        is a Chaumian ecash protocol for Bitcoin. It&apos;s private, works offline, and is backed by
        bitcoin: digital cash with real privacy.
      </>
    ),
  },
  {
    question: "Can I submit more than one project?",
    answer: "Yes, as many as you can build, as long as each one stands on its own.",
  },
  {
    question: "What if I've never used Cashu before?",
    answer: (
      <>
        Perfect time to start. Read the{" "}
        <a href="https://docs.cashu.space/" target="_blank" rel="noopener noreferrer" className={link}>
          docs
        </a>
        , join the community and dive in. There&apos;s a prize just for first-time contributors.
      </>
    ),
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section id="faq" className="bg-cream px-6 pb-24">
      <div className="mx-auto grid max-w-6xl gap-10 border-t-4 border-bark pt-20 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <h2
            className="text-5xl sm:text-6xl leading-[0.95] text-bark"
            style={{ fontFamily: "var(--font-sauce-tm)" }}
          >
            Questions
          </h2>
          <p className="mt-6 max-w-[32ch] text-lg leading-relaxed text-bark-dark/85">
            Something else on your mind? Ask in the{" "}
            <a href="https://t.me/CashuBTC" target="_blank" rel="noopener noreferrer" className={link}>
              Cashu Telegram
            </a>{" "}
            or on{" "}
            <a
              href="https://primal.net/p/nprofile1qqs0y3tvskgs9gpgxxu5ahgz3fmms3rzmxt504qceqtz4a6pdgfwlkghwl6j8"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              Nostr
            </a>
            .
          </p>
        </div>

        <ul className="border-b-2 border-bark">
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            const panelId = `${baseId}-${i}`;
            return (
              <li key={faq.question} className="border-t-2 border-bark">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold text-bark-dark transition-colors hover:text-pumpkin sm:text-xl"
                  >
                    {faq.question}
                    {/* plus that turns into a minus */}
                    <span aria-hidden className="relative h-4 w-4 shrink-0">
                      <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded bg-current" />
                      <span
                        className={`absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded bg-current transition-transform duration-300 ${
                          open ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  inert={!open}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[60ch] pb-6 text-lg leading-relaxed text-bark-dark/85">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
