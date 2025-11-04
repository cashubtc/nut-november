"use client";

import Image from "next/image";
import { useState } from "react";

export default function Sponsors() {
  const [copied, setCopied] = useState(false);
  const lightningAddress = "npub1rmdz79y6w8ulk5elcx7t922kmwnuj8dz9j0awvszeymyer8wr0zssz9rjr@npub.cash";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lightningAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <section id="sponsors" className="py-20 px-6 bg-[#FAFAFA] border-t border-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Mobile Title - shows on top for mobile only */}
        <h2 className="text-base font-normal text-gray-500 font-mono mb-6 md:hidden">
          SPONSORS
        </h2>
        {/* Vertical Label - hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-shrink-0 w-16 sm:w-20 md:w-24 items-center justify-center">
          <h2 className="text-sm sm:text-base md:text-lg font-normal text-gray-500 font-mono whitespace-nowrap transform -rotate-90 origin-center">
            SPONSORS
          </h2>
        </div>
        {/* Main Content */}
        <div className="flex-1 md:pl-12 lg:pl-16">
          <div>
            <p className="text-xl sm:text-2xl text-gray-800 leading-relaxed mb-8">
              Thank you to the sponsors who have supported this hackathon.
            </p>
            
            {/* Sponsors */}
            <div className="mb-12">
              <a 
                href="https://opencash.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/open-cash-logo.png"
                  alt="OpenCash"
                  width={200}
                  height={100}
                  className="h-auto max-w-full"
                />
              </a>
            </div>

            {/* Donation Section */}
            <div className="mb-8">
              <p className="text-xl sm:text-2xl text-gray-800 leading-relaxed mb-6">
                Help increase the prize pool by donating ecash or bitcoin.
              </p>
              
              {/* QR Codes */}
              <div className="flex flex-col sm:flex-row gap-8 mt-8">
                {/* Cashu Ecash QR Code */}
                <div className="flex flex-col items-start">
                  <div className="w-full sm:w-64 h-64 bg-white border-4 border-gray-300 flex items-center justify-center p-4">
                    <Image
                      src="/ecashqrcode.png"
                      alt="Cashu Ecash QR Code"
                      width={256}
                      height={256}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="mt-4 text-lg text-gray-700 font-mono text-left">
                    Send Cashu Ecash
                  </p>
                  <p className="mt-2 text-sm text-gray-500 text-left max-w-xs">
                    Scan with your Cashu wallet to contribute to the prize pool.
                  </p>
                </div>
                
                {/* Bitcoin QR Code */}
                <div className="flex flex-col items-start">
                  <div className="w-full sm:w-64 h-64 bg-white border-4 border-gray-300 flex items-center justify-center p-4">
                    <Image
                      src="/bitcoinqrcode.png"
                      alt="Bitcoin Lightning QR Code"
                      width={256}
                      height={256}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="mt-4 text-lg text-gray-700 font-mono text-left">
                    Send Bitcoin
                  </p>
                  <div className="mt-2 text-sm text-gray-500 text-left max-w-xs">
                    <p className="mb-2">Send Bitcoin via the Lightning network.</p>
                    <button
                      onClick={handleCopy}
                      className="font-mono text-gray-700 hover:text-gray-900 underline cursor-pointer break-all text-left transition-colors"
                      title="Click to copy"
                    >
                      {copied ? "Copied!" : lightningAddress}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

