import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { Jimp } from 'jimp';
import path from 'path';

// Create transporter using real email credentials from environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function generateQRAndSendEmail(ticket: { id: string; name: string; email: string; amountPaid?: number | null }) {
  try {
    // Generate QR Code data URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const qrDataUrl = await QRCode.toDataURL(`${baseUrl}/verify?id=${ticket.id}`, {
      color: { dark: '#000000', light: '#ffffff' },
      width: 140, // Increased to fit the box nicely
      margin: 1
    });

    // Extract base64 and create a buffer
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    const qrBuffer = Buffer.from(base64Data, 'base64');

    // Determine which ticket background to use
    let ticketType = '300';
    if (ticket.amountPaid) {
      if (ticket.amountPaid >= 500) ticketType = '500';
      else if (ticket.amountPaid >= 350) ticketType = '350';
    }

    // Load images
    const ticketPath = path.join(process.cwd(), 'public', 'tickets', `${ticketType}.jpg`);
    const ticketImg = await Jimp.read(ticketPath);
    const qrImg = await Jimp.read(qrBuffer);

    // Resize QR code exactly to fit the square on the ticket (approximately 112x112, placed at x: 440, y: 175)
    qrImg.resize({ w: 112, h: 112 }); 
    ticketImg.composite(qrImg, 440, 175);
    
    // Convert to buffer for email attachment
    const finalImageBuffer = await ticketImg.getBuffer('image/jpeg');

    // Send Email
    const info = await transporter.sendMail({
      from: '"Felicity Event" <tickets@felicity.com>',
      to: ticket.email,
      subject: '🎫 Your Official Ticket for Felicity 2026',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 40px 20px; text-align: center;">
          <h1 style="color: #e879f9;">FELICITY 2026</h1>
          <p style="font-size: 18px;">Hi ${ticket.name},</p>
          <p>Your payment was successful. Attached below is your official entry ticket.</p>
          <p style="color: #a0aec0; margin-bottom: 30px;">Please present this ticket and QR code at the gates.</p>
          
          <img src="cid:ticket" alt="Your Ticket" style="width: 100%; max-width: 800px; border-radius: 10px; box-shadow: 0 0 20px rgba(232, 121, 249, 0.4);" />
          
          <p style="margin-top: 30px; font-size: 12px; color: #4a5568;">Ticket ID: ${ticket.id}</p>
        </div>
      `,
      attachments: [
        {
          filename: 'felicity-ticket.jpg',
          content: finalImageBuffer,
          cid: 'ticket', 
        },
      ],
    });

    console.log('Composite ticket email sent to:', ticket.email);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
