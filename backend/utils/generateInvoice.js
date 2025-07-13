
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';


const isProd = process.env.NODE_ENV === 'production';

const puppeteer = isProd
  ? await import('puppeteer-core')
  : await import('puppeteer');

const chromium = isProd ? await import('@sparticuz/chromium') : null;



export const generateInvoice = async (data) => {
  try {
    const templatePath = path.join(process.cwd(), 'templates', 'invoice.ejs');
    const html = await ejs.renderFile(templatePath, data);

    const invoicesDir = path.join(process.cwd(), 'invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

   const browser = await puppeteer.default.launch({
  headless: true,
  args: isProd ? chromium.default.args : [],
  executablePath: isProd ? await chromium.default.executablePath() : undefined,
  defaultViewport: isProd ? chromium.default.defaultViewport : undefined,
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
