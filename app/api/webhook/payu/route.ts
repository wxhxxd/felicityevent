import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateQRAndSendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    // PayU Webhooks usually send URL-encoded form data
    const text = await request.text();
    const formData = new URLSearchParams(text);
    
    // Convert to a plain object for easier access
    const data = Object.fromEntries(formData.entries());
    console.log('Received PayU Webhook:', data);

    // Common fields from PayU Webhook (may vary depending on exact setup)
    const status = data.status || data.txStatus;
    const email = data.email || data.customerEmail || data.udf1; // Usually email is passed directly
    
    // We only process if it's a success
    if (status && status.toLowerCase() === 'success') {
      if (!email) {
        console.error('Webhook received success but no email was found in payload.');
        return NextResponse.json({ success: true, message: 'Missing email, ignored' });
      }

      // Find the pending ticket by email
      const ticket = await prisma.ticket.findUnique({
        where: { email },
      });

      if (!ticket) {
        console.error(`No pending ticket found for email: ${email}`);
        return NextResponse.json({ success: true, message: 'User not found, ignored' });
      }

      if (ticket.status !== 'SUCCESS') {
        // Update ticket to SUCCESS
        const updatedTicket = await prisma.ticket.update({
          where: { id: ticket.id },
          data: { status: 'SUCCESS' },
        });

        // Generate QR code and send Email
        await generateQRAndSendEmail(updatedTicket);
        console.log(`Ticket generated and email sent for ${email}`);
      } else {
        console.log(`Ticket already processed for ${email}`);
      }
    }

    // Always respond with 200 OK so PayU knows we received it
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook Error:', error);
    // Still return 200 so PayU doesn't retry indefinitely
    return NextResponse.json({ success: true, error: 'Internal logic error' });
  }
}
