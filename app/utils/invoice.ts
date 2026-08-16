export type BookingInvoice = {
  invoiceId: string;
  paymentId: string;
  customerName: string;
  email?: string;
  mobile?: string;
  packageName?: string;
  amountPaid: number;
  travelers?: string | number;
  travelDate?: string;
  issuedAt: Date;
};

export type InvoicePdf = {
  filename: string;
  contentType: 'application/pdf';
  buffer: Buffer;
  base64: string;
};

type PdfTextOptions = {
  x: number;
  y: number;
  size: number;
  text: string;
  font?: 'regular' | 'bold';
  color?: [number, number, number];
};

const textEncoder = new TextEncoder();
const pageWidth = 420;
const pageHeight = 595;

function normalizeRgb(color: [number, number, number]): [number, number, number] {
  return color.map((channel) => (channel > 1 ? channel / 255 : channel)) as [number, number, number];
}

function escapePdfText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

function formatAmount(amount: number) {
  return `INR ${amount.toFixed(2)}`;
}

function formatValue(value: string | number | undefined) {
  return value ? String(value) : '-';
}

function clampText(value: string | number | undefined, maxLength = 48) {
  const text = formatValue(value);

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3)}...`;
}

function pdfText({ x, y, size, text, font = 'regular', color = [17, 24, 39] }: PdfTextOptions) {
  const fontName = font === 'bold' ? 'F2' : 'F1';
  const rgb = normalizeRgb(color);

  return [
    'BT',
    `${rgb[0]} ${rgb[1]} ${rgb[2]} rg`,
    `/${fontName} ${size} Tf`,
    `${x} ${y} Td`,
    `(${escapePdfText(text)}) Tj`,
    'ET',
  ].join('\n');
}

function pdfRect(x: number, y: number, width: number, height: number, color: [number, number, number]) {
  const rgb = normalizeRgb(color);
  return `${rgb[0]} ${rgb[1]} ${rgb[2]} rg\n${x} ${y} ${width} ${height} re f`;
}

function pdfStrokeRect(x: number, y: number, width: number, height: number, color: [number, number, number]) {
  const rgb = normalizeRgb(color);
  return `${rgb[0]} ${rgb[1]} ${rgb[2]} RG\n${x} ${y} ${width} ${height} re S`;
}

function pdfLine(x1: number, y1: number, x2: number, y2: number, color: [number, number, number]) {
  const rgb = normalizeRgb(color);
  return `${rgb[0]} ${rgb[1]} ${rgb[2]} RG\n${x1} ${y1} m ${x2} ${y2} l S`;
}

export function createInvoiceHtml(invoice: BookingInvoice) {
  return `
    <html>
      <body style="margin:0;background:#f4f1ec;font-family:Arial,Helvetica,sans-serif;color:#111827;">
        <div style="max-width:620px;margin:0 auto;padding:28px;">
          <div style="overflow:hidden;border:1px solid #e5e7eb;border-radius:22px;background:#ffffff;box-shadow:0 20px 60px rgba(15,23,42,0.08);">
            <div style="background:#10251f;color:#ffffff;padding:28px 32px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#b9d8ce;">Astra Travels</p>
              <h1 style="margin:0;font-size:28px;line-height:1.2;">Booking Invoice</h1>
              <p style="margin:10px 0 0;color:#dbe7e2;">Advance payment receipt for your upcoming journey.</p>
            </div>
            <div style="padding:28px 32px;">
              <table style="width:100%;border-collapse:collapse;margin-bottom:22px;">
                <tr>
                  <td style="font-size:12px;color:#6b7280;">Invoice ID</td>
                  <td style="font-size:12px;color:#6b7280;text-align:right;">Issued</td>
                </tr>
                <tr>
                  <td style="padding-top:6px;font-weight:700;">${invoice.invoiceId}</td>
                  <td style="padding-top:6px;text-align:right;font-weight:700;">${invoice.issuedAt.toLocaleString('en-IN')}</td>
                </tr>
              </table>
              <div style="border:1px solid #e5e7eb;border-radius:16px;padding:18px;margin-bottom:18px;">
                <h2 style="margin:0 0 12px;font-size:16px;">Traveler</h2>
                <p style="margin:6px 0;"><strong>Name:</strong> ${invoice.customerName}</p>
                <p style="margin:6px 0;"><strong>Email:</strong> ${invoice.email || '-'}</p>
                <p style="margin:6px 0;"><strong>Mobile:</strong> ${invoice.mobile || '-'}</p>
              </div>
              <div style="border:1px solid #e5e7eb;border-radius:16px;padding:18px;margin-bottom:18px;">
                <h2 style="margin:0 0 12px;font-size:16px;">Booking Details</h2>
                <p style="margin:6px 0;"><strong>Package:</strong> ${invoice.packageName || '-'}</p>
                <p style="margin:6px 0;"><strong>Travelers:</strong> ${invoice.travelers || '-'}</p>
                <p style="margin:6px 0;"><strong>Travel Date:</strong> ${invoice.travelDate || '-'}</p>
              </div>
              <div style="border-radius:16px;background:#ecfdf5;padding:20px;margin-top:8px;">
                <p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#047857;">Amount paid</p>
                <p style="margin:0;font-size:28px;font-weight:800;color:#064e3b;">${formatAmount(invoice.amountPaid)}</p>
                <p style="margin:10px 0 0;color:#475569;">Payment ID: ${invoice.paymentId}</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function createInvoicePdf(invoice: BookingInvoice): InvoicePdf {
  const issuedAt = invoice.issuedAt.toLocaleString('en-IN');
  const commands = [
    pdfRect(0, 0, pageWidth, pageHeight, [0.96, 0.94, 0.91]),
    pdfRect(30, 36, 360, 523, [1, 1, 1]),
    pdfStrokeRect(30, 36, 360, 523, [0.84, 0.86, 0.88]),
    pdfRect(30, 458, 360, 101, [0.06, 0.15, 0.13]),
    pdfRect(30, 458, 7, 101, [0.02, 0.72, 0.48]),
    pdfText({ x: 54, y: 522, size: 9, text: 'ASTRA TRAVELS', font: 'bold', color: [0.73, 0.85, 0.8] }),
    pdfText({ x: 54, y: 495, size: 24, text: 'Booking Invoice', font: 'bold', color: [1, 1, 1] }),
    pdfText({ x: 54, y: 475, size: 10, text: 'Advance payment receipt for your upcoming journey.', color: [0.86, 0.91, 0.89] }),
    pdfText({ x: 54, y: 423, size: 8, text: 'INVOICE ID', font: 'bold', color: [0.39, 0.45, 0.55] }),
    pdfText({ x: 54, y: 406, size: 11, text: clampText(invoice.invoiceId, 32), font: 'bold' }),
    pdfText({ x: 238, y: 423, size: 8, text: 'ISSUED', font: 'bold', color: [0.39, 0.45, 0.55] }),
    pdfText({ x: 238, y: 406, size: 10, text: issuedAt, font: 'bold' }),
    pdfLine(54, 386, 366, 386, [0.89, 0.91, 0.94]),
    pdfText({ x: 54, y: 356, size: 13, text: 'Traveler', font: 'bold' }),
    pdfText({ x: 54, y: 333, size: 9, text: 'Name', color: [0.39, 0.45, 0.55] }),
    pdfText({ x: 150, y: 333, size: 10, text: clampText(invoice.customerName), font: 'bold' }),
    pdfText({ x: 54, y: 313, size: 9, text: 'Email', color: [0.39, 0.45, 0.55] }),
    pdfText({ x: 150, y: 313, size: 10, text: clampText(invoice.email, 44) }),
    pdfText({ x: 54, y: 293, size: 9, text: 'Mobile', color: [0.39, 0.45, 0.55] }),
    pdfText({ x: 150, y: 293, size: 10, text: clampText(invoice.mobile, 36) }),
    pdfRect(54, 235, 312, 1, [0.89, 0.91, 0.94]),
    pdfText({ x: 54, y: 256, size: 13, text: 'Booking Details', font: 'bold' }),
    pdfText({ x: 54, y: 215, size: 9, text: 'Package', color: [0.39, 0.45, 0.55] }),
    pdfText({ x: 150, y: 215, size: 10, text: clampText(invoice.packageName, 42), font: 'bold' }),
    pdfText({ x: 54, y: 195, size: 9, text: 'Travelers', color: [0.39, 0.45, 0.55] }),
    pdfText({ x: 150, y: 195, size: 10, text: clampText(invoice.travelers, 20) }),
    pdfText({ x: 54, y: 175, size: 9, text: 'Travel Date', color: [0.39, 0.45, 0.55] }),
    pdfText({ x: 150, y: 175, size: 10, text: clampText(invoice.travelDate, 30) }),
    pdfRect(54, 83, 312, 68, [0.93, 0.99, 0.96]),
    pdfStrokeRect(54, 83, 312, 68, [0.68, 0.9, 0.82]),
    pdfText({ x: 72, y: 125, size: 8, text: 'AMOUNT PAID', font: 'bold', color: [0.02, 0.47, 0.32] }),
    pdfText({ x: 72, y: 101, size: 20, text: formatAmount(invoice.amountPaid), font: 'bold', color: [0.02, 0.31, 0.24] }),
    pdfText({ x: 218, y: 125, size: 8, text: 'PAYMENT ID', font: 'bold', color: [0.39, 0.45, 0.55] }),
    pdfText({ x: 218, y: 104, size: 9, text: clampText(invoice.paymentId, 24), color: [0.17, 0.24, 0.31] }),
    pdfText({ x: 54, y: 58, size: 8, text: 'Thank you for choosing Astra Travels. Please keep this invoice for your records.', color: [0.39, 0.45, 0.55] }),
  ].join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    `<< /Length ${textEncoder.encode(commands).length} >>\nstream\n${commands}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(textEncoder.encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = textEncoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const buffer = Buffer.from(pdf, 'utf8');
  const filename = `invoice-${invoice.invoiceId}.pdf`;

  return {
    filename,
    contentType: 'application/pdf',
    buffer,
    base64: buffer.toString('base64'),
  };
}
