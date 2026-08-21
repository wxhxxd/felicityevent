'use client';

import { useState } from 'react';

const TICKET_OPTIONS = [
  { id: 'basic', name: 'Basic Access', basePrice: 300 },
  { id: 'stage', name: 'Near to Stage', basePrice: 350 },
  { id: 'vip', name: 'Near to Stage + Food', basePrice: 500 },
];

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState('basic');

  const selectedTicket = TICKET_OPTIONS.find(t => t.id === selectedTicketId) || TICKET_OPTIONS[0];
  const gstAmount = selectedTicket.basePrice * 0.05;
  const totalAmount = selectedTicket.basePrice + gstAmount;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      referralCode: formData.get('referralCode') || null,
      amountPaid: totalAmount,
      ticketType: selectedTicketId,
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        window.location.href = result.paymentUrl;
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col p-4 md:p-8 font-sans">
      <div className="max-w-6xl w-full mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: Ticket Selection */}
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">Select Your Ticket</h1>
          <p className="text-gray-400 mb-8 text-lg">Choose the perfect experience for Felicity 2026 at Mahindra Elite Meerpet.</p>
          
          <div className="space-y-4">
            {TICKET_OPTIONS.map((ticket) => (
              <label 
                key={ticket.id}
                className={`block cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                  selectedTicketId === ticket.id 
                    ? 'border-indigo-500 bg-indigo-900/20' 
                    : 'border-gray-800 bg-[#111] hover:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <input 
                      type="radio" 
                      name="ticketType" 
                      value={ticket.id} 
                      checked={selectedTicketId === ticket.id}
                      onChange={() => setSelectedTicketId(ticket.id)}
                      className="w-5 h-5 text-indigo-500 bg-gray-900 border-gray-700 focus:ring-indigo-500 focus:ring-2"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{ticket.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">₹{ticket.basePrice} + 5% GST</p>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-indigo-400">
                    ₹{ticket.basePrice}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Right Side: Form and Invoice */}
        <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 h-fit">
          <h2 className="text-2xl font-bold mb-6">Attendee Details</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Referral Code (Optional)</label>
              <input
                type="text"
                name="referralCode"
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all uppercase"
                placeholder="PROMOTER123"
              />
            </div>

            <div className="mt-8 border-t border-gray-800 pt-6">
              <h3 className="text-lg font-bold mb-4">Invoice Summary</h3>
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-gray-800 space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>{selectedTicket.name} Ticket</span>
                  <span>₹{selectedTicket.basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>GST (5%)</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between font-bold text-lg text-white">
                  <span>Total Payable</span>
                  <span className="text-indigo-400">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-lg"
            >
              {loading ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)}`}
            </button>
            <p className="text-center text-gray-600 text-xs mt-4">
              Secure payments powered by PayU.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
