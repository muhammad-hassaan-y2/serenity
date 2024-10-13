import nodemailer from "nodemailer";

export const sendVerificationCode = async (email: string, code: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
  });
};
