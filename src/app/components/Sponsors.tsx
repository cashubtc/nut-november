"use client";

import Image from "next/image";
import Link from "next/link";

export default function Sponsors() {
  return (
    <section
      id="sponsors"
      className="py-20 px-6 bg-[#FAFAFA] border-t border-black"
    >
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
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/donations"
                  className="inline-block px-10 py-5 bg-white text-[#B7CF4F] font-bold border-4 border-[#B7CF4F] hover:bg-[#f5f5f5] text-lg font-mono transition-colors text-center"
                >
                  View Donations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
