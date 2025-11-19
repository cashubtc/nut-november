"use client";

import Link from "next/link";
import { RefObject, useRef } from "react";
import CircularText from "./CircularText";
import NutParticles from "./NutParticles";
import { useDonations } from "../context/DonationsContext";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { total } = useDonations();

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#B7CF4F] p-6 sm:p-8 md:p-12 lg:p-16"
    >
      {/* Central Content Box */}
      <div className="relative z-20 bg-[#FAFAFA] border-4 border-[#B7CF4F] p-8 sm:p-12 md:p-16 lg:p-20 max-w-6xl w-full">
        {/* NUT NOVEMBER Text */}
        <div className="text-center mb-8">
          <h1
            className="hero-title text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[140px] font-bold leading-[0.85] tracking-wider text-[#B7CF4F] mb-4"
            style={{
              fontFamily: "var(--font-sauce-tm)",
              letterSpacing: "0.05em",
            }}
          >
            <span className="inline-block animate-slide-up">NUT</span>
            <br />
            <span className="inline-block animate-slide-up-delay">
              NOVEMBER
            </span>
          </h1>
          <p
            className="text-xl sm:text-2xl md:text-3xl text-gray-500 mb-4 animate-slide-up-delay uppercase"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            A month-long hackathon for Cashu builders.
          </p>
          <p
            className="text-xl sm:text-2xl md:text-3xl text-[#8B4513] mb-8 animate-slide-up-delay font-semibold"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            ₿
            {(total + 400000).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}{" "}
            Total Prize Pool!
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up-delay"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href="/form"
              className="inline-block px-10 py-5 bg-[#B7CF4F] text-white font-bold border-4 border-[#B7CF4F] hover:bg-[#9fb63e] text-lg font-mono"
            >
              Submit Project
            </Link>
            <a
              href="#prizes"
              className="inline-block px-10 py-5 bg-white text-[#B7CF4F] font-bold border-4 border-[#B7CF4F] hover:bg-[#f5f5f5] text-lg font-mono"
            >
              View Prizes
            </a>
          </div>
          <div
            className="text-center mt-6 animate-slide-up-delay"
            style={{ animationDelay: "0.5s" }}
          >
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                "Cashu builders are going nuts again this month. https://nutnovember.org/ #NutNovember"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-5 bg-[#8B4513] text-white font-bold border-4 border-[#8B4513] hover:bg-[#704214] text-lg font-mono"
            >
              Spread The Word
            </a>
          </div>
        </div>

        {/* Circular Text Animation - Top Right Edge, Overlapping */}
        <div className="absolute -top-24 -right-4 sm:-top-8 sm:-right-8 md:-top-10 md:-right-10 z-30">
          <div className="bg-black rounded-full border-4 border-[#B7CF4F] p-1">
            <CircularText />
          </div>
        </div>
      </div>

      {/* Nut Particles Effect */}
      <NutParticles heroSectionRef={heroRef as RefObject<HTMLElement>} />
    </section>
  );
}
