const verifyEmailTemplate = ({name, url}) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background-color: #4f46e5; padding: 20px; color: white; text-align: center;">
          <h1 style="margin: 0;">Welcome to SwiftSo, ${name}!</h1>
        </div>
        <div style="padding: 30px; text-align: center;">
          <p style="font-size: 16px; color: #333;">Thank you for registering with <strong>SwiftSo</strong>.</p>
          <p style="font-size: 16px; color: #333;">Please verify your email address to activate your account.</p>
          <a href="${url}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Verify Email
          </a>
          <p style="font-size: 14px; color: #666;">If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="font-size: 14px; color: #4f46e5; word-break: break-all;">${url}</p>
        </div>
        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} SwiftSo. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

export default verifyEmailTemplate;
