import transporter from "../config/sendEmailConfig.js";



const sendOTPEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Swiftso Support" <noreplySwiftSo@gmail.com>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

export default sendOTPEmail;
