// extractPushTokens.js

/**
 * Mengekstrak array objek yang memiliki struktur { pushNotifToken: string | null }[]
 * menjadi array string[] yang hanya berisi token yang valid (tidak null).
 * 
 * @param {Array<{ pushNotifToken: string | null }>} tokensArray - Array objek token
 * @returns {string[]} - Array token valid
 */
const extractPushTokens = (tokensArray) => {
    return tokensArray
        .map(item => item.pushNotifToken) // Ambil nilai pushNotifToken dari setiap objek
        .filter(token => token !== null); // Hanya ambil token yang tidak null
};

export default extractPushTokens;
