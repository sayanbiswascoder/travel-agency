const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const sourcePath = path.join(process.cwd(), 'app', 'utils', 'invoice.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    esModuleInterop: true,
  },
}).outputText;

const outDir = path.join(process.cwd(), 'tmp', 'pdfs');
fs.mkdirSync(outDir, { recursive: true });
const compiledPath = path.join(outDir, 'invoice-util.cjs');
fs.writeFileSync(compiledPath, compiled);

const { createInvoicePdf } = require(compiledPath);
const pdf = createInvoicePdf({
  invoiceId: 'order_invoice_design_sample',
  paymentId: 'pay_invoice_design_sample',
  customerName: 'Anaya Sharma',
  email: 'traveler@example.com',
  mobile: '+91 98765 43210',
  packageName: 'Himalayan Escape Premium Journey',
  amountPaid: 1875,
  travelers: '3',
  travelDate: '2026-10-18',
  issuedAt: new Date('2026-08-16T15:30:00+05:30'),
});

fs.writeFileSync(path.join(outDir, 'invoice-design-sample.pdf'), pdf.buffer);
console.log(path.join(outDir, 'invoice-design-sample.pdf'));
