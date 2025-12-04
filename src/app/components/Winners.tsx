"use client";

import Image from "next/image";
import { useState } from "react";
import { useDonations } from "../context/DonationsContext";

export default function Winners() {
  const { prizes } = useDonations();
  const [openSubmission, setOpenSubmission] = useState<number | null>(null);

  // All other submissions (non-winners)
  const submissions = [
    {
      name: "PurrWallet",
      description: "A cross-platform Cashu ecash wallet built with Rust and Flutter, featuring a terminal-inspired UI for privacy-focused Bitcoiners.",
      github: "https://github.com/heathermm55/purrwallet",
      demo: "https://zapstore.dev/apps/naddr1qvzqqqr7pvpzqqxlkgyptfc7y3tj8980m7lhwtjk55reyxuzsusp4wynwjtwarndqqfxxmmd9ec82unjwaskcmr9wshxzursqntc4u",
      firstContribution: true,
    },
    {
      name: "Cashu-402",
      description: "HTTP 402 Payment Required implementation in Go, enabling websites and APIs to require Cashu micropayments for access.",
      github: "https://github.com/ngmisl/deez-cashus",
      demo: "https://deez-cashus.fly.dev/",
      firstContribution: true,
    },
    {
      name: "Cashu Casino",
      description: "A no-KYC gaming platform built on Cashu ecash and Nostr with instant deposits/withdrawals via NIP-04 encrypted DMs.",
      github: "https://github.com/babdbtc/cashucasino",
      demo: "https://cashucasino.cc",
      firstContribution: true,
    },
    {
      name: "CypherTap",
      description: "A Svelte component providing authentication and payments for Nostr apps, with built-in NIP-60 Cashu wallet support.",
      github: "https://github.com/cypherflow/cyphertap",
      demo: "https://cypherflow.github.io/cyphertap/",
      firstContribution: false,
    },
    {
      name: "Nutshell PR #840",
      description: "Fixed outdated Poetry setup instructions in CONTRIBUTING.md that caused errors for new contributors.",
      github: "https://github.com/cashubtc/nutshell/pull/840",
      firstContribution: true,
    },
    {
      name: "Bitpoints.me",
      description: "A Bitcoin-based rewards system where customers earn sats through a simple points-style interface, built on a fork of cashu.me.",
      github: "https://github.com/bitpoints-cashu/bitpoints.me",
      demo: "https://bitpoints.me/",
      firstContribution: false,
    },
    {
      name: "Cashu Website Redesign",
      description: "A full redesign of the Cashu website focused on clarity, accessibility, and ease of onboarding with updated visuals.",
      demo: "https://www.figma.com/proto/NXBJxSs7X5cr8nwN44MOR3/project-draft?node-id=824-6768",
      firstContribution: true,
    },
    {
      name: "Deterministic Nostr Cashu Wallets",
      description: "Extends NUT-13 deterministic wallet standard for Nostr, enabling full wallet recovery with 12 seed words via NIP-60.",
      github: "https://github.com/rodant/ndk-wallet",
      demo: "https://github.com/rodant/satshoot/tree/cashu-mnemonic-restore",
      firstContribution: false,
    },
    {
      name: "LNUTS",
      description: "Express middleware that turns any Node.js app into an LNURL pay server, forwarding Lightning payments to NIP-60 wallets.",
      github: "https://gitworkshop.dev/npub1dfedhrhn7wu7uhkdsz8dd5rrr50ymkjutkklq7y8zpxn89t7hfyqfzlc7u/relay.ngit.dev/lnuts",
      demo: "https://alpha.nuts.cash/home",
      firstContribution: false,
    },
    {
      name: "EchoCash",
      description: "A P2P communication and payment platform using WebRTC and WebSockets for decentralized value transfer via Fedimint and Cashu.",
      github: "https://github.com/Harshdev098/EchoCash",
      firstContribution: true,
    },
    {
      name: "Cashu Point of Sale",
      description: "A self-hostable POS app built with Expo for accepting Cashu payments via NFC tap-to-pay and Lightning invoices.",
      github: "https://github.com/babdbtc/cashu-pos",
      firstContribution: false,
    },
    {
      name: "Classu.Cash",
      description: "An educational platform for learning Cashu with tutorials, interactive tools, and real-world examples for minting and redeeming ecash.",
      github: "https://github.com/inscrib3/classu.cash",
      demo: "https://classu.cash",
      firstContribution: true,
    },
    {
      name: "Nostr.blue",
      description: "A full-featured Nostr social client with a built-in NIP-60 Cashu wallet, compiled to WebAssembly using CDK.",
      github: "https://github.com/patrickulrich/nostr.blue",
      demo: "https://nostr.blue/cashuwallet",
      firstContribution: true,
    },
    {
      name: "Cashu Website Revamp",
      description: "A fresh redesign exploring new layouts and updated visuals for a clearer, more modern Cashu website experience.",
      demo: "https://www.figma.com/proto/9ptFVKv2A7vuU6rpG17zgh/Sonata-app?page-id=400%3A1035&node-id=432-20501",
      firstContribution: true,
    },
    {
      name: "Bitcoin Skills",
      description: "A workflow for building Bitcoin, Lightning, and Cashu wallets through prompts and images, with a Claude Skills library.",
      gitlab: "https://gitlab.com/lemonknowsall/bitcoin-skills/",
      demo: "https://primal.net/e/nevent1qqs0su3kp66m5nswxw09yfux20r8de0shtehx2f7a9wq0jjwnglzgcqefva0y",
      firstContribution: true,
    },
  ];

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
      image: "/winners/goldennutwinner.jpg",
      icon: "/small-nut-icons/goldennut.png",
      github: "https://github.com/MonkeyDGigi/The_Nutty_Pill",
      demo: "https://thenuttypill.netlify.app/",
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
      image: "/winners/p2bk-proof.svg",
      icon: "/small-nut-icons/hardestnut.png",
      github: "https://github.com/cashubtc/cashu-ts/pull/377",
      demo: "http://nostrly.com/cashu-nutlock",
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
      image: "/winners/nuttiestideawinner.jpg",
      icon: "/small-nut-icons/nuttiestidea.png",
      github: "https://github.com/OnChainDiscGolf/app",
      demo: "https://on-chains-disc-golf-982604035840.us-west1.run.app/",
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
      video: "/winners/bestdesignwinner.mp4",
      icon: "/small-nut-icons/designnut.png",
      github: "https://github.com/Unit-Matrix/nostrpay/tree/cashu-impl",
      demo: "https://x.com/Anipy1/status/1994051972157112509",
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
      image: "/winners/freshleymintednutwinner.jpg",
      icon: "/small-nut-icons/newlymintednut.png",
      github: "https://github.com/Solife-me/Taskify_Release",
      demo: "https://taskify.solife.me/",
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
      image: "/winners/crowdfavoritewinner.jpg",
      icon: "/small-nut-icons/crowdfavorite.png",
      github: "https://github.com/bTCpy/monopoly/",
      demo: "https://cashu-monopoly.onrender.com/",
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
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto md:whitespace-nowrap">
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
                    <div className="flex items-center gap-3">
                      {"icon" in winner && winner.icon && (
                        <Image
                          src={winner.icon}
                          alt=""
                          width={48}
                          height={48}
                          className="flex-shrink-0"
                          unoptimized
                        />
                      )}
                      <div>
                        <h4
                          className={`text-2xl sm:text-3xl font-bold font-mono drop-shadow-md ${
                            winner.prize === "The Golden Nut"
                              ? "text-black"
                              : "text-white"
                          }`}
                        >
                          {winner.prize}
                        </h4>
                        <p
                          className={`text-sm sm:text-base font-medium ${
                            winner.prize === "The Golden Nut"
                              ? "text-black/80"
                              : "text-white/90"
                          }`}
                        >
                          {winner.prizeSubtitle}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-fit flex items-center gap-2 px-4 py-2 rounded-full ${
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
                    {/* Project Image/Video */}
                    <div className="w-full lg:w-2/5 flex-shrink-0">
                      <div className="aspect-video lg:aspect-square bg-gray-200 border-4 border-black flex items-center justify-center relative overflow-hidden group">
                        {"video" in winner && winner.video ? (
                          <video
                            src={winner.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : "image" in winner && winner.image ? (
                          <Image
                            src={winner.image}
                            alt={winner.project}
                            fill
                            className="object-cover"
                            unoptimized
                            priority={winner.image.includes("goldennut")}
                          />
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>

                    {/* Winner Details */}
                    <div className="flex-1 flex flex-col justify-start">
                      <div className="space-y-4">
                        <div>
                          <h5
                            className="text-2xl sm:text-3xl font-bold"
                            style={{ color: winner.accentColor }}
                          >
                            {winner.winner}
                          </h5>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed">
                          {winner.description}
                        </p>
                        {/* Action buttons */}
                        {("demo" in winner || "github" in winner) && (
                          <div className="flex flex-wrap gap-3 pt-2">
                            {"demo" in winner && winner.demo && (
                              <a
                                href={winner.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-gray-800 text-white font-mono text-sm hover:bg-gray-700 transition-colors"
                              >
                                View Project →
                              </a>
                            )}
                            {"github" in winner && winner.github && (
                              <a
                                href={winner.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-white border-2 border-black text-gray-700 font-mono text-sm hover:bg-gray-50 transition-colors"
                              >
                                GitHub
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All Submissions Accordion */}
          <div className="mt-16">
            <h4 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 font-mono">
              All Submissions
            </h4>
            <p className="text-gray-600 mb-8">
              Thank you to everyone who participated! Here are all the projects submitted to Nut November 2025.
            </p>
            <div className="space-y-2">
              {submissions.map((submission, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-300 bg-white overflow-hidden"
                >
                  <button
                    onClick={() => setOpenSubmission(openSubmission === index ? null : index)}
                    className="w-full px-4 py-3 flex items-start justify-between hover:bg-gray-50 transition-colors gap-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <span className="font-mono font-semibold text-gray-800 text-left">
                        {submission.name}
                      </span>
                      {submission.firstContribution && (
                        <span className="text-xs bg-[#B7CF4F] text-white px-2 py-0.5 rounded-full font-mono w-fit">
                          First Contribution
                        </span>
                      )}
                    </div>
                    <span className="text-gray-400 text-xl flex-shrink-0">
                      {openSubmission === index ? "−" : "+"}
                    </span>
                  </button>
                  {openSubmission === index && (
                    <div className="px-4 pb-4 border-t border-gray-200">
                      <p className="text-gray-600 text-sm mt-3 mb-3">
                        {submission.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {submission.demo && (
                          <a
                            href={submission.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-gray-800 text-white font-mono text-xs hover:bg-gray-700 transition-colors"
                          >
                            Demo →
                          </a>
                        )}
                        {submission.github && (
                          <a
                            href={submission.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-white border border-gray-300 text-gray-700 font-mono text-xs hover:bg-gray-50 transition-colors"
                          >
                            GitHub
                          </a>
                        )}
                        {submission.gitlab && (
                          <a
                            href={submission.gitlab}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-white border border-gray-300 text-gray-700 font-mono text-xs hover:bg-gray-50 transition-colors"
                          >
                            GitLab
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
