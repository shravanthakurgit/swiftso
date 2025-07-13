import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import puppeteer from 'puppeteer';

export const generateInvoice = async (data) => {
  try {
    const templatePath = path.join(process.cwd(), 'templates', 'invoice.ejs');
    const html = await ejs.renderFile(templatePath, data);

    const invoicesDir = path.join(process.cwd(), 'invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfPath = path.join(invoicesDir, `invoice-${data.paymentId}.pdf`);
    await page.pdf({ path: pdfPath, format: 'A4' });

    await browser.close();
    return pdfPath;

  } catch (err) {
    console.error("Invoice generation error:", err);
    throw err;
  }
};
