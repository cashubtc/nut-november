export default function HowToParticipate() {
  const steps = [
    {
      number: "1",
      title: "Fork or Contribute",
      description: "Find a Cashu project on GitHub or start your own. No idea is too nutty."
    },
    {
      number: "2",
      title: "Build Something",
      description: "Create a new tool, improve an existing one, or fix that bug that's been driving you nuts."
    },
    {
      number: "3",
      title: "Share Your Progress",
      description: "Post updates on Nostr or X with #NutNovember. Let the community see your nuts."
    },
    {
      number: "4",
      title: "Submit by Nov 30",
      description: "Deadline's November 30th. There's no wrong way to nut — as long as it involves ecash."
    }
  ];

  return (
    <section id="participate" className="py-20 px-6 bg-[#FAFAFA] border-t border-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Mobile Title - shows on top for mobile only */}
        <h2 className="text-base font-normal text-gray-500 font-mono mb-6 md:hidden">
          PARTICIPATE
        </h2>
        {/* Vertical Label - hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-shrink-0 w-16 sm:w-20 md:w-24 items-center justify-center">
          <h2 className="text-sm sm:text-base md:text-lg font-normal text-gray-500 font-mono whitespace-nowrap transform -rotate-90 origin-center">
            PARTICIPATE
          </h2>
        </div>
        {/* Main Content */}
        <div className="flex-1 md:pl-12 lg:pl-16">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-[#B7CF4F] text-[#EFE8D4] border-4 border-[#B7CF4F] flex items-center justify-center text-2xl font-bold font-mono">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#B7CF4F] mb-2 font-mono">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-800">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <p className="text-xl text-gray-700 italic">
              &quot;There&apos;s no wrong way to nut — as long as it involves ecash.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

