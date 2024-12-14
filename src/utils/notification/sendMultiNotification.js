import expo from "../../config/expo.js";

/**
 * Mengirim notifikasi serentak ke banyak pengguna
 * @param {string[]} pushTokens - Array Expo Push Token pengguna
 * @param {string} title - Judul notifikasi
 * @param {string} body - Isi notifikasi
 * @param {object} data - Data tambahan untuk notifikasi (opsional)
 * @returns {Promise<object[]>} - Respons dari pengiriman notifikasi
 */
export const sendMultiNotification = async (pushTokens, title, body, data = {}) => {
    if (!Array.isArray(pushTokens) || pushTokens.length === 0) {
        return;
    }

    const messages = pushTokens.map(token => ({
        to: token,
        sound: 'notification.mp3',
        title,
        body,
        data,
    }));

    const chunks = expo.chunkPushNotifications(messages);
    const receipts = [];

    for (let chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            receipts.push(...ticketChunk);
        } catch (error) {
            console.error('Error sending chunk of bulk notifications:', error);
        }
    }

    console.log('Bulk Notification Receipts:', receipts);
    return receipts;
};

export default sendMultiNotification;
