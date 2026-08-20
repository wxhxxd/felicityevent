import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

// Create transporter using real email credentials from environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function generateQRAndSendEmail(ticket: { id: string; name: string; email: string }) {
  try {
    // Generate QR Code data URL with the verification link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const qrDataUrl = await QRCode.toDataURL(`${baseUrl}/verify?id=${ticket.id}`, {
      color: { dark: '#000000', light: '#ffffff' },
      width: 300,
    });

    // Send Email
    const info = await transporter.sendMail({
      from: '"Felicity Event" <tickets@felicity.com>',
      to: ticket.email,
      subject: '🎫 Your Ticket for Felicity 2026',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000; color: #fff; padding: 40px 20px; text-align: center;">
          <div style="max-w: 500px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 1px solid #e879f9; border-radius: 20px; overflow: hidden; box-shadow: 0 0 30px rgba(232, 121, 249, 0.3);">
            
            <div style="background: linear-gradient(90deg, #e879f9, #22d3ee); padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: #000; font-size: 28px; font-weight: 900; letter-spacing: 2px;">FELICITY 2026</h1>
              <p style="margin: 5px 0 0 0; color: #000; font-weight: 600; font-size: 12px; letter-spacing: 4px;">VIP ACCESS PASS</p>
            </div>

            <div style="padding: 30px 20px;">
              <h2 style="margin: 0 0 10px 0; color: #fff; font-size: 24px;">Hi ${ticket.name},</h2>
              <p style="color: #a0aec0; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                Your payment was successful. Here is your official entry ticket. Present this QR code at the gates.
              </p>

              <div style="background-color: #fff; padding: 20px; border-radius: 10px; display: inline-block; margin-bottom: 20px;">
                <img src="cid:qrcode" alt="Ticket QR Code" style="width: 200px; height: 200px; display: block;" />
              </div>

              <div style="text-align: left; background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; margin-top: 10px;">
                <p style="margin: 0 0 10px 0; color: #a0aec0; font-size: 12px; text-transform: uppercase;">Ticket Holder</p>
                <p style="margin: 0 0 20px 0; color: #fff; font-size: 18px; font-weight: bold;">${ticket.name}</p>
                
                <p style="margin: 0 0 10px 0; color: #a0aec0; font-size: 12px; text-transform: uppercase;">Ticket ID</p>
                <p style="margin: 0; color: #e879f9; font-size: 14px; font-family: monospace;">${ticket.id}</p>
              </div>
            </div>

            <div style="border-top: 1px dashed #4a5568; padding: 20px; background-color: #0f172a;">
              <p style="margin: 0; color: #718096; font-size: 12px;">
                DATE: SEP 12, 2026<br/>
                TIME: 10:30 AM ONWARDS
              </p>
            </div>
          </div>
          <p style="color: #4a5568; font-size: 12px; margin-top: 20px;">Do not share this QR code with anyone.</p>
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

    console.log('Ticket email sent to:', ticket.email);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
