import cron from 'node-cron';
import sendMultiNotification from '../utils/notification/sendMultiNotification.js';
import extractPushToken from '../utils/notification/extractPushToken.js';
import sendSingleNotification from '../utils/notification/sendSingleNotification.js';
import { getAllAdminPushNotifTokenGeneral } from '../models/admin.js'
import { getLateOrders } from '../models/order.js'
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { getPushNotifTokenVendor } from '../models/vendor.js';
import { getPushNotifTokenUser } from '../models/user.js';

const reminderMonthly = async () => {
  const lastMonth = subMonths(new Date(), 1);
  const lastMonthFormatted = format(lastMonth, 'MMMM', { locale: id });

  const tokens = await getAllAdminPushNotifTokenGeneral();
  const extracted = await extractPushToken(tokens);

  await sendMultiNotification(
    extracted,
    'Waktunya Rekap Bulanan! 📊',
    `Jangan lupa, sudah waktunya untuk rekap bulanan! Cek semua data dan pastikan semuanya beres. Siap melangkah ke bulan berikutnya! 🌟`
  );
};

cron.schedule('0 7 1 * *', () => {
  try {
    console.log('Mengirim notifikasi pengingat bulanan');
    reminderMonthly();
  } catch (error) {
    console.log('Error pada cron job pengingat bulanan:', error);
  }
});

const reminderLateOrderDaily = async () => {
  const orders = await getLateOrders();
  orders.filter(order => order._count.trackings < 5);
  if (orders.length > 0) {
    const adminTokens = await getAllAdminPushNotifTokenGeneral();
    const adminExtracted = await extractPushToken(adminTokens);
    await sendMultiNotification(
      adminExtracted,
      'Terjadi Masalah 🚨',
      `Ada masalah pada pesanan ini. Mohon segera periksa dan ambil tindakan yang diperlukan!`
    );
    console.log(orders)
    for (const order of orders) {
      console.log(order)
      if (order.vendorId) {
        console.log(`Mengirim notifikasi pengingat untuk vendor ke Vendor ID: ${order.vendorId}`)
        const vendorToken = await getPushNotifTokenVendor(order.vendorId);
        if (vendorToken.pushNotifToken) {
          await sendSingleNotification(vendorToken.pushNotifToken, 'Terjadi Masalah 🚨', `Ada masalah pada pesanan ini. Mohon segera periksa dan ambil tindakan yang diperlukan!`);
        }
      }
      if (order.driverId) {
        console.log(`Mengirim notifikasi pengingat untuk driver ke Driver ID: ${order.driverId}`)
        const driverToken = await getPushNotifTokenUser(order.driverId)
        if (driverToken.pushNotifToken) {
          await sendSingleNotification(driverToken.pushNotifToken, 'Terjadi Masalah 🚨', `Ada masalah pada pesanan ini. Mohon segera periksa dan ambil tindakan yang diperlukan!`);
        }
      }
      if (order.installerId) {
        console.log(`Mengirim notifikasi pengingat untuk installer ke Installer ID: ${order.installerId}`)
        const installerToken = await getPushNotifTokenUser(order.installerId)
        if (installerToken.pushNotifToken) {
          await sendSingleNotification(installerToken.pushNotifToken, 'Terjadi Masalah 🚨', `Ada masalah pada pesanan ini. Mohon segera periksa dan ambil tindakan yang diperlukan!`);
        }
      }
    }
  }
}

cron.schedule('0 7 * * *', () => {
  try {
    console.log('Menjalankan notifikasi untuk order issue');
    reminderLateOrderDaily();
  } catch (error) {
    console.log('Error pada cron job notifikasi:', error);
  }
});

