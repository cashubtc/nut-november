"use client";

import { useDonations } from "../context/DonationsContext";

export default function Winners() {
  const { prizes } = useDonations();

  // 2025 Nut November Winners
  const winners = [
    {
      prize: "The Golden Nut",
      prizeSubtitle: "Best Overall Project",
      winner: "The Nutty Pill",
      project: "The Nutty Pill",
      description:
        "A Bitcoin education app that gets people motivated to learn. Load up a reward pool via an admin dashboard and learners unlock sats by completing lessons and quizzes. Features roughly 85 lessons across a range of topics, all running locally with Cashu. Smart concept, strong execution.",
      amount: prizes.golden,
      accentColor: "#FFD700", // Gold
      bgGradient: "from-amber-50 to-yellow-50",
    },
    {
      prize: "Hardest Nut to Crack",
      prizeSubtitle: "Technical Breakthrough",
      winner: "Pay to Blinded Key (P2BK)",
      project: "P2BK using ECDH",
      description:
        "P2BK brings silent-payment style privacy to Cashu. It lets receivers publish a single key while still getting fully unlinkable payments. No reused pubkeys, no metadata leaks, no side channels. A serious step forward in Cashu privacy.",
      amount: prizes.hardest,
      accentColor: "#8B4513", // Brown
      bgGradient: "from-orange-50 to-amber-50",
    },
    {
      prize: "The Nuttiest Idea",
      prizeSubtitle: "Most Creative Concept",
      winner: "On-Chain Disc Golf",
      project: "On-Chain Disc Golf",
      description:
        "A disc golf scorekeeper with built-in Bitcoin payouts. No spreadsheets. No IOUs. Just pay in when you start, get paid when you finish. Built with Nostr, powered by Bitcoin, and unapologetically off-chain.",
      amount: prizes.nuttiest,
      accentColor: "#9333EA", // Purple
      bgGradient: "from-purple-50 to-fuchsia-50",
    },
    {
      prize: "Best Design Nut",
      prizeSubtitle: "Outstanding UX/Design",
      winner: "Nostrpay",
      project: "Nostrpay",
      description:
        "A child-friendly learning app with offline-first Cashu payments built into an educational environment. Parents connect a Lightning wallet, kids mint and send ecash, and the entire experience is wrapped in a playful, thoughtful, beginner-friendly interface.",
      amount: prizes.design,
      accentColor: "#B7CF4F", // Green (site primary)
      bgGradient: "from-lime-50 to-green-50",
    },
    {
      prize: "Freshly Minted Nut",
      prizeSubtitle: "Best First-Time Contributor",
      winner: "Taskify",
      project: "Taskify",
      description:
        "A clean, powerful to-do app where tasks can carry Cashu bounties. Share boards over Nostr, customize your workspace, and use a built-in ecash wallet with encrypted sync, notifications, and relay management. Huge debut with big potential.",
      amount: prizes.fresh,
      accentColor: "#06B6D4", // Cyan
      bgGradient: "from-cyan-50 to-teal-50",
    },
    {
      prize: "Crowd Favorite",
      prizeSubtitle: "Community Choice Award",
      winner: "Cashu Monopoly",
      project: "Cashu Monopoly",
      description:
        "Classic Monopoly, but the money is real Bitcoin. Buy in with Lightning, pot held in a Cashu wallet, winner takes the sats. A fun, educational way to introduce people to Bitcoin, Lightning, and ecash all in one go.",
      amount: prizes.crowd,
      accentColor: "#EC4899", // Pink
      bgGradient: "from-pink-50 to-rose-50",
    },
  ];

  return (
    <section
      id="winners"
      className="py-20 px-6 bg-[#FAFAFA] border-t border-black"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Mobile Title - shows on top for mobile only */}
        <h2 className="text-base font-normal text-gray-500 font-mono mb-6 md:hidden">
          WINNERS
        </h2>
        {/* Vertical Label - hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-shrink-0 w-16 sm:w-20 md:w-24 items-center justify-center">
          <h2 className="text-sm sm:text-base md:text-lg font-normal text-gray-500 font-mono whitespace-nowrap transform -rotate-90 origin-center">
            WINNERS
          </h2>
        </div>
        {/* Main Content */}
        <div className="flex-1 md:pl-12 lg:pl-16">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block relative">
              <span className="text-6xl sm:text-7xl md:text-8xl">🏆</span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#B7CF4F] mt-4 mb-4 font-mono tracking-tight">
              Congratulations!
            </h3>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto">
              Meet the incredible builders who cracked it open this November
            </p>
          </div>

          {/* Winners Grid */}
          <div className="space-y-8">
            {winners.map((winner, index) => (
              <div
                key={index}
                className={`bg-gradient-to-r ${winner.bgGradient} border-4 border-black overflow-hidden transition-all duration-300 hover:shadow-xl`}
              >
                {/* Prize Banner */}
                <div
                  className="py-4 px-6 border-b-4 border-black"
                  style={{ backgroundColor: winner.accentColor }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="text-2xl sm:text-3xl font-bold text-white font-mono drop-shadow-md">
                        {winner.prize}
                      </h4>
                      <p className="text-white/90 text-sm sm:text-base font-medium">
                        {winner.prizeSubtitle}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                        winner.prize === "The Golden Nut"
                          ? "bg-black/20"
                          : "bg-white/20"
                      }`}
                    >
                      <span className="text-white font-mono font-bold text-lg sm:text-xl">
                        ₿{winner.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Winner Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                    {/* Project Image Placeholder */}
                    <div className="w-full lg:w-2/5 flex-shrink-0">
                      <div className="aspect-video lg:aspect-square bg-gray-200 border-4 border-black flex items-center justify-center relative overflow-hidden group">
                        {/* Placeholder pattern */}
                        <div className="absolute inset-0 opacity-30">
                          <div
                            className="w-full h-full"
                            style={{
                              backgroundImage: `repeating-linear-gradient(
                                45deg,
                                #d1d5db,
                                #d1d5db 10px,
                                #e5e7eb 10px,
                                #e5e7eb 20px
                              )`,
                            }}
                          />
                        </div>
                        <div className="relative z-10 text-center p-4">
                          <div className="text-4xl mb-2">📸</div>
                          <p className="text-gray-500 font-mono text-sm">
                            Project Image
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Winner Details */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 font-mono uppercase tracking-wider mb-1">
                            Winner
                          </p>
                          <h5 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {winner.winner}
                          </h5>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-mono uppercase tracking-wider mb-1">
                            Project
                          </p>
                          <h6
                            className="text-xl sm:text-2xl font-semibold"
                            style={{ color: winner.accentColor }}
                          >
                            {winner.project}
                          </h6>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed">
                          {winner.description}
                        </p>
                        {/* Action buttons placeholder */}
                        <div className="flex flex-wrap gap-3 pt-2">
                          <button className="px-4 py-2 bg-gray-800 text-white font-mono text-sm hover:bg-gray-700 transition-colors">
                            View Project →
                          </button>
                          <button className="px-4 py-2 bg-white border-2 border-black text-gray-700 font-mono text-sm hover:bg-gray-50 transition-colors">
                            GitHub
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom celebration message */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-[#B7CF4F] text-white px-8 py-4">
              <p className="font-mono text-lg sm:text-xl font-bold">
                See you next November! 🎉
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
