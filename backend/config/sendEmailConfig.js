// ../config/sendEmailConfig.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); // Load .env variables

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default transporter;
