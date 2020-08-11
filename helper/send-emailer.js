const nodemailer = require('nodemailer');
const config = require('../config/config');

module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = config.email.emailFrom }) {
    const transporter = nodemailer.createTransport(config.email.smtpOptions);
    await transporter.sendMail({ from, to, subject, html });
}