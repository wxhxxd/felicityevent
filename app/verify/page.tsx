'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyTicketContent() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('id');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');
  const [message, setMessage] = useState('');
  const [ticketData, setTicketData] = useState<any>(null);

  const checkIn = async () => {
    if (!ticketId) {
      setStatus('error');
      setMessage('No ticket ID provided in the URL.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId })
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('VALID TICKET - Checked In Successfully!');
        setTicketData(data.ticket);
      } else {
        setStatus('error');
        setMessage(data.error || 'Invalid Ticket');
        if (data.ticket) setTicketData(data.ticket);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6">Scan Result</h1>
        
        {status === 'idle' && (
          <div>
            <p className="text-gray-600 mb-6">You scanned ticket: <br/><span className="font-mono text-xs">{ticketId}</span></p>
            <button 
              onClick={checkIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-colors"
            >
              Verify & Check-In
            </button>
          </div>
        )}

        {status === 'loading' && <p className="text-gray-500 font-medium animate-pulse">Verifying ticket securely...</p>}

        {status === 'success' && (
          <div className="bg-green-100 text-green-800 p-6 rounded-xl border border-green-200">
            <h2 className="text-2xl font-black mb-2">{message}</h2>
            {ticketData && (
              <div className="text-left mt-4 text-green-900">
                <p><strong>Name:</strong> {ticketData.name}</p>
                <p><strong>Email:</strong> {ticketData.email}</p>
                <p><strong>Phone:</strong> {ticketData.phone}</p>
              </div>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-100 text-red-800 p-6 rounded-xl border border-red-200">
            <h2 className="text-2xl font-black mb-2">❌ {message}</h2>
            {ticketData && (
              <div className="text-left mt-4 text-red-900">
                <p><strong>Name:</strong> {ticketData.name}</p>
                <p><strong>Email:</strong> {ticketData.email}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function VerifyTicket() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading scanner...</div>}>
      <VerifyTicketContent />
    </Suspense>
  );
}
