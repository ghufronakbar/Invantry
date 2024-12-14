import nodeMailer from "../../config/nodeMailer.js";
import { emailTemplate } from "./view/emailTemplate.js";

const sendEmail = async (to, type, link, name, PASSWORD = '') => {
    let content = '';
    let message = '';
    let subject = '';
    let isLink = true;
    let isPassword = false;

    switch (type) {
        case 'REJECT_ADMIN':
            message = 'Mohon maaf, akun anda ditolak';
            content = 'Silahkan hubungi admin';
            subject = 'Informasi Pembuatan Akun Sigap Si Poles';
            isLink = false;
            break;
        case 'DELETE_ADMIN':
            message = 'Akun anda telah dihapus';
            content = 'Silahkan hubungi admin';
            subject = 'Informasi Hapus Akun Sigap Si Poles';
            isLink = false;
            break;
        case 'APPROVE_ADMIN':
            message = 'Akun anda telah diterima. Silahkan login dengan password berikut! ';
            content = PASSWORD;
            subject = 'Informasi Terima Akun Sigap Si Poles';
            isLink = false;
            isPassword = true;

            break;
        case 'REJECT_USER':
            message = 'Mohon maaf, akun anda ditolak';
            content = 'Silahkan hubungi admin';
            subject = 'Informasi Pembuatan Akun Sigap Si Poles';
            isLink = false;
            break;
        case 'DELETE_DRIVER':
            message = 'Akun anda telah dihapus';
            content = 'Silahkan hubungi admin';
            subject = 'Informasi Hapus Akun Sigap Si Poles';
            isLink = false;
            break;
        case 'APPROVE_USER':
            message = 'Akun anda telah diterima. Silahkan login dengan password berikut! ';
            content = PASSWORD;
            subject = 'Informasi Terima Akun Sigap Si Poles';
            isLink = false;
            isPassword = true;
            break;
        case 'RESET_PASSWORD':
            message = 'Anda meminta untuk mereset kata sandi Anda';
            content = 'Reset kata sandi Anda';
            subject = 'Reset Password Sigap Si Poles';
            isLink = true;
            break;
        case 'NEW_PASSWORD':
            message = 'Kata sandi Anda telah diubah. Silahkan login dengan password berikut!';
            content = PASSWORD;
            subject = 'Reset Password Sigap Si Poles';
            isLink = false;
            isPassword = true;
            break;
        case 'CREATE_VENDOR':
            message = 'Akun anda telah diterima. Silahkan login dengan password berikut! ';
            content = PASSWORD;
            subject = 'Informasi Terima Akun Vendor Sigap Si Poles';
            isLink = false;
            isPassword = true;
            break;
        default:
            content = 'XXX';
            subject = 'Informasi Sigap Si Poles';
            isLink = false;
            break;
    }

    const html = emailTemplate(name, link, message, content, isLink, isPassword);

    const msg = {
        from: '"Sigap SiPoles" <main@sigapsipoles.com>',
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
