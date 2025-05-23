import config from '../../app/config';
import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production', // true for port 465, false for other ports
    auth: {
      user: 'kmdripon1991@gmail.com',
      pass: 'wnek gian vdti drty',
    },
  });

  await transporter.sendMail({
    from: 'kmdripon1991@gmail.com', // sender address
    to, // list of receivers
    subject: 'Password reset', // Subject line
    text: 'Are you want to change password?', // plain text body
    html, // html body
  });
};
