import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface OTPEmailData {
  userName: string;
  otpCode: string;
  expiryTime: number;
}

// Read HTML template
const getEmailTemplate = (): string => {
  try {
    // Try multiple possible paths
    const possiblePaths = [
      path.join(__dirname, "templates", "otp-email.template.html"),
      path.join(
        process.cwd(),
        "src",
        "services",
        "templates",
        "otp-email.template.html"
      ),
      path.join(
        process.cwd(),
        "dist",
        "services",
        "templates",
        "otp-email.template.html"
      ),
    ];

    for (const templatePath of possiblePaths) {
      if (fs.existsSync(templatePath)) {
        return fs.readFileSync(templatePath, "utf8");
      }
    }

    throw new Error("Template file not found in any expected location");
  } catch (error) {
    console.error("Error reading email template:", error);

    // Fallback: return a simple HTML template
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>OTP Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Verify Your Account</h2>
        <p>Hello {{userName}},</p>
        <p>Your verification code is: <strong style="font-size: 24px; color: #007bff;">{{otpCode}}</strong></p>
        <p>This code expires in {{expiryTime}} minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <p>Best regards,<br>Authify Team</p>
    </body>
    </html>`;
  }
};

// Generate OTP email HTML
export const generateOTPEmail = (data: OTPEmailData): string => {
  const template = getEmailTemplate();
  const currentYear = new Date().getFullYear();

  return template
    .replace(/\{\{userName\}\}/g, data.userName)
    .replace(/\{\{otpCode\}\}/g, data.otpCode)
    .replace(/\{\{expiryTime\}\}/g, data.expiryTime.toString())
    .replace(/\{\{currentYear\}\}/g, currentYear.toString());
};

// Email transporter configuration
const loadCreateTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send OTP email
export const sendOTPEmail = async (
  to: string,
  subject: string,
  otpData: OTPEmailData
): Promise<void> => {
  try {
    const transporter = loadCreateTransporter();
    const htmlContent = generateOTPEmail(otpData);
    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@authify.com",
      to,
      subject,
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};
