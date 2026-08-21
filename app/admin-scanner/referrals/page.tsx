import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ReferralsDashboard() {
  // Query all SUCCESS tickets that have a referral code
  const tickets = await prisma.ticket.findMany({
    where: {
      status: 'SUCCESS',
      referralCode: { not: null }
    }
  });

  // Group by referral code and calculate totals
  const referralData: Record<string, { totalTickets: number, totalAmount: number, commissionOwed: number }> = {};

  tickets.forEach(ticket => {
    const code = ticket.referralCode?.toUpperCase() || 'UNKNOWN';
    const amount = ticket.amountPaid || 0; // fallback to 0 if amountPaid wasn't recorded
    
    if (!referralData[code]) {
      referralData[code] = { totalTickets: 0, totalAmount: 0, commissionOwed: 0 };
    }
    
    referralData[code].totalTickets += 1;
    referralData[code].totalAmount += amount;
    referralData[code].commissionOwed += (amount * 0.05); // 5% commission
  });

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center p-6 text-white">
      <div className="w-full max-w-4xl mt-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Referral Dashboard</h1>
          <a href="/admin-scanner" className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-lg transition">
            Back to Scanner
          </a>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-5 font-semibold">Promoter Code</th>
                <th className="p-5 font-semibold text-center">Tickets Sold</th>
                <th className="p-5 font-semibold text-right">Total Revenue</th>
                <th className="p-5 font-semibold text-right text-indigo-400">5% Payout Owed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {Object.keys(referralData).length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                    No referrals recorded yet.
                  </td>
                </tr>
              ) : (
                Object.entries(referralData).map(([code, stats]) => (
                  <tr key={code} className="hover:bg-gray-750 transition-colors">
                    <td className="p-5 font-mono font-bold text-white text-lg">
                      {code}
                    </td>
                    <td className="p-5 text-center font-medium">
                      <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                        {stats.totalTickets}
                      </span>
                    </td>
                    <td className="p-5 text-right font-medium">
                      ₹{stats.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-5 text-right font-bold text-indigo-400 text-lg">
                      ₹{stats.commissionOwed.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <p className="mt-8 text-gray-500 text-sm text-center">
          Note: This table only includes tickets where the payment status is marked as SUCCESS.
        </p>
      </div>
    </main>
  );
}
