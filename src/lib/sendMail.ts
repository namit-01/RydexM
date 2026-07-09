import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: "chaturvedinamit899@gmail.com",
    pass: process.env.PASS,
  },
});
export const sendMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: "Rydex ",
    to,
    subject,
    html,
  });
};
