// const nodemailer = require("nodemailer");
// require("dotenv").config();

// // Create Gmail SMTP transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_APP_PASSWORD, // 16-character App Password
//   },
// });

// /**
//  * Send password reset OTP email
//  * @param {string} toEmail - Recipient email
//  * @param {string} otpCode - 6-digit OTP
//  */
// const sendResetPasswordEmail = async (toEmail, otpCode) => {
//   const mailOptions = {
//     from: `"Smart Inventory System" <${process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject: "Your Password Reset OTP Code",
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
//         <h2 style="color: #2c3e50; text-align: center;">Password Reset Request</h2>
//         <p>You requested to reset your password for the <strong>Smart Inventory System</strong>.</p>
//         <p>Use the following One-Time Password (OTP) to proceed:</p>
//         <div style="background-color: #f4f6f8; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
//           <span style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #1a73e8;">${otpCode}</span>
//         </div>
//         <p style="color: #d93025; font-size: 14px;"><strong>Note:</strong> This OTP is valid for 15 minutes only.</p>
//         <p style="color: #5f6368; font-size: 13px;">If you did not request a password reset, please ignore this email.</p>
//       </div>
//     `,
//   };

//   return transporter.sendMail(mailOptions);
// };

// module.exports = {
//   sendResetPasswordEmail,
// };

const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail SMTP Connection Failed:", error.message);
  } else {
    console.log("✅ Gmail SMTP Server is connected and ready to send.");
  }
});

const sendResetPasswordEmail = async (toEmail, otpCode) => {
  try {
    const mailOptions = {
      from: `"Smart Inventory System" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Password Reset OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Your One-Time Password (OTP) code is:</p>
          <h1 style="color: #1a73e8; letter-spacing: 5px;">${otpCode}</h1>
          <p>This code expires in 15 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${toEmail}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${toEmail}:`, error.message);
    throw error;
  }
};

module.exports = {
  sendResetPasswordEmail,
};