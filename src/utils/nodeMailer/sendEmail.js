import nodeMailer from "../../config/nodeMailer.js";
import { emailTemplate } from "./view/emailTemplate.js";

const sendEmail = async (to, type, link, name, PASSWORD = '') => {
    let content = '';
    let message = '';
    let subject = '';
    let isLink = true;
    let isPassword = false;

    switch (type) {       
        case 'CONFIRM_ACCOUNT':
            message = 'Akun anda telah diterima. Silahkan login dengan password berikut! ';
            content = PASSWORD;
            subject = 'Informasi Terima Akun Inventra';
            isLink = false;
            isPassword = true;
            break;        
        case 'CREATE_ACCOUNT':
            message = 'Untuk mengaktifkan akun anda, silahkan klik link berikut! ';
            content = 'Konfirmasi Email';
            subject = 'Konfirmasi Email Akun Baru Inventra';
            isLink = true;
            break;
        default:
            content = 'XXX';
            subject = 'Informasi Inventra';
            isLink = false;
            break;
    }

    const html = emailTemplate(name, link, message, content, isLink, isPassword);

    const msg = {
        from: '"Invantry" <main@invantry.com>',
        to,
        subject,
        html,
    };

    try {
        await nodeMailer.sendMail(msg);
    } catch (error) {
        return new Error('Gagal mengirim email ');
    }
};


export default sendEmail;
