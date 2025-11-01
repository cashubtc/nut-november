export default function Prizes() {
  const prizes = [
    {
      emoji: "🥇",
      name: "The Golden Nut",
      description: "Best overall project. The nut that shines brightest. Grand prize for the most impressive build that pushes Cashu forward."
    },
    {
      emoji: "🥈",
      name: "Hardest Nut to Crack",
      description: "Toughest technical breakthrough. For the ones who refuse to give up. Rewards the most challenging technical innovation or bug fix."
    },
    {
      emoji: "🥉",
      name: "The Nuttiest Idea",
      description: "Wildest experimental concept. Unhinged. Unhinged. Actually brilliant. Celebrates the most creative, out-of-the-box thinking."
    },
    {
      emoji: "💡",
      name: "Best UX Nut",
      description: "Design-focused improvement. Making ecash actually usable. For projects that make Cashu more accessible and delightful."
    },
    {
      emoji: "🌰",
      name: "Freshly Minted Nut",
      description: "Best first-time contributor. Welcome to the shell game. Recognizes newcomers who made their first meaningful contribution."
    }
  ];

  return (
    <section id="prizes" className="py-20 px-6 bg-[#FAFAFA] border-t border-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Mobile Title - shows on top for mobile only */}
        <h2 className="text-base font-normal text-gray-500 font-mono mb-6 md:hidden">
          PRIZES
        </h2>
        {/* Vertical Label - hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-shrink-0 w-16 sm:w-20 md:w-24 items-center justify-center">
          <h2 className="text-sm sm:text-base md:text-lg font-normal text-gray-500 font-mono whitespace-nowrap transform -rotate-90 origin-center">
            PRIZES
          </h2>
        </div>
        {/* Main Content */}
        <div className="flex-1 md:pl-12 lg:pl-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {prizes.map((prize, index) => (
              <div 
                key={index}
                className="bg-white border-4 border-[#B7CF4F] p-10 flex flex-col"
              >
                <div className="text-8xl mb-6 text-center">{prize.emoji}</div>
                <h3 className="text-3xl sm:text-4xl font-bold text-[#B7CF4F] mb-6 text-center font-mono">
                  {prize.name}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed text-center flex-grow">
                  {prize.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a 
              href="#participate" 
              className="inline-block px-10 py-5 bg-white text-[#B7CF4F] font-bold border-4 border-[#B7CF4F] hover:bg-[#f5f5f5] text-lg font-mono"
            >
              Submit Your Nut →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

