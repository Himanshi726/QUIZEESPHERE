const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false, // TLS
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const htmlMessage = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
      <div style="background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -1px;">Quizee<span style="color: #4f46e5;">sphere</span></h1>
          <p style="color: #64748b; margin: 6px 0 0; font-size: 14px;">Quiz Platform</p>
        </div>
        <h2 style="color: #0f172a; font-size: 20px; margin: 0 0 12px;">${options.subject}</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
          ${options.message}
        </p>
        ${options.link ? `
        <div style="text-align: center; margin: 32px 0;">
          <a href="${options.link}" style="background: #4f46e5; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">
            ${options.linkText || 'Click Here'}
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">Or copy this link: <a href="${options.link}" style="color: #4f46e5;">${options.link}</a></p>
        ` : ''}
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          If you did not create an account, please ignore this email.<br/>
          &copy; ${new Date().getFullYear()} Quizeesphere Platform
        </p>
      </div>
    </div>
  `;

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: htmlMessage
  };

  const info = await transporter.sendMail(message);
  console.log('Email sent: %s', info.messageId);
};

module.exports = sendEmail;
