"use client";
import Image from "next/image";
import Link from "next/link";
import { useDonations } from "../context/DonationsContext";

export default function Prizes() {
  const { prizes: allPrizes } = useDonations();
  const prizes = [
    {
      image: "/goldennut.jpg",
      name: "The Golden Nut",
      description:
        "Best overall project. The nut that shines brightest. Grand prize for the most impressive build that pushes Cashu forward.",
      amount: allPrizes.golden,
    },
    {
      image: "/hardestnut.jpg",
      name: "Hardest Nut to Crack",
      description:
        "Toughest technical breakthrough. For the ones who refuse to give up. Rewards the most challenging technical innovation or bug fix.",
      amount: allPrizes.hardest,
    },
    {
      image: "/nuttiestidea.jpg",
      name: "The Nuttiest Idea",
      description:
        "Wildest experimental concept. Unhinged. Unhinged. Actually brilliant. Celebrates the most creative, out-of-the-box thinking.",
      amount: allPrizes.nuttiest,
    },
    {
      image: "/uxnut.jpg",
      name: "Best Design Nut",
      description:
        "Design-focused improvement. Making ecash actually usable. For projects that make Cashu more accessible and delightful.",
      amount: allPrizes.design,
    },
    {
      image: "/freshnut.jpg",
      name: "Freshly Minted Nut",
      description:
        "Best first-time contributor. Welcome to the shell game. Recognizes newcomers who made their first meaningful contribution.",
      amount: allPrizes.fresh,
    },
  ];

  return (
    <section
      id="prizes"
      className="py-20 px-6 bg-cream border-t border-bark"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Mobile Title - shows on top for mobile only */}
        <h2 className="text-base font-semibold text-bark/70 font-mono tracking-[0.2em] mb-6 md:hidden">
          PRIZES
        </h2>
        {/* Vertical Label - hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-shrink-0 w-16 sm:w-20 md:w-24 items-center justify-center">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-bark/70 font-mono tracking-[0.2em] whitespace-nowrap transform -rotate-90 origin-center">
            PRIZES
          </h2>
        </div>
        {/* Main Content */}
        <div className="flex-1 md:pl-12 lg:pl-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {prizes.map((prize, index) => (
              <div
                key={index}
                className="bg-white border-4 border-pumpkin card-sticker flex flex-col overflow-hidden"
              >
                <div className="w-full">
                  <Image
                    src={prize.image}
                    alt={prize.name}
                    width={1080}
                    height={1080}
                    className="w-full h-auto aspect-square object-cover object-center"
                  />
                </div>
                <div className="p-10 flex flex-col flex-grow">
                  <h3 className="text-3xl sm:text-4xl font-bold text-pumpkin mb-6 text-center font-mono">
                    {prize.name}
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed text-center mb-4 flex-grow">
                    {prize.description}
                  </p>
                  <div className="text-center mt-auto">
                    <p
                      className="text-2xl sm:text-3xl font-bold text-bark font-mono"
                      style={{ fontFamily: "var(--font-geist-mono)" }}
                    >
                      <span style={{ fontFamily: "var(--font-geist-mono)" }}>
                        ₿
                      </span>
                      {prize.amount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/form"
              className="inline-block px-10 py-5 btn-sticker bg-white text-pumpkin font-bold border-4 border-pumpkin hover:bg-pumpkin-wash text-lg font-mono"
            >
              Submit Your Project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
