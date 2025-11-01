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
          <div className="space-y-6 text-lg sm:text-xl text-gray-800">
            <p>
              Nut November is a community-driven month of Cashu development where builders, designers, and meme lords come together to crack open new ideas in the ecash ecosystem.
            </p>
            <p>
              We&apos;re going shell-first into privacy. This isn&apos;t your typical hackathon — it&apos;s a celebration of open-source, privacy-preserving money that runs on Bitcoin. Whether you&apos;re shipping wallets, building mints, or crafting the perfect nut meme, there&apos;s a place for you here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

