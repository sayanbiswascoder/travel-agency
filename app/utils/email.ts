import nodemailer from 'nodemailer';
import type { BookingInvoice, InvoicePdf } from './invoice';
import { createInvoiceHtml } from './invoice';

export type EmailSendResult = {
  sent: boolean;
  skipped: boolean;
  message?: string;
};

export async function sendBookingInvoiceEmail(
  invoice: BookingInvoice,
  pdf: InvoicePdf
): Promise<EmailSendResult> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailFrom = process.env.EMAIL_FROM || smtpUser;

  if (!invoice.email) {
    return { sent: false, skipped: true, message: 'Customer email was not provided.' };
  }

  if (!smtpHost || !smtpUser || !smtpPass || !emailFrom) {
    return { sent: false, skipped: true, message: 'SMTP is not configured on the server.' };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: emailFrom,
    to: invoice.email,
    subject: `Your booking invoice - ${invoice.invoiceId}`,
    html: createInvoiceHtml(invoice),
    attachments: [
      {
        filename: pdf.filename,
        content: pdf.buffer,
        contentType: pdf.contentType,
      },
    ],
  });

  return { sent: true, skipped: false };
}
