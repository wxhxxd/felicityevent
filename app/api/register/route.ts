import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const PAYMENT_LINKS = {
  'basic': 'https://u.payu.in/PAYUMN/LrpLU8Lt5fYZ',
  'stage': 'https://u.payu.in/PAYUMN/JIjbFik1bp0h',
  'vip': 'https://u.payu.in/PAYUMN/sJQ9hJjpLRlS'
};

const MAX_TICKETS = 500;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, ticketType, referralCode, amountPaid } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if limit is reached
    const ticketCount = await prisma.ticket.count({
      where: { status: 'SUCCESS' }
    });

    if (ticketCount >= MAX_TICKETS) {
      return NextResponse.json({ error: 'Sorry, the event is sold out (Limit 500 reached).' }, { status: 400 });
    }

    // Upsert the user ticket (in case they tried before and it was PENDING)
    // If they already have a SUCCESS ticket, we should block them.
    const existingTicket = await prisma.ticket.findUnique({ where: { email } });
    
    if (existingTicket && existingTicket.status === 'SUCCESS') {
      return NextResponse.json({ error: 'You have already purchased a ticket with this email.' }, { status: 400 });
    }

    if (existingTicket) {
      // Update details just in case
      await prisma.ticket.update({
        where: { email },
        data: { 
          name, 
          phone, 
          status: 'PENDING',
          referralCode: referralCode || null,
          amountPaid: amountPaid ? parseFloat(amountPaid) : null
        }
      });
    } else {
      // Create new pending ticket
      await prisma.ticket.create({
        data: { 
          name, 
          email, 
          phone, 
          status: 'PENDING',
          referralCode: referralCode || null,
          amountPaid: amountPaid ? parseFloat(amountPaid) : null
        }
      });
    }

    const paymentUrl = PAYMENT_LINKS[ticketType as keyof typeof PAYMENT_LINKS] || PAYMENT_LINKS['basic'];

    // Return success and the payment link
    return NextResponse.json({ paymentUrl }, { status: 200 });
    
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
