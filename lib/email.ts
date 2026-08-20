import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

// Test Account from Ethereal Email (will print a URL to preview emails in console)
let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (!transporter) {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  return transporter;
}

export async function generateQRAndSendEmail(ticket: { id: string; name: string; email: string }) {
  try {
    const tp = await getTransporter();

    // Generate QR Code data URL with the verification link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const qrDataUrl = await QRCode.toDataURL(`${baseUrl}/verify?id=${ticket.id}`, {
      color: { dark: '#000000', light: '#ffffff' },
      width: 300,
    });

    // Send Email
    const info = await tp.sendMail({
      from: '"Felicity Event" <tickets@felicity.com>',
      to: ticket.email,
      subject: '🎫 Your Ticket for Felicity 2026',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h1 style="color: #2563eb; text-align: center;">Felicity 2026</h1>
          <p>Hi <strong>${ticket.name}</strong>,</p>
          <p>Thank you for registering! Your payment was successful.</p>
          <p>Please present the QR code below at the registration desk on the day of the event.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <img src="cid:qrcode" alt="Ticket QR Code" style="border: 2px solid #eaeaea; border-radius: 10px;" />
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>Ticket ID:</strong> ${ticket.id}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> October 15, 2026</p>
            <p style="margin: 5px 0;"><strong>Venue:</strong> Grand Convention Center</p>
          </div>
          
          <p style="text-align: center; color: #6b7280; font-size: 12px;">See you there!</p>
        </div>
      `,
      attachments: [
        {
          filename: 'ticket-qr.png',
          path: qrDataUrl,
          cid: 'qrcode', // same cid value as in the html img src
        },
      ],
    });

    console.log('Ticket email sent! Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return nodemailer.getTestMessageUrl(info);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
