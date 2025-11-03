export default function NutworkEffect() {
  const tweetText = "Cashu builders are going nuts again this month. https://nutnovember.org/ #NutNovember";
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  return (
    <section id="nutwork-effect" className="py-20 px-6 bg-[#FAFAFA] border-t border-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Mobile Title - shows on top for mobile only */}
        <h2 className="text-base font-normal text-gray-500 font-mono mb-6 md:hidden">
          THE NUTWORK EFFECT
        </h2>
        {/* Vertical Label - hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-shrink-0 w-16 sm:w-20 md:w-24 items-center justify-center">
          <h2 className="text-sm sm:text-base md:text-lg font-normal text-gray-500 font-mono whitespace-nowrap transform -rotate-90 origin-center">
            THE NUTWORK EFFECT
          </h2>
        </div>
        {/* Main Content */}
        <div className="flex-1 md:pl-12 lg:pl-16">
          <div>
            <p className="text-xl sm:text-2xl text-gray-800 leading-relaxed mb-8">
              Boost the hackathon. Share <a href="https://x.com/search?q=%23NutNovember&src=typed_query" target="_blank" rel="noopener noreferrer" className="text-[#B7CF4F] hover:underline font-semibold whitespace-nowrap">#NutNovember</a>. The more nuts, the stronger the network.
            </p>
            <div className="text-left">
              <a 
                href={tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-5 bg-white text-[#B7CF4F] font-bold border-4 border-[#B7CF4F] hover:bg-[#f5f5f5] text-lg font-mono"
              >
                Tweet About #NutNovember
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

