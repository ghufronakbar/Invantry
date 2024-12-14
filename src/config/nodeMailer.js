import nodemailer from 'nodemailer';
import { NODEMAILER_EMAIL, NODEMAILER_PASS } from '../constant/nodeMailer.js';

const nodeMailer = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: NODEMAILER_EMAIL,
        pass: NODEMAILER_PASS,
    },
    from: NODEMAILER_EMAIL,
});

export default nodeMailer