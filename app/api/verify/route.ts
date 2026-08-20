import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    if (ticket.status !== 'SUCCESS') {
      return NextResponse.json({ error: 'Ticket payment is pending or failed' }, { status: 400 });
    }

    if (ticket.scanned) {
      return NextResponse.json({ 
        error: 'Ticket has already been scanned/used!',
        ticket 
      }, { status: 400 });
    }

    // Mark as scanned
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { scanned: true }
    });

    return NextResponse.json({ success: true, ticket: updatedTicket });

  } catch (error) {
    console.error('Verify Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
