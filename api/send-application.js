const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const data = req.body;
  if (!data || !data.fullName || !data.email) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Read SMTP config from env
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.FROM_EMAIL || 'no-reply@livinglux.lu';
  const to = process.env.TO_EMAIL || 'info@livinglux.lu';

  if (!host || !port || !user || !pass) {
    res.status(500).json({ error: 'SMTP not configured on server' });
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass },
  });

  const subject = `New application from ${data.fullName} for ${data.propertyName || ''} - ${data.roomName || ''}`;
  const html = `
    <h2>New Application</h2>
    <p><strong>Name:</strong> ${data.fullName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || ''}</p>
    <p><strong>Profession:</strong> ${data.profession || ''}</p>
    <p><strong>Move-in Date:</strong> ${data.moveInDate || ''}</p>
    <p><strong>Property:</strong> ${data.propertyName || ''}</p>
    <p><strong>Room:</strong> ${data.roomName || ''}</p>
    <p><strong>Message:</strong></p>
    <p>${(data.message || '').replace(/\n/g, '<br/>')}</p>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error sending mail', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
};
