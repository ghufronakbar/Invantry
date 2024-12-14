import expo from '../../config/expo.js';

/**
 * Mengirim notifikasi ke satu pengguna secara individu
 * @param {string} pushToken - Expo Push Token untuk pengguna
 * @param {string} title - Judul notifikasi
 * @param {string} body - Isi notifikasi
 * @param {object} data - Data tambahan untuk notifikasi (opsional)
 * @returns {Promise<object>} - Respons dari pengiriman notifikasi
 */
const sendSingleNotification = async (pushToken, title, body, data = {}) => {

    const message = {
        to: pushToken,
        sound: 'notification.mp3',
        title,
        body,
        data,
    };

    try {
        const receipts = await expo.sendPushNotificationsAsync([message]);
        console.log('Individual Notification Receipt:', receipts);
        return receipts;
    } catch (error) {
        console.error('Error sending individual notification:', error);
        throw error;
    }
};

export default sendSingleNotification;