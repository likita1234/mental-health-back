const nodemailer = require('nodemailer');
const email_host = process.env.EMAIL_HOST;
const email_user = process.env.EMAIL_USERNAME;
const email_pass = process.env.EMAIL_PASSWORD;
const port = process.env.EMAIL_PORT;

const sendEmail = async (options) => {
  // 1) Creation of Transporter
  //   GMAIL CONFIGURATION
  const transporter = nodemailer.createTransport({
    host: email_host,
    port,
    auth: {
      user: email_user,
      pass: email_pass,
    },
  });
  // 2) Define the email options
  const mailOptions = {
    from: 'Likita Maharjan <likitaof2015@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
