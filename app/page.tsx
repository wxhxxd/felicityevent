import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-fuchsia-500 selection:text-white flex flex-col">
      {/* Hero Section with Background Image & Gradient Overlay */}
      <div className="relative flex-grow flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2874&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-purple-900/40 to-black z-0"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse opacity-50 z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse opacity-50 z-0 animation-delay-2000"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <div className="inline-block mb-4 px-6 py-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 backdrop-blur-md">
            <span className="text-fuchsia-300 font-semibold tracking-widest text-sm uppercase">The Biggest Night of the Year</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(232,121,249,0.5)]">
            FELICITY 2026
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
            Experience the ultimate celebration. Unforgettable music, crazy vibes, and a night that will echo in eternity. Only 500 tickets available.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="/register" 
              className="group relative px-8 py-4 bg-white text-black font-black text-xl rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">GRAB YOUR TICKET (₹300)</span>
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 max-w-2xl mx-auto text-gray-400 font-mono text-sm">
            <div>
              <p className="text-white font-bold text-xl">DEC 31</p>
              <p>2026</p>
            </div>
            <div>
              <p className="text-white font-bold text-xl">9:00 PM</p>
              <p>TILL DAWN</p>
            </div>
            <div>
              <p className="text-white font-bold text-xl">SECRET</p>
              <p>LOCATION</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
