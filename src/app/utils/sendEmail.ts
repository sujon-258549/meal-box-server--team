import nodemailer from 'nodemailer';
import config from '../config';
export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production', // true for port 465, false for other ports
    auth: {
      user: 'mdsujon258549@gmail.com',
      pass: 'zxyr hvfh yhat mree',
    },
  });
  await transporter.sendMail({
    from: 'mdsujon258549@gmail.com', // sender address
    to: to, // list of receivers
    subject: 'Place change your Password ✔', // Subject line
    text: 'Hi there We received a request to reset your password. If you did not make this request, you can safely ignore this email.To reset your password, please click the link below:',
    html: html, // html body
  });
};
