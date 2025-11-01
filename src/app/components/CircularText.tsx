"use client";

export default function CircularText() {
  return (
    <div className="relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
      {/* Nut emoji in center */}
      <div className="absolute z-10 text-2xl sm:text-3xl md:text-4xl rotate-circle-reverse">
        🌰
      </div>
      
      {/* SVG with circular text */}
      <svg
        className="rotate-circle w-full h-full"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <path
            id="circle"
            d="M 100, 100
              m -75, 0
              a 75, 75 0 1, 0 150, 0
              a 75, 75 0 1, 0 -150, 0"
          />
        </defs>
        <text width="400">
          <textPath
            xlinkHref="#circle"
            className="text-lg sm:text-base md:text-lg font-bold fill-white uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "2px" }}
            startOffset="0%"
          >
            100% NUTTY • 100% CERTIFIED ORGANIC •{" "}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

