const nodemailer = require("nodemailer");

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: "rishirajprasadyadav8@gmail.com",
    pass: "mkrj lyjy iymz kgev",
  },
});

// Email sending function
async function sendWelcomeEmail(name, email) {
  try {
    const info = await transporter.sendMail({
      from: `"Rishi Yadav" <rishirajprasadyadav8@gmail.com>`,
      to: email,
      subject: "Welcome to Our Platform!",
      text: `Hello ${name},\n\nWelcome to our platform! We're excited to have you onboard.\n\nBest regards,\nRishi Yadav`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2E86C1;">Hello ${name},</h2>
          <p>Welcome to our platform! We're excited to have you onboard.</p>
          <p style="font-weight: bold; color: #555;">Best regards,</p>
          <p style="font-size: 16px; color: #2E86C1;">Rishi Yadav</p>
        </div>
      `,
    });

  } catch (err) {
    console.error("Error sending email:", err);
  }
}


module.exports = { sendWelcomeEmail };
