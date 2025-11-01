export default function Footer() {
  return (
    <footer className="bg-[#FAFAFA] py-12 px-6 border-t border-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-[#B7CF4F] mb-4">
              Links
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#B7CF4F]">GitHub</a></li>
              <li><a href="https://docs.cashu.space" target="_blank" rel="noopener noreferrer" className="hover:text-[#B7CF4F]">Docs</a></li>
              <li><a href="#" className="hover:text-[#B7CF4F]">Telegram</a></li>
              <li><a href="#" className="hover:text-[#B7CF4F]">Nostr</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#B7CF4F] mb-4">
              Event
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#about" className="hover:text-[#B7CF4F]">About</a></li>
              <li><a href="#prizes" className="hover:text-[#B7CF4F]">Prizes</a></li>
              <li><a href="#participate" className="hover:text-[#B7CF4F]">Participate</a></li>
              <li><a href="#showcase" className="hover:text-[#B7CF4F]">Showcase</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#B7CF4F] mb-4">
              Community
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#B7CF4F]">Twitter</a></li>
              <li><a href="#" className="hover:text-[#B7CF4F]">Matrix</a></li>
              <li><a href="#" className="hover:text-[#B7CF4F]">Discord</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#B7CF4F] mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-[#B7CF4F]">Getting Started</a></li>
              <li><a href="#" className="hover:text-[#B7CF4F]">Examples</a></li>
              <li><a href="#" className="hover:text-[#B7CF4F]">Submit Project</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 pt-8 text-center">
          <p className="text-gray-700 mb-2">
            Built with love, privacy, and just a bit of nut.
          </p>
          <p className="text-xs text-gray-500 font-mono mt-4 opacity-60">
            mint add-nut --network main
          </p>
        </div>
      </div>
    </footer>
  );
}

