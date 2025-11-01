"use client";

import { useRef } from "react";
import CircularText from "./CircularText";
import NutParticles from "./NutParticles";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  
  return (
    <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#B7CF4F] p-6 sm:p-8 md:p-12 lg:p-16">
      {/* Central Content Box */}
      <div className="relative z-20 bg-[#FAFAFA] border-4 border-[#B7CF4F] p-8 sm:p-12 md:p-16 lg:p-20 max-w-6xl w-full">
        {/* NUT NOVEMBER Text */}
        <div className="text-center mb-8">
          <h1
            className="hero-title text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[140px] font-bold leading-[0.85] tracking-wider text-[#B7CF4F] mb-4"
            style={{ fontFamily: "var(--font-sauce-tm)", letterSpacing: "0.05em" }}
          >
            <span className="inline-block animate-slide-up">NUT</span>
            <br />
            <span className="inline-block animate-slide-up-delay">NOVEMBER</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 mb-8 animate-slide-up-delay uppercase" style={{ fontFamily: "var(--font-sans)" }}>
            A month-long hackathon for Cashu builders who just can&apos;t hold their nuts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up-delay" style={{ animationDelay: "0.4s" }}>
            <a 
              href="#participate" 
              className="inline-block px-10 py-5 bg-[#B7CF4F] text-white font-bold border-4 border-[#B7CF4F] hover:bg-[#9fb63e] text-lg font-mono"
            >
              Submit Project
            </a>
            <a 
              href="#prizes" 
              className="inline-block px-10 py-5 bg-white text-[#B7CF4F] font-bold border-4 border-[#B7CF4F] hover:bg-[#f5f5f5] text-lg font-mono"
            >
              View Prizes
            </a>
          </div>
        </div>
        
        {/* Circular Text Animation - Top Right Edge, Overlapping */}
        <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 md:-top-10 md:-right-10 z-30">
          <div className="bg-black rounded-full border-4 border-[#B7CF4F] p-1">
            <CircularText />
          </div>
        </div>
      </div>
      
      {/* Nut Particles Effect */}
      <NutParticles heroSectionRef={heroRef} />
    </section>
  );
}

