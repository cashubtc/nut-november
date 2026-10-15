const display = { fontFamily: "var(--font-sauce-tm)" };

export default function About() {
  return (
    <section id="about" className="bg-cream px-6 pt-24 pb-20 sm:pt-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div>
          <h2
            className="text-5xl sm:text-6xl leading-[0.95] text-bark text-balance"
            style={display}
          >
            Four weeks to build on Cashu
          </h2>
          <div className="mt-8 max-w-[62ch] space-y-5 text-lg sm:text-xl leading-relaxed text-bark-dark/90">
            <p>
              Nut November is a community hackathon for Cashu, the open-source
              ecash protocol for Bitcoin. From November 1 to 27, developers,
              designers and writers build wallets, mints, tools and guides, and
              the best work wins sats.
            </p>
            <p>
              Start a project or contribute to one that exists. Code, design and
              docs all count, and first-timers have a prize of their own.
            </p>
          </div>
        </div>

        <aside className="-rotate-1 border-2 border-bark bg-pumpkin-wash p-7 sm:p-8">
          <h3 className="text-xl font-semibold text-bark-dark">New to Cashu?</h3>
          <p className="mt-3 leading-relaxed text-bark-dark/90">
            Cashu is a Chaumian ecash protocol for Bitcoin. Mints issue ecash
            tokens that can be sent privately, even offline, and redeemed for
            bitcoin.
          </p>
          <ul className="mt-5 space-y-2 font-medium">
            <li>
              <a
                href="https://docs.cashu.space/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pumpkin-dark underline decoration-2 hover:text-bark"
              >
                Read the Cashu docs
              </a>
            </li>
            <li>
              <a
                href="https://cashu.space/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pumpkin-dark underline decoration-2 hover:text-bark"
              >
                Visit cashu.space
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
