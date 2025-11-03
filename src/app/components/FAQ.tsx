"use client";

import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Do I need to be a developer?",
      answer: "Nope. Designers, writers, and community builders are all welcome. If you can contribute to Cashu in any way, you're in."
    },
    {
      question: "What if my nut isn't finished?",
      answer: "Submit anyway. Half-cracked nuts are still nuts. Progress and effort matter more than perfection."
    },
    {
      question: "Is this serious or a joke?",
      answer: "Yes. It's a real hackathon with real prizes, but we're not taking ourselves too seriously."
    },
    {
      question: "Why nuts?",
      answer: "Because Cashu. Also, 'No Nut November' exists, so we're flipping it. We're going nuts for ecash."
    },
    {
      question: "What's Cashu?",
      answer: (
        <>
          <a href="https://cashu.space/" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold">Cashu</a> is a Chaumian ecash protocol for Bitcoin. It&apos;s private, offline-capable, and runs on Bitcoin. Think digital cash, but actually private.
        </>
      )
    },
    {
      question: "Can I submit multiple projects?",
      answer: "Absolutely. Go nuts. Submit as many projects as you can build. Just make sure each one is meaningful."
    },
    {
      question: "What if I've never used Cashu before?",
      answer: (
        <>
          Perfect time to start. Check out the <a href="https://docs.cashu.space/" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold">docs</a>, join the community, and dive in. Freshly minted nuts are especially welcome.
        </>
      )
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-6 bg-[#FAFAFA] border-t border-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Mobile Title - shows on top for mobile only */}
        <h2 className="text-base font-normal text-gray-500 font-mono mb-6 md:hidden">
          FAQ
        </h2>
        {/* Vertical Label - hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-shrink-0 w-16 sm:w-20 md:w-24 items-center justify-center">
          <h2 className="text-sm sm:text-base md:text-lg font-normal text-gray-500 font-mono whitespace-nowrap transform -rotate-90 origin-center">
            FAQ
          </h2>
        </div>
        {/* Main Content */}
        <div className="flex-1 md:pl-12 lg:pl-16">
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border-t border-black"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-6 px-4 flex items-center justify-between hover:bg-[#B7CF4F] transition-colors group text-left"
                >
                  <h3 className="text-xl sm:text-2xl font-normal text-black font-mono group-hover:text-white transition-colors uppercase">
                    {faq.question}
                  </h3>
                  <span className={`text-2xl font-mono text-black group-hover:text-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ml-4 flex-shrink-0 ${
                    openIndex === index ? "rotate-90" : "rotate-0"
                  }`}>
                    →
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className={`px-4 pb-6 pt-2 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    openIndex === index ? "translate-y-0" : "-translate-y-4"
                  }`}>
                    <p className="text-lg text-gray-800">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Bottom border for last item */}
            <div className="border-t border-black"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

