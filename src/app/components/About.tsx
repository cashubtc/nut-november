export default function About() {
  return (
    <section id="about" className="py-20 px-6 bg-[#FAFAFA] border-t border-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Mobile Title - shows on top for mobile only */}
        <h2 className="text-base font-normal text-gray-500 font-mono mb-6 md:hidden">
          ABOUT
        </h2>
        {/* Vertical Label - hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-shrink-0 w-16 sm:w-20 md:w-24 items-center justify-center">
          <h2 className="text-sm sm:text-base md:text-lg font-normal text-gray-500 font-mono whitespace-nowrap transform -rotate-90 origin-center">
            ABOUT
          </h2>
        </div>
        {/* Main Content */}
        <div className="flex-1 md:pl-12 lg:pl-16">
          <div className="space-y-6 text-xl sm:text-2xl text-gray-800 leading-relaxed">
            <p>
              <span className="text-[#B7CF4F] font-semibold">Nut November</span> was a community-driven month of Cashu development where builders, designers, and community builders came together to crack open new ideas in the Cashu ecosystem.
            </p>
            <p>
              Throughout November 2025, we celebrated open-source, privacy-preserving ecash on Bitcoin. From wallet innovations to mint software breakthroughs, our community shipped incredible projects that pushed the Cashu ecosystem forward.
            </p>
            <p className="text-lg text-gray-600 italic">
              Thank you to everyone who participated, sponsored, and supported this hackathon. See the winners below!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
