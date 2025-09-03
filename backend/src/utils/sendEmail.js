import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use: host, port, secure if custom SMTP
      auth: {
        user: process.env.EMAIL_USER, // your Gmail/SMTP email
        pass: process.env.EMAIL_PASS, // your App Password
      },
    });

    const mailOptions = {
      from: `"MedRush" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email not sent:", error.message);
    throw new Error("Email not sent");
  }
};

export default sendEmail;
