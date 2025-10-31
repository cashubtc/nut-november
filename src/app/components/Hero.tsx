"use client";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#B7CF4F] p-6 sm:p-8 md:p-12 lg:p-16">
      {/* Central Content Box */}
      <div className="relative z-20 bg-[#EFE8D4] rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 lg:p-20 max-w-6xl w-full">
        {/* NUT NOVEMBER Text */}
        <div className="text-center">
          <h1
            className="hero-title text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[140px] font-bold leading-[0.85] tracking-wider text-[#B7CF4F]"
            style={{ fontFamily: "var(--font-sauce-tm)", letterSpacing: "0.05em" }}
          >
            <span className="inline-block animate-slide-up">NUT</span>
            <br />
            <span className="inline-block animate-slide-up-delay">NOVEMBER</span>
          </h1>
        </div>

        {/* Sticker Elements - On Corners of White Box */}
        {/* Circular NN Sticker - Top Right Corner */}
        <div 
          className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 md:-top-8 md:-right-8 z-30 animate-sticker-pop"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
            <div className="absolute inset-0 rounded-full bg-[#EFE8D4] shadow-sticker flex items-center justify-center">
              <div className="text-center">
                <div 
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#B7CF4F] rotate-[-8deg]"
                  style={{ fontFamily: "var(--font-sauce-tm)" }}
                >
                  NN
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-[#EFE8D4] border-opacity-50"></div>
          </div>
        </div>

        {/* NUT NOVEMBER Text Sticker - Bottom Right Corner */}
        <div 
          className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 md:-bottom-8 md:-right-8 z-30 animate-sticker-pop"
          style={{ animationDelay: "1.2s" }}
        >
          <div 
            className="relative text-lg sm:text-xl md:text-2xl font-bold text-[#EFE8D4] rotate-[8deg]"
            style={{ 
              fontFamily: "var(--font-sauce-tm)",
              textShadow: "3px 3px 0px rgba(0,0,0,0.2), 6px 6px 0px rgba(0,0,0,0.1)",
              WebkitTextStroke: "3px #EFE8D4",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(4px 4px 8px rgba(0,0,0,0.2))"
            }}
          >
            NUT NOVEMBER
          </div>
        </div>

        {/* Bottom outline sticker - layered behind */}
        <div 
          className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 md:-bottom-10 md:-right-10 z-25 animate-sticker-pop"
          style={{ animationDelay: "1.4s" }}
        >
          <div 
            className="relative text-lg sm:text-xl md:text-2xl font-bold text-[#EFE8D4] rotate-[-5deg]"
            style={{ 
              fontFamily: "var(--font-sauce-tm)",
              textShadow: "3px 3px 0px rgba(0,0,0,0.2), 6px 6px 0px rgba(0,0,0,0.1)",
              WebkitTextStroke: "3px rgba(239,232,212,0.6)",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(4px 4px 8px rgba(0,0,0,0.15))"
            }}
          >
            NUT NOVEMBER
          </div>
        </div>

        {/* Nut emoji sticker - Top Left Corner */}
        <div 
          className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 md:-top-8 md:-left-8 z-30 animate-sticker-bounce"
          style={{ animationDelay: "1s" }}
        >
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">🌰</div>
        </div>

        {/* Fire emoji sticker - Bottom Left Corner */}
        <div 
          className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 md:-bottom-8 md:-left-8 z-30 animate-sticker-bounce"
          style={{ animationDelay: "1.3s" }}
        >
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl rotate-[-15deg]">🔥</div>
        </div>

        {/* Circular accent sticker - Top Left (offset) */}
        <div 
          className="absolute top-8 left-8 sm:top-12 sm:left-12 md:top-16 md:left-16 z-30 animate-sticker-pop"
          style={{ animationDelay: "1.6s" }}
        >
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
            <div className="absolute inset-0 rounded-full bg-[#EFE8D4] bg-opacity-80 shadow-sticker flex items-center justify-center rotate-[-12deg]">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl">⭐</div>
                <div 
                  className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-[#B7CF4F] mt-0.5"
                  style={{ fontFamily: "var(--font-sauce-tm)" }}
                >
                  NOV
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Party emoji - Top Right (offset) */}
        <div 
          className="absolute top-8 right-8 sm:top-12 sm:right-12 md:top-16 md:right-16 z-30 animate-sticker-pop"
          style={{ animationDelay: "1.8s" }}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-[#EFE8D4] bg-opacity-90 shadow-sticker flex items-center justify-center rotate-[15deg]">
            <div className="text-base sm:text-lg md:text-xl">🎉</div>
          </div>
        </div>

        {/* Sparkles - Bottom Left (offset) */}
        <div 
          className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 md:bottom-16 md:left-16 z-30 animate-sticker-pop"
          style={{ animationDelay: "2s" }}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#EFE8D4] bg-opacity-85 shadow-sticker flex items-center justify-center rotate-[-20deg]">
            <div className="text-sm sm:text-base md:text-lg">✨</div>
          </div>
        </div>
      </div>
    </section>
  );
}

