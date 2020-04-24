const nodemailer = require('nodemailer');

const accioEmail = 'noreply.accio@gmail.com';
const emailPass = 'accioisbestapp123';

const publicUrl = 'http://ec2-18-219-23-20.us-east-2.compute.amazonaws.com:8080';

function sendMail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: accioEmail,
      pass: emailPass
    }
  });

  const mailOptions = {
    from: accioEmail,
    to: to,
    subject: subject,
    text: text
  };
  return transporter.sendMail(mailOptions);
}

function sendEmailVerification(to, code) {
  let body = "Click the link to verify your email.\n" + publicUrl + "/email/verifyemail?code=" + code;
  return sendMail(to, "Accio - Verify Your Email", body);
}

function sendPasswordReset(to, code) {
  let body = "Click the link to reset your password.\n" + publicUrl + "/email/passwordreset?code=" + code;
  return sendMail(to, "Accio - Password Reset", body);
}

module.exports = {
  sendMail: sendMail,
  sendEmailVerification: sendEmailVerification,
  sendPasswordReset: sendPasswordReset
};