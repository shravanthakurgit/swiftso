import transporter from "../config/sendEmailConfig.js";


const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Swiftso" <noreplySwiftSo@gmail.com>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

export default sendEmail;
