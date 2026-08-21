import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Hero Section with Solid Background Image & Overlay */}
      <div className="relative flex-grow flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0"></div>
        
        <div className="relative z-10 text-center px-6 w-full max-w-5xl mx-auto mt-20">
          <div className="inline-block mb-6 px-4 py-1 border-2 border-indigo-500 text-indigo-400 font-bold tracking-widest text-sm uppercase rounded-sm">
            The Biggest Event of the Year
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl uppercase">
            FELICITY <span className="text-indigo-500">2026</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-gray-200 mb-12 font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-md">
            Experience the ultimate celebration. Unforgettable music, crazy vibes, and an experience that will echo in eternity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/register" 
              className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl md:text-2xl rounded-sm uppercase tracking-wider transition-colors duration-200 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              Get Your Tickets
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t-2 border-white/20 pt-10 w-full text-center text-gray-300 font-sans tracking-wide">
            <div>
              <p className="text-white font-black text-2xl uppercase">SEP 12, 2026</p>
              <p className="text-sm text-gray-400 mt-1 uppercase font-bold tracking-widest">Date</p>
            </div>
            <div>
              <p className="text-white font-black text-2xl uppercase">10:30 AM Onwards</p>
              <p className="text-sm text-gray-400 mt-1 uppercase font-bold tracking-widest">Time</p>
            </div>
            <div>
              <p className="text-indigo-400 font-black text-2xl uppercase">Mahindra Elite Meerpet</p>
              <p className="text-sm text-gray-400 mt-1 uppercase font-bold tracking-widest">Venue</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
