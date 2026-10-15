export default function BuilderShowcase() {
  const projects = [
    {
      name: "Nutlightning",
      description: "A Lightning bridge prototype connecting Cashu to the Lightning Network.",
      tech: "Rust, Lightning"
    },
    {
      name: "NutTag",
      description: "NFC ecash payments. Tap to pay with privacy-preserving nuts.",
      tech: "NFC, Mobile"
    },
    {
      name: "Nutbash",
      description: "Command-line mint manager for power users who love their terminal.",
      tech: "Bash, CLI"
    },
    {
      name: "Nutshell Connect",
      description: "Wallet SDK experiment making Cashu integration easier for developers.",
      tech: "TypeScript, SDK"
    },
    {
      name: "NutBot",
      description: "Telegram bot for minting and sending ecash. Because why not?",
      tech: "Python, Telegram"
    },
    {
      name: "NutVault",
      description: "Hardware wallet integration for the ultimate in nut security.",
      tech: "Hardware, Security"
    }
  ];

  return (
    <section id="showcase" className="py-20 px-6 bg-cream border-t border-bark">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Mobile Title - shows on top for mobile only */}
        <h2 className="text-base font-semibold text-bark/70 font-mono tracking-[0.2em] mb-6 md:hidden">
          SHOWCASE
        </h2>
        {/* Vertical Label - hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-shrink-0 w-16 sm:w-20 md:w-24 items-center justify-center">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-bark/70 font-mono tracking-[0.2em] whitespace-nowrap transform -rotate-90 origin-center">
            SHOWCASE
          </h2>
        </div>
        {/* Main Content */}
        <div className="flex-1 md:pl-12 lg:pl-16">
          <p className="text-xl text-gray-700 mb-12">
            Community projects that are cracking the code on ecash adoption.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {projects.map((project, index) => (
              <div 
                key={index}
                className="bg-white border-4 border-pumpkin p-6"
              >
                <h3 className="text-2xl font-bold text-pumpkin mb-3 font-mono">
                  {project.name}
                </h3>
                <p className="text-gray-700 mb-4">{project.description}</p>
                <div className="text-sm text-gray-500 font-mono">{project.tech}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a 
              href="#participate" 
              className="inline-block px-8 py-4 btn-sticker bg-pumpkin text-cream-deep font-bold border-2 border-pumpkin hover:bg-pumpkin-dark font-mono"
            >
              Show Your Nut →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

