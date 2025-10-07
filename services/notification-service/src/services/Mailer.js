import nodemailer from 'nodemailer';
import logger from '../../../../shared/utils/logger.js';
import fs from 'fs';
import path from 'path';
import { generateInvitationEmailHTML } from './InvitationEmailTemplate.js';

let transporterPromise;

async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  const hasEnvSmtp = Boolean(
    process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS
  );

  if (hasEnvSmtp) {
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT || 587),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      })
    );
    return transporterPromise;
  }

  // Fallback to Ethereal test account for development
  transporterPromise = nodemailer.createTestAccount().then(account => {
    logger.info('Using Ethereal test SMTP account');
    return nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  });
  return transporterPromise;
}

export async function sendInvitationEmail({
  to,
  token,
  tempPassword,
  authType,
}) {
  const inviteLink = `${process.env.APP_URL || 'http://localhost:3000'}/invite?token=${encodeURIComponent(
    token
  )}`;
  const subject = 'You are invited to SociaLens';

  const html = generateInvitationEmailHTML({
    inviteLink,
    tempPassword,
    authType,
  });

  const mail = {
    from: process.env.MAIL_FROM || 'no-reply@socialens.com',
    to,
    subject,
    html,
  };

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail(mail);
    logger.info('Invitation email sent', { to });

    // Log preview URL when using Ethereal
    const previewUrl = nodemailer.getTestMessageUrl?.(info);
    if (previewUrl) {
      logger.info('Ethereal preview URL', { url: previewUrl });
      try {
        const outPath = path.resolve(process.cwd(), 'last-email-preview.txt');
        fs.writeFileSync(outPath, String(previewUrl), { encoding: 'utf8' });
      } catch (e) {
        logger.warn('Failed to write preview URL to file', {
          error: e.message,
        });
      }
    }
  } catch (err) {
    logger.error('Failed to send invitation email', { error: err.message });
    throw err;
  }
}
