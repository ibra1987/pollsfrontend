export default async function sendEmail({ receiver, name, subject, body }) {
  const { type, value } = body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "brahim.driouch1987@gmail.com",
      pass: "vxjszhjasomjxpnn",
    },
  });
  const options = {
    from: "brahim.driouch1987@gmail.com",
    to: receiver,
    subject: subject,
    type: value,
  };
}
