'use client';

import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function AdminScanner() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scanResult, setScanResult] = useState<{status: string, message: string, data?: any} | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const savedPin = localStorage.getItem('admin_pin');
    if (savedPin) {
      setPin(savedPin);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() !== '') {
      localStorage.setItem('admin_pin', pin);
      setIsAuthenticated(true);
    }
  };

  const startScanner = () => {
    setIsScanning(true);
    setScanResult(null);
  };

  useEffect(() => {
    if (isAuthenticated && isScanning) {
      const scanner = new Html5QrcodeScanner("reader", { 
        qrbox: { width: 250, height: 250 }, 
        fps: 5 
      }, false);

      scanner.render(async (decodedText) => {
        // Pause scanning while we verify
        scanner.pause(true);

        // Extract ID from the URL (since the QR code contains the full verification URL)
        let ticketId = decodedText;
        if (decodedText.includes('?id=')) {
          ticketId = decodedText.split('?id=')[1].split('&')[0];
        }

        try {
          const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: ticketId, pin: localStorage.getItem('admin_pin') })
          });
          const data = await res.json();

          if (res.ok) {
            setScanResult({ status: 'success', message: '✅ VALID & CHECKED IN', data: data.ticket });
          } else {
            setScanResult({ status: 'error', message: '❌ ' + (data.error || 'Invalid Ticket'), data: data.ticket });
            if (data.error === 'Invalid Admin PIN') {
              localStorage.removeItem('admin_pin');
              setIsAuthenticated(false);
            }
          }
        } catch (err) {
          setScanResult({ status: 'error', message: '❌ Network Error' });
        }

        // Resume scanning after 3 seconds automatically so they can scan the next person
        setTimeout(() => {
          setScanResult(null);
          scanner.resume();
        }, 3000);

      }, (error) => {
        // Ignore normal scan errors (happens every frame it doesn't see a QR)
      });

      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [isAuthenticated, isScanning]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-4 text-black">Admin Scanner</h1>
          <p className="text-gray-500 mb-6">Enter your Admin PIN to start scanning tickets.</p>
          <input 
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 mb-4 text-center text-2xl tracking-[0.5em] text-black"
            placeholder="PIN"
            required
          />
          <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded-xl text-lg">
            Login
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center p-6 text-white text-center">
      <div className="w-full max-w-md mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Fast Check-In Scanner</h1>
          <button 
            onClick={() => { localStorage.removeItem('admin_pin'); setIsAuthenticated(false); }}
            className="text-sm bg-gray-800 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {!isScanning ? (
          <button 
            onClick={startScanner}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-2xl text-2xl"
          >
            Open Camera
          </button>
        ) : (
          <div className="bg-white p-2 rounded-2xl overflow-hidden">
            <div id="reader" className="w-full text-black"></div>
          </div>
        )}

        {scanResult && (
          <div className={`mt-6 p-6 rounded-2xl border-4 ${scanResult.status === 'success' ? 'bg-green-500 border-green-300' : 'bg-red-500 border-red-300'}`}>
            <h2 className="text-3xl font-black mb-2 text-white">{scanResult.message}</h2>
            {scanResult.data && (
              <div className="text-left mt-4 text-white/90 bg-black/20 p-4 rounded-xl">
                <p><strong>Name:</strong> {scanResult.data.name}</p>
                <p><strong>Email:</strong> {scanResult.data.email}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
