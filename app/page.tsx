import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <main className="max-w-2xl bg-white rounded-2xl shadow-xl p-10 text-center">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-6">
          Felicity 2026
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Join us for the most exciting event of the year! Experience amazing speakers, networking, and fun.
        </p>
        
        <div className="bg-blue-50 text-blue-800 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-bold text-lg mb-2">Event Details:</h3>
          <ul className="space-y-2">
            <li>📅 Date: October 15, 2026</li>
            <li>📍 Venue: Grand Convention Center</li>
            <li>🎟️ Ticket Price: Rs. 300</li>
            <li>⚠️ Limited to 500 attendees!</li>
          </ul>
        </div>

        <Link 
          href="/register" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-colors shadow-lg hover:shadow-xl"
        >
          Register Now
        </Link>
      </main>
    </div>
  );
}
